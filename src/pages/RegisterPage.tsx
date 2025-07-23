import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight title-gradient">
            Create your account
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Join the community and share your views on important social issues.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <RegisterForm />
        </div>
      </div>
      
      {/* Decorative Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-purple opacity-90"></div>
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
          alt="Community of diverse people"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Share your opinion on important social issues</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>See how your views compare with others</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Help shape the future through dialogue</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
