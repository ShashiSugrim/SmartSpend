
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getUserEmail, clearAccessToken, isAuthenticated } from "@/lib/api";

const SignInButton = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    if (isAuthenticated()) {
      setUserEmail(getUserEmail());
    }
  }, []);

  const handleLogout = () => {
    clearAccessToken();
    setUserEmail(null);
    setShowDropdown(false);
    window.location.reload(); // Refresh the page to update UI
  };

  const handleSignInClick = () => {
    window.location.href = '/login';
  };

  if (userEmail) {
    // User is signed in
    return (
      <div className="absolute top-5 left-6 z-50 pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-2 bg-white/90 backdrop-blur-md border border-cyan-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-sm font-medium text-gray-800">
              Signed in as <span className="text-cyan-600">{userEmail}</span>
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDropdown && (
            <div className="absolute top-full mt-2 left-0 w-48 bg-white/90 backdrop-blur-md border border-cyan-200 rounded-xl shadow-lg p-2 animate-fade-in">
              <Button
                onClick={() => window.location.href = '/categories'}
                variant="ghost"
                className="w-full justify-start text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              >
                📊 My Categories
              </Button>
              <Button
                onClick={() => window.location.href = '/transactions'}
                variant="ghost"
                className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                💳 My Transactions
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // User is not signed in
  return (
    <div className="absolute top-5 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <Button
        type="button"
        onClick={handleSignInClick}
        className="px-5 py-2 rounded-xl font-medium text-white shadow-md transition-all duration-300 bg-cyan-300 hover:bg-cyan-400"
      >
        Sign In
      </Button>
    </div>
  );
};

export default SignInButton;