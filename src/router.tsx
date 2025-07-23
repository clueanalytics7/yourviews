
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import PollsPage from "./pages/PollsPage";
import PollDetailPage from "./pages/PollDetailPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import RegisterSuccessPage from "./pages/RegisterSuccessPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPolls from "./pages/admin/AdminPolls";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/polls", element: <PollsPage /> },
      { path: "/polls/:id", element: <PollDetailPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/register-success", element: <RegisterSuccessPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/terms", element: <TermsOfServicePage /> },
      { path: "/privacy", element: <PrivacyPolicyPage /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    errorElement: <NotFound />,
    element: (
      <ProtectedRoute isAdminRoute={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "polls", element: <AdminPolls /> },
      { path: "users", element: <AdminUsers /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "settings", element: <AdminSettingsPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
