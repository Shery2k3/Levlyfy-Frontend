"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Phone, TrendingUp, Zap, ArrowRight, Mail, Lock } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthResponse } from "@/types/api";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "name@gmail.com",
    password: "namename",
  });

  // Demo credentials for easy access
  const demoCredentials = {
    email: "name@gmail.com",
    password: "namename"
  };
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post<AuthResponse>("/auth/login", form);
      const { user, token } = res.data.data;
      login(user, token);
      router.push("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      console.error("Login error:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} 
          />
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Decorative Circles/Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-[500px] h-[500px] rounded-full border border-white/5 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
            {/* Middle Ring */}
            <div className="w-[350px] h-[350px] rounded-full border border-white/10 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-spin" style={{ animationDuration: '30s' }} />
            {/* Inner Ring */}
            <div className="w-[200px] h-[200px] rounded-full border-2 border-primary/30 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
            
            {/* Center Icon */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 flex items-center justify-center shadow-2xl shadow-primary/50">
              <Phone className="w-10 h-10 text-white" />
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -top-16 -right-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Performance</p>
                  <p className="text-white font-bold">+127%</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-20 -left-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Calls Today</p>
                  <p className="text-white font-bold">48</p>
                </div>
              </div>
            </div>

            {/* Orbiting Dots */}
            <div className="absolute w-3 h-3 bg-primary rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-[175px] shadow-lg shadow-primary/50" />
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/2 right-0 translate-x-[175px] -translate-y-1/2 shadow-lg shadow-cyan-400/50" />
            <div className="absolute w-2 h-2 bg-green-400 rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-[175px] shadow-lg shadow-green-400/50" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Supercharge your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">
              sales performance
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-md leading-relaxed">
            AI-powered calling platform that helps you close more deals, track performance, and dominate the leaderboard.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Real-time Analytics
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              AI Coaching
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              Team Insights
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 mb-6 shadow-xl shadow-primary/30">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-white/50">Sign in to continue to Levlyfy</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 text-sm font-medium">
                Email address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/20 rounded-xl transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/80 text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="h-12 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary/20 rounded-xl transition-all"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-center text-white/60 text-sm">
              <span className="text-primary font-medium">Demo Mode:</span> Pre-filled with test credentials
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-white/30 text-sm mt-8">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
