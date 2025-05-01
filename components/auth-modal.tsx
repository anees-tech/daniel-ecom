"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { auth, googleProvider, firestore } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Store user info in Firestore under 'users' collection with uid as document ID
        await setDoc(doc(firestore, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Store user info in Firestore with uid as document ID
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError(""); // Clear any existing errors
      alert("Password reset email sent! Check your inbox.");
      // Optionally switch back to login view
      setIsResetPassword(false);
      setIsLogin(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.png"
              alt="logo"
              width={90}
              height={90}
              className="cursor-pointer"
            />
          </div>
          <h2 className="text-2xl font-bold">
            {isResetPassword
              ? "Reset your password"
              : isLogin
              ? "Login to your account"
              : "Create an account"}
          </h2>
          <p className="text-gray-500 mt-1">
            {isResetPassword
              ? "Enter your email to receive a password reset link"
              : isLogin
              ? "Enter your credentials to access your account"
              : "Fill in the details to get started with shopping"}
          </p>
        </div>

        {isResetPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 bg-red-100 p-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full border-gray-300"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full h-12 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white  cursor-pointer"
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 bg-red-100 p-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPassword(true);
                      setError("");
                    }}
                    className="text-sm text-orange-500 hover:text-orange-600  cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full border-gray-300"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-full border-gray-300"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full h-12 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white  cursor-pointer"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          {isResetPassword ? (
            <p className="text-gray-600">
              Remember your password?
              <button
                onClick={() => {
                  setIsResetPassword(false);
                  setIsLogin(true);
                  setError("");
                }}
                className="ml-1 text-orange-500 hover:text-orange-600 font-medium  cursor-pointer"
              >
                Back to Login
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="ml-1 text-orange-500 hover:text-orange-600 font-medium  cursor-pointer"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          )}
        </div>

        {!isResetPassword && (
          <>
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                className="rounded-full cursor-pointer  cursor-pointer"
                onClick={handleGoogleLogin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-red-500"
                >
                  <path d="M21.35 11.1H12v2.9h5.45c-.25 1.3-.97 2.4-2.05 3.1v2.6h3.3c1.95-1.8 3.05-4.45 3.05-7.6 0-.65-.05-1.3-.15-1.9z" />
                  <path d="M12 22c2.7 0 4.95-.9 6.6-2.4l-3.3-2.6c-.9.6-2.05.95-3.3.95-2.55 0-4.7-1.7-5.45-4h-3.3v2.55C5.8 19.85 8.7 22 12 22z" />
                  <path d="M6.55 13.95c-.2-.6-.3-1.25-.3-1.95s.1-1.35.3-1.95V7.5h-3.3C2.4 9.05 2 10.5 2 12s.4 2.95 1.25 4.5l3.3-2.55z" />
                  <path d="M12 4.5c1.5 0 2.85.5 3.9 1.5l2.9-2.9C17 1.9 14.75 1 12 1 8.7 1 5.8 3.15 4.25 6l3.3 2.55C7.3 6.2 9.45 4.5 12 4.5z" />
                </svg>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
