import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RegisterSuccessPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Registration Successful!
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Thank you for registering. Please check your email for a confirmation link to activate your account.
          </p>
          <p className="mt-2 text-center text-gray-600">
            You will need to confirm your email address before you can log in.
          </p>
        </div>
        <div className="mt-5">
          <Link to="/login">
            <Button className="w-full bg-brand-purple hover:bg-brand-light-purple">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
