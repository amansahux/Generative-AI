"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-3xl px-6 py-16 mx-4 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
              CreatorFlow
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {" "}AI
            </span>
          </h1>
          
          {isAuthenticated ? (
            <div className="space-y-8 pt-4">
              <div className="inline-block p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
                <div className="bg-black rounded-full px-6 py-2">
                  <p className="text-lg text-gray-300">
                    Welcome back, <span className="font-semibold text-white">{user?.name}</span>
                  </p>
                </div>
              </div>
              <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">
                {user?.email}
              </p>
              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="px-8 py-3 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 backdrop-blur-md"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10 pt-4">
              <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                Elevate your creative process with AI-driven intelligence.
                The ultimate platform for elite content creators.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/login"
                  className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10">Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 rounded-full font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/20 transition-all hover:scale-105 backdrop-blur-md"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
