"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthResponse } from "@/types/api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { login } = useAuth(); // Optional, if you’re using context
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post<AuthResponse>("/auth/login", form);
      const { user, token } = res.data.data;

      console.log("User:", user);
      console.log("Token:", token);

      login(user, token); // save to context/localStorage if using AuthContext
      router.push("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      console.error("Login error:", message);
      setError(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-8 shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute top-2 right-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
