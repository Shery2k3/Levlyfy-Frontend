"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthResponse } from "@/types/api";
import api from "@/lib/api";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const { signUp } = useAuth(); // Optional, if you’re using context
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post<AuthResponse>("/auth/signup", form);
      const { user, token } = res.data.data;

      console.log("User:", user);
      console.log("Token:", token);

      signUp(user, token); // save to context/localStorage if using AuthContext
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
        <h2 className="text-2xl font-bold text-white text-center">
          Create Account
        </h2>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
          />
        </div>

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

        {/* Role */}
        <div className="space-y-2">
          <Label className="text-white">Role</Label>
          <Select onValueChange={(value) => setForm({ ...form, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
