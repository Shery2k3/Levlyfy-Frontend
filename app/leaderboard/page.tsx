"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Phone, TrendingUp, Zap, Crown, Medal, Award } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface LeaderboardEntry {
  place: number;
  userId: string;
  name: string;
  callsMade: number;
  dealsClosed: number;
  upsells: number;
  totalScore: number;
  rank: "challenger" | "gold" | "silver" | "bronze";
}

interface UserStats {
  callsMade: number;
  dealsClosed: number;
  upsells: number;
  totalScore: number;
  rank: "challenger" | "gold" | "silver" | "bronze";
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("calls-made");
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboardData();
    fetchUserStats();
  }, [timePeriod]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/performance/leaderboard?period=${timePeriod}`);
      setLeaderboardData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get(`/performance/leaderboard/me?period=${timePeriod}`);
      setUserStats(response.data.data || null);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      setUserStats(null);
    }
  };

  const getFilteredData = () => {
    if (activeTab === "deals-closed") {
      return [...leaderboardData].sort((a, b) => b.dealsClosed - a.dealsClosed);
    } else if (activeTab === "upsells") {
      return [...leaderboardData].sort((a, b) => b.upsells - a.upsells);
    }
    return [...leaderboardData].sort((a, b) => b.callsMade - a.callsMade);
  };

  const topPerformers = getFilteredData().slice(0, 3);
  const tableData = getFilteredData();

  return (
    <>
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative px-4 md:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] border border-white/5 shadow-xl">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            {/* Animated rings */}
            <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full border border-white/5 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-4 rounded-full border border-amber-500/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                <div className="absolute inset-8 rounded-full border-2 border-amber-500/30 animate-spin" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-amber-400 font-medium text-sm uppercase tracking-wider">Rankings</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                Leaderboard
              </h1>
              <p className="text-white/50 text-lg max-w-lg">
                Rise to the top! Compete, improve, and achieve greatness.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Tabs
            defaultValue="calls-made"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full sm:w-fit"
          >
            <TabsList className="bg-[#0d1117] border border-white/10 w-full sm:w-auto grid grid-cols-3 sm:flex rounded-xl p-1">
              <TabsTrigger 
                value="calls-made" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/60"
              >
                <Phone className="w-4 h-4 mr-2 hidden sm:block" />
                Calls Made
              </TabsTrigger>
              <TabsTrigger 
                value="deals-closed" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/60"
              >
                <TrendingUp className="w-4 h-4 mr-2 hidden sm:block" />
                Deals Closed
              </TabsTrigger>
              <TabsTrigger 
                value="upsells" 
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/60"
              >
                <Zap className="w-4 h-4 mr-2 hidden sm:block" />
                Upsells
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1" />

          <Tabs
            defaultValue="weekly"
            value={timePeriod}
            onValueChange={setTimePeriod}
            className="w-full sm:w-fit"
          >
            <TabsList className="bg-[#0d1117] border border-white/10 w-full sm:w-auto grid grid-cols-3 sm:flex rounded-xl p-1">
              <TabsTrigger 
                value="weekly" 
                className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger 
                value="monthly" 
                className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger 
                value="all-time" 
                className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
              >
                All-Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Top 3 Performers - Podium Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-white/5" />
                  <div className="flex-1">
                    <div className="h-5 bg-white/5 rounded-lg w-24 mb-2" />
                    <div className="h-4 bg-white/5 rounded-lg w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-16 bg-white/5 rounded-xl" />
                  <div className="h-16 bg-white/5 rounded-xl" />
                  <div className="h-16 bg-white/5 rounded-xl" />
                </div>
              </div>
            ))
          ) : (
            topPerformers.map((performer, index) => (
              <TopPerformerCard
                key={performer.userId}
                place={index + 1}
                name={performer.name}
                rank={performer.rank}
                calls={performer.callsMade}
                deals={performer.dealsClosed}
                upsells={performer.upsells}
                score={performer.totalScore}
              />
            ))
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 shadow-xl">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
          
          {/* Table Header */}
          <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-white">Full Rankings</h2>
            </div>
            <span className="text-white/40 text-sm">{tableData.length} participants</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-left text-sm font-medium text-white/50">Place</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-white/50">Agent</th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-white/50">
                    {activeTab === "calls-made" ? "Calls" : activeTab === "deals-closed" ? "Deals" : "Upsells"}
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-white/50">
                    {activeTab === "calls-made" ? "Deals" : activeTab === "deals-closed" ? "Calls" : "Deals"}
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-white/50">Score</th>
                  <th className="py-4 px-6 text-center text-sm font-medium text-white/50">Rank</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <tr key={index} className="border-b border-white/5 animate-pulse">
                      <td className="py-4 px-6"><div className="w-8 h-8 bg-white/5 rounded-lg" /></td>
                      <td className="py-4 px-6"><div className="h-4 bg-white/5 rounded-lg w-32" /></td>
                      <td className="py-4 px-6"><div className="h-4 bg-white/5 rounded-lg w-16 mx-auto" /></td>
                      <td className="py-4 px-6"><div className="h-4 bg-white/5 rounded-lg w-16 mx-auto" /></td>
                      <td className="py-4 px-6"><div className="h-4 bg-white/5 rounded-lg w-16 mx-auto" /></td>
                      <td className="py-4 px-6"><div className="h-6 bg-white/5 rounded-full w-20 mx-auto" /></td>
                    </tr>
                  ))
                ) : tableData.length > 0 ? (
                  tableData.map((entry, index) => (
                    <LeaderboardRow
                      key={entry.userId}
                      place={index + 1}
                      name={entry.name}
                      primaryStat={
                        activeTab === "calls-made" ? entry.callsMade :
                        activeTab === "deals-closed" ? entry.dealsClosed :
                        entry.upsells
                      }
                      secondaryStat={
                        activeTab === "calls-made" ? entry.dealsClosed :
                        activeTab === "deals-closed" ? entry.callsMade :
                        entry.dealsClosed
                      }
                      score={entry.totalScore}
                      rank={entry.rank}
                      isCurrentUser={user?._id === entry.userId}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                          <Trophy className="w-8 h-8 text-white/20" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg mb-1">No rankings yet</p>
                          <p className="text-white/40 text-sm">Start making calls to appear on the leaderboard</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function TopPerformerCard({
  place,
  name,
  rank,
  calls,
  deals,
  upsells,
  score,
}: {
  place: number;
  name: string;
  rank: "challenger" | "gold" | "silver" | "bronze";
  calls: number;
  deals: number;
  upsells: number;
  score: number;
}) {
  const getPlaceStyles = () => {
    switch (place) {
      case 1:
        return {
          gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
          border: "border-amber-500/30",
          icon: <Crown className="w-5 h-5 text-amber-400" />,
          badge: "bg-gradient-to-br from-amber-500 to-yellow-600",
          glow: "shadow-amber-500/20"
        };
      case 2:
        return {
          gradient: "from-gray-400/20 via-gray-500/10 to-transparent",
          border: "border-gray-400/30",
          icon: <Medal className="w-5 h-5 text-gray-300" />,
          badge: "bg-gradient-to-br from-gray-400 to-gray-500",
          glow: "shadow-gray-400/20"
        };
      case 3:
        return {
          gradient: "from-amber-700/20 via-amber-800/10 to-transparent",
          border: "border-amber-700/30",
          icon: <Medal className="w-5 h-5 text-amber-600" />,
          badge: "bg-gradient-to-br from-amber-700 to-amber-800",
          glow: "shadow-amber-700/20"
        };
      default:
        return {
          gradient: "from-primary/10 to-transparent",
          border: "border-white/10",
          icon: <Award className="w-5 h-5 text-primary" />,
          badge: "bg-gradient-to-br from-primary to-blue-600",
          glow: "shadow-primary/20"
        };
    }
  };

  const getRankBadge = () => {
    switch (rank) {
      case "challenger":
        return { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30" };
      case "gold":
        return { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/30" };
      case "silver":
        return { bg: "bg-gray-400/20", text: "text-gray-300", border: "border-gray-400/30" };
      case "bronze":
        return { bg: "bg-amber-600/20", text: "text-amber-300", border: "border-amber-600/30" };
      default:
        return { bg: "bg-white/10", text: "text-white/60", border: "border-white/10" };
    }
  };

  const styles = getPlaceStyles();
  const rankBadge = getRankBadge();

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border ${styles.border} shadow-xl ${styles.glow} hover:scale-[1.02] transition-transform duration-300`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} pointer-events-none`} />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          {/* Avatar with place badge */}
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-lg ${styles.badge} flex items-center justify-center shadow-lg text-white text-sm font-bold`}>
              {place}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${rankBadge.bg} ${rankBadge.text} border ${rankBadge.border}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${rank === 'challenger' ? 'bg-purple-400' : rank === 'gold' ? 'bg-yellow-400' : rank === 'silver' ? 'bg-gray-400' : 'bg-amber-500'}`} />
                {rank.charAt(0).toUpperCase() + rank.slice(1)}
              </span>
            </div>
          </div>

          {/* Trophy icon */}
          <div className={`w-12 h-12 rounded-xl ${styles.badge} flex items-center justify-center shadow-lg`}>
            {styles.icon}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xl font-bold text-primary">{calls}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Calls</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xl font-bold text-green-400">{deals}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Deals</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xl font-bold text-purple-400">{upsells}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Upsells</p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">Total Score</span>
            <span className="text-sm font-bold text-white">{score}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${styles.badge} rounded-full`}
              style={{ width: `${Math.min((score / 500) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardRow({
  place,
  name,
  primaryStat,
  secondaryStat,
  score,
  rank,
  isCurrentUser = false,
}: {
  place: number;
  name: string;
  primaryStat: number;
  secondaryStat: number;
  score: number;
  rank: "challenger" | "gold" | "silver" | "bronze";
  isCurrentUser?: boolean;
}) {
  const getPlaceBadge = () => {
    switch (place) {
      case 1:
        return "bg-gradient-to-br from-amber-500 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-br from-gray-400 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-br from-amber-700 to-amber-800 text-white";
      default:
        return "bg-white/10 text-white/60";
    }
  };

  const getRankBadge = () => {
    switch (rank) {
      case "challenger":
        return { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30", dot: "bg-purple-400" };
      case "gold":
        return { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/30", dot: "bg-yellow-400" };
      case "silver":
        return { bg: "bg-gray-400/20", text: "text-gray-300", border: "border-gray-400/30", dot: "bg-gray-400" };
      case "bronze":
        return { bg: "bg-amber-600/20", text: "text-amber-300", border: "border-amber-600/30", dot: "bg-amber-500" };
      default:
        return { bg: "bg-white/10", text: "text-white/60", border: "border-white/10", dot: "bg-white/40" };
    }
  };

  const rankStyles = getRankBadge();

  return (
    <tr className={`border-b border-white/5 transition-colors ${isCurrentUser ? "bg-primary/10" : "hover:bg-white/5"}`}>
      <td className="py-4 px-6">
        <div className={`w-8 h-8 rounded-lg ${getPlaceBadge()} flex items-center justify-center text-sm font-bold`}>
          {place}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <span className="text-white font-medium">{name}</span>
            {isCurrentUser && <span className="ml-2 text-primary text-xs font-medium">(You)</span>}
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-center">
        <span className="text-white font-semibold">{primaryStat}</span>
      </td>
      <td className="py-4 px-6 text-center">
        <span className="text-white/70">{secondaryStat}</span>
      </td>
      <td className="py-4 px-6 text-center">
        <span className="text-white font-semibold">{score}</span>
      </td>
      <td className="py-4 px-6 text-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${rankStyles.bg} ${rankStyles.text} border ${rankStyles.border}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${rankStyles.dot}`} />
          {rank.charAt(0).toUpperCase() + rank.slice(1)}
        </span>
      </td>
    </tr>
  );
}
