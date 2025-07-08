
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileQuestion, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      href: "/admin",
    },
    {
      label: "Polls",
      icon: <FileQuestion className="mr-2 h-5 w-5" />,
      href: "/admin/polls",
    },
    {
      label: "Users",
      icon: <Users className="mr-2 h-5 w-5" />,
      href: "/admin/users",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="mr-2 h-5 w-5" />,
      href: "/admin/analytics",
    },
    {
      label: "Settings",
      icon: <Settings className="mr-2 h-5 w-5" />,
      href: "/admin/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white border-r border-gray-200 w-64 py-6">
      <div className="px-6 mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold title-gradient">YourViews</span>
          <span className="text-xs bg-brand-light-purple text-white px-2 py-0.5 rounded-full">Admin</span>
        </Link>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-brand-light-purple bg-opacity-10 text-brand-purple"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-4 mt-6 border-t border-gray-200 pt-6">
        <div className="flex items-center px-2 mb-4">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-brand-purple text-white flex items-center justify-center">
              {user?.username.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.username || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'admin@yourviews.com'}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Link to="/">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center text-gray-700 border-gray-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Back to Site
            </Button>
          </Link>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
