
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight title-gradient">
            Sign in to YourViews
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Your opinion matters. Let's make a difference together.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-brand-purple hover:text-brand-light-purple">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-blue opacity-90"></div>
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80"
          alt="People discussing social issues"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md p-8 text-white">
            <blockquote className="text-2xl font-medium italic">
              "The opinions of others shape our world. Make yours count."
            </blockquote>
            <p className="mt-4 font-semibold">YourViews Community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
