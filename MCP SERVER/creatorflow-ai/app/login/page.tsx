"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }
      
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden px-4">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-60"></div>

      <div className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-6">
             <h2 className="text-2xl font-bold tracking-tight text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">CreatorFlow</span>
             </h2>
          </Link>
          <h3 className="text-3xl font-light text-white tracking-wide">Welcome Back</h3>
          <p className="mt-2 text-sm text-gray-400">Enter your credentials to continue</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-center text-red-300 bg-red-900/30 border border-red-500/30 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all sm:text-sm backdrop-blur-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all sm:text-sm backdrop-blur-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="relative flex w-full justify-center py-3.5 px-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              New to CreatorFlow?{" "}
              <Link href="/signup" className="font-semibold text-white hover:text-blue-400 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
