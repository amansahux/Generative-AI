"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          CreatorFlow AI
        </h1>
        
        {isAuthenticated ? (
          <div className="space-y-6">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span>!
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Logged in as: {user?.email}
            </p>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-3 md:px-8"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your AI-powered content creation workflow platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
