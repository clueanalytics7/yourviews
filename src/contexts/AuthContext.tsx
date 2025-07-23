import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, supabaseUrl } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: useEffect started.");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        console.log("AuthContext: onAuthStateChange event:", event, "session:", session);
        try {
          if (session) {
            const { user: authUser } = session;
            console.log("AuthContext: Session found, fetching profile for user:", authUser.id);
            const queryPromise = supabase
              .from("user_profile")
              .select("user_id, user_name, is_admin")
              .eq("user_id", authUser.id)
              .single();
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("user_profile query timed out after 15s")), 15000)
            );
            let { data: profile, error: profileError, status, statusText } = await Promise.race([queryPromise, timeoutPromise]);
            console.log("AuthContext: Profile fetch query response:", { profile, profileError, status, statusText });

            if (profileError && profileError.code !== 'PGRST116') {
              console.error("AuthContext: Profile fetch error:", profileError.message, profileError.details, profileError.hint, { url: supabaseUrl });
              throw new Error(`Failed to fetch user_profile: ${profileError.message}`);
            }

            if (!profile || profileError?.code === 'PGRST116') {
              console.log("AuthContext: No profile found or PGRST116 error, attempting to create one...");
              const { data: newProfile, error: insertError } = await supabase
                .from("user_profile")
                .insert({
                  user_id: authUser.id,
                  user_name: authUser.user_metadata?.user_name || authUser.email || 'anonymous',
                  is_admin: false,
                  created_at: new Date().toISOString(),
                })
                .select()
                .single();
              if (insertError) {
                console.error("AuthContext: Profile insert error:", insertError.message, insertError.details, insertError.hint, { url: supabaseUrl });
                throw new Error(`Failed to insert user_profile: ${insertError.message}`);
              }
              profile = newProfile;
            }

            const userData = {
              id: authUser.id,
              email: authUser.email || '',
              is_admin: profile.is_admin ?? false,
              user_name: profile.user_name ?? authUser.user_metadata?.user_name ?? authUser.email ?? "anonymous",
            };
            setUser(userData);
            console.log("AuthContext: User set:", userData);
          } else {
            console.log("AuthContext: No session found, setting user to null.");
            setUser(null);
          }
        } catch (error: unknown) {
          console.error("AuthContext: Auth state change error:", (error as Error).message, (error as Error).stack, { url: supabaseUrl });
          setUser(null);
        } finally {
          console.log("AuthContext: setIsLoading(false) called.");
          setIsLoading(false);
        }
      }
    );

    return () => {
      console.log("AuthContext: Cleaning up auth listener.");
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Login error:", error.message, error, { url: supabaseUrl });
        throw new Error(`Login failed: ${error.message}`);
      }
      console.log("Login successful, user:", data.user);
    } catch (error: unknown) {
      console.error("Login function caught error:", (error as Error).message, (error as Error).stack, { url: supabaseUrl });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { user_name: userName || email } },
      });
      if (error) {
        console.error("Signup error:", error.message, error, { url: supabaseUrl });
        throw new Error(`Signup failed: ${error.message}`);
      }
      console.log("Signup successful, user:", data.user);
      if (data.user) {
        const { error: profileError } = await supabase
          .from("user_profile")
          .upsert({
            user_id: data.user.id,
            user_name: userName || email,
            is_admin: false,
            created_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        if (profileError) {
          console.error("Signup profile upsert error:", profileError.message, profileError.details, { url: supabaseUrl });
          throw new Error(`Failed to upsert user_profile: ${profileError.message}`);
        }
      }
    } catch (error: unknown) {
      console.error("Signup function caught error:", (error as Error).message, (error as Error).stack, { url: supabaseUrl });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(`Logout failed: ${error.message}`);
      setUser(null);
    } catch (error: unknown) {
      console.error("Logout error:", (error as Error).message, (error as Error).stack, { url: supabaseUrl });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin: user?.is_admin || false, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};