"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Trophy, User, LogOut, Settings, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface UserStats {
  callsMade: number;
  dealsClosed: number;
  upsells: number;
  totalScore: number;
  rank: "challenger" | "gold" | "silver" | "bronze";
}

export default function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const { logout, user } = useAuth();

  useEffect(() => {
    if (isExpanded && !userStats) {
      fetchUserStats();
    }
  }, [isExpanded]);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/performance/leaderboard/me?period=weekly');
      setUserStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  // Level based on total calls made (every 10 calls = 1 level)
  const currentLevel = userStats ? Math.floor((userStats.callsMade || 0) / 10) : 0;
  
  // Level title based on level
  const getLevelTitle = (level: number) => {
    if (level >= 8) return "Sales Legend";
    if (level >= 5) return "Sales Master";
    if (level >= 3) return "Rising Star";
    if (level >= 1) return "Apprentice";
    return "Rookie";
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  const isHome = pathname === "/";
  const isLeaderboard = pathname === "/leaderboard";

  return (
    <>
      {/* Fixed floating navigation */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Expanded Profile Panel */}
        {isExpanded && (
          <div className="bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/50 w-72 animate-in slide-in-from-bottom-2 duration-200">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-lg font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{user?.name || "User"}</p>
                <p className="text-white/50 text-sm truncate">{user?.email || ""}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-lg bg-white/5">
                <p className="text-lg font-bold text-primary">{userStats?.callsMade || 0}</p>
                <p className="text-[10px] text-white/50 uppercase">Calls</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/5">
                <p className="text-lg font-bold text-green-400">{userStats?.dealsClosed || 0}</p>
                <p className="text-[10px] text-white/50 uppercase">Deals</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/5">
                <p className="text-lg font-bold text-purple-400">{userStats?.totalScore || 0}</p>
                <p className="text-[10px] text-white/50 uppercase">Score</p>
              </div>
            </div>

            {/* Level Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Level {currentLevel}</p>
                  <p className="text-xs text-primary">
                    {getLevelTitle(currentLevel)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/profile')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm transition-colors"
              >
                <Settings className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Navigation Pill */}
        <div className="flex items-center gap-2 bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl shadow-black/50">
          {/* Home Button */}
          <button
            onClick={() => router.push('/')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
              isHome 
                ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30" 
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => router.push('/leaderboard')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
              isLeaderboard 
                ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30" 
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">Leaderboard</span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10" />

          {/* Profile Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-full transition-all duration-300 ${
              isExpanded 
                ? "bg-white/10 text-white" 
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
