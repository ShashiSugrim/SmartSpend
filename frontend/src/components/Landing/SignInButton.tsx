
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignInButton = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = () => {
    console.log("Sign in clicked");
  };

  return (
    // IMPORTANT: add z-50 so the button sits above overlays
    <div ref={ref} className="absolute top-5 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <Button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`px-5 py-2 rounded-xl font-medium text-white shadow-md transition-all duration-300 ${
          open ? "bg-cyan-400 hover:bg-cyan-500" : "bg-cyan-300 hover:bg-cyan-400"
        }`}
      >
        {open ? "Close" : "Sign In"}
      </Button>

      {open && (
        <div className="mt-3 w-64 bg-white/90 backdrop-blur-md border border-cyan-200 rounded-2xl shadow-lg p-5 animate-fade-in space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Welcome Back</h3>
          <Input type="email" placeholder="Email" className="h-9 border-cyan-100 focus-visible:ring-cyan-300" />
          <Input type="password" placeholder="Password" className="h-9 border-cyan-100 focus-visible:ring-cyan-300" />
          <Button type="button" onClick={handleSignIn} className="w-full bg-cyan-400 hover:bg-cyan-500 text-white">
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
};

export default SignInButton;