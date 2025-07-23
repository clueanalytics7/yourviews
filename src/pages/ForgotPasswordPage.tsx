import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <ForgotPasswordForm />
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-brand-purple hover:text-brand-light-purple">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;