"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ProgressRing from "@/components/progress-ring";
import PerformanceChart from "@/components/performance-chart";
import DialerModal from "@/components/dialer-modal";
import {
  Phone,
  Clock,
  MessageSquareText,
  Star,
  TrendingUp,
  Brain,
  FileText,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Target,
  Award,
  Sparkles,
} from "lucide-react";
import TeamHighlights from "@/components/team-highlights";
import LeaderboardHighlights from "@/components/leaderboard-highlights";
import CallScreen from "@/components/call-screen";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [isCalling, setIsCalling] = useState(false);
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [userStats, setUserStats] = useState<any>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [callsLoading, setCallsLoading] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [feedbackCalls, setFeedbackCalls] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  // Missing call state variables (fixes TS2304 errors)
  const [callConnected, setCallConnected] = useState<boolean>(false);
  const [currentCallNumber, setCurrentCallNumber] = useState<string>("");
  const [currentCallName, setCurrentCallName] = useState<string>("");
  const [callStatus, setCallStatus] = useState<
    "idle" | "calling" | "ringing" | "connected" | "disconnected"
  >("idle");
  // Twilio is now initialized and handled by DialerModal/TwilioProvider

  const handleCall = async (numberToCall?: string, contactName?: string) => {
    console.log("🚀 HANDLE CALL CLICKED!");

    console.log("� HANDLE CALL CLICKED! (page) - delegating to call-start API");

    // Use the provided number or fallback to the hardcoded one
    const phoneNumber = numberToCall || "+923142113157";
    console.log("📞 About to call:", phoneNumber);

    // Set call information
    setCurrentCallNumber(phoneNumber);
    setCurrentCallName(contactName || "Customer");

    try {
      console.log("📡 Making API call to start-call...");
      const response = await api.post("/twillio/start-call", {
        to: phoneNumber,
      });
      console.log("✅ Start-call API response:", response.data);

      setIsCalling(true);
      toast({
        title: "Calling",
        description: `Calling ${contactName || phoneNumber}...`,
      });

      console.log("📞 Call initiated! Now waiting for incoming connection...");
    } catch (error: any) {
      console.error("❌ Error starting call:", error);
      console.error("❌ Error response:", error.response?.data);
      toast({
        title: "Call Failed",
        description: "Could not initiate the call.",
        variant: "destructive",
      });
    }
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setCallConnected(false);
    setCurrentCallNumber("");
    setCurrentCallName("");
    // Close dialer modal when hang up is pressed
    setIsDialerOpen(false);
    // Twilio disconnect is handled by the Dialer Modal / TwilioProvider
  };

  const openDialer = () => {
    setIsDialerOpen(true);
  };

  // Generate mock historical data based on current stats
  const generatePerformanceHistory = (currentStats: any) => {
    if (!currentStats) return [];

    const weeks = 8; // Show 8 weeks of data
    const history = [];

    // Calculate realistic progressions
    const totalCalls = currentStats.callsMade || 0;
    const totalDeals = currentStats.dealsClosed || 0;
    const totalUpsells = currentStats.upsells || 0;

    // If user has very low stats, create a more visible progression
    const minCallsPerWeek =
      totalCalls > 0 ? Math.max(1, Math.floor(totalCalls / weeks)) : 1;
    const minDealsPerWeek =
      totalDeals > 0 ? Math.max(0, Math.floor(totalDeals / weeks)) : 0;
    const minUpsellsPerWeek =
      totalUpsells > 0 ? Math.max(0, Math.floor(totalUpsells / weeks)) : 0;

    for (let i = 0; i < weeks; i++) {
      // Create progressive improvement over time
      const weekProgress = (i + 1) / weeks;
      const variation = 0.7 + Math.random() * 0.6; // 30% variation

      // For small numbers, ensure we show a clear progression
      let weekCalls, weekDeals, weekUpsells;

      if (totalCalls <= 5) {
        // For very small call counts, show clear week-by-week progression
        weekCalls = Math.max(
          0,
          Math.floor(weekProgress * totalCalls * variation)
        );
        weekDeals = Math.min(
          weekCalls,
          Math.floor(weekProgress * totalDeals * variation)
        );
        weekUpsells = Math.min(
          weekDeals,
          Math.floor(weekProgress * totalUpsells * variation)
        );
      } else {
        // For larger numbers, use the original logic
        weekCalls = Math.floor((totalCalls * weekProgress * variation) / 4);
        weekDeals = Math.min(
          weekCalls,
          Math.floor((totalDeals * weekProgress * variation) / 4)
        );
        weekUpsells = Math.min(
          weekDeals,
          Math.floor((totalUpsells * weekProgress * variation) / 4)
        );
      }

      history.push({
        callsMade: Math.max(0, weekCalls),
        dealsClosed: Math.max(0, weekDeals),
        upsells: Math.max(0, weekUpsells),
        period: `Week ${i + 1}`,
      });
    }

    // Make sure we have some data to show even if user has no stats
    if (totalCalls === 0 && totalDeals === 0 && totalUpsells === 0) {
      // Generate sample progression for new users
      for (let i = 0; i < weeks; i++) {
        const progression = (i + 1) * 2; // Gradual increase
        history[i] = {
          callsMade: progression,
          dealsClosed: Math.floor(progression / 3),
          upsells: Math.floor(progression / 5),
          period: `Week ${i + 1}`,
        };
      }
    }

    // Ensure the last few weeks show current stats for realism
    if (history.length > 0 && totalCalls > 0) {
      history[history.length - 1].callsMade = totalCalls;
      history[history.length - 1].dealsClosed = totalDeals;
      history[history.length - 1].upsells = totalUpsells;
    }

    return history;
  };

  const generateMotivationalQuotes = (stats: any, level: number) => {
    if (!stats) return ["Keep up the great work!"];

    const quotes = [];
    const callsToGoal = Math.max(0, 20 - stats.callsMade);
    const dealsToGoal = Math.max(0, 5 - stats.dealsClosed);

    if (callsToGoal > 0) {
      quotes.push(
        `You're only ${callsToGoal} calls away from reaching today's goal—keep going!`
      );
    } else {
      quotes.push(
        "Amazing! You've exceeded your daily call goal—great momentum!"
      );
    }

    if (stats.dealsClosed > 0) {
      quotes.push(
        `Excellent work! You've closed ${stats.dealsClosed} deals this week!`
      );
    }

    if (stats.totalScore > 0) {
      quotes.push(
        `Your total score of ${stats.totalScore} shows real progress—keep building!`
      );
    }

    if (stats.upsells > 0) {
      quotes.push(
        `Great upselling! You've achieved ${stats.upsells} upsells this week!`
      );
    }

    quotes.push(
      `You're currently level ${level}—each call brings you closer to the next level!`
    );

    return quotes;
  };

  // Calculate progress percentages and level
  const callsProgress = userStats
    ? Math.min((userStats.callsMade / 20) * 100, 100)
    : 0; // Goal: 20 calls
  const dealsProgress = userStats
    ? Math.min((userStats.dealsClosed / 5) * 100, 100)
    : 0; // Goal: 5 deals
  const currentLevel = userStats ? Math.floor(userStats.totalScore / 100) : 0; // 100 points per level

  const motivationalQuotes = generateMotivationalQuotes(
    userStats,
    currentLevel
  );

  useEffect(() => {
    fetchUserStats();
    fetchLeaderboardData();
    fetchRecentCalls();
  }, []);

  // Debug effect to log state changes
  useEffect(() => {
    console.log("Recent calls state updated:", recentCalls);
  }, [recentCalls]);

  useEffect(() => {
    console.log("Feedback calls state updated:", feedbackCalls);
  }, [feedbackCalls]);

  const fetchUserStats = async () => {
    try {
      const response = await api.get(
        "/performance/leaderboard/me?period=alltime"
      );
      setUserStats(response.data.data);
      // Generate performance history based on current stats
      const history = generatePerformanceHistory(response.data.data);
      console.log("Generated performance history:", history);
      console.log("Current stats:", response.data.data);
      setPerformanceHistory(history);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await api.get("/performance/leaderboard?period=alltime");
      setLeaderboardData(response.data.data?.slice(0, 3) || []); // Top 3
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

  const fetchRecentCalls = async () => {
    setCallsLoading(true);
    try {
      const response = await api.get("/call/my-calls");
      console.log("Raw API response:", response.data);
      // Get the 5 most recent calls - the calls are nested under data.calls
      const calls = response.data.data?.calls?.slice(0, 5) || [];
      console.log("Extracted calls:", calls);
      setRecentCalls(calls);
    } catch (error) {
      console.error("Failed to fetch recent calls:", error);
    } finally {
      setCallsLoading(false);
    }
  };

  const fetchFeedbackCalls = async () => {
    try {
      const response = await api.get("/call/my-calls");
      console.log("Feedback calls API response:", response.data);
      // Filter calls that have been analyzed - the calls are nested under data.calls
      const allCalls = response.data.data?.calls || [];
      const analyzedCalls = allCalls.filter(
        (call: any) => call.status === "analyzed"
      );
      console.log("Analyzed calls:", analyzedCalls);
      setFeedbackCalls(analyzedCalls);
    } catch (error) {
      console.error("Failed to fetch feedback calls:", error);
    }
  };

  const viewCallFeedback = (call: any) => {
    setSelectedCall(call);
    setShowFeedbackModal(true);
  };

  const openFeedbackModal = async () => {
    await fetchFeedbackCalls();
    setShowFeedbackModal(true);
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 3000);

    return () => clearInterval(quoteInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Phone className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative flex flex-col lg:flex-row px-4 md:px-8 py-6 gap-6 min-h-screen">
        {/* left div */}
        <div className="flex flex-col space-y-6 w-full lg:w-1/2">
          {/* welcome and daily goals */}
          <div className="w-full flex flex-col lg:flex-row gap-6">
            {/* welcome card - Enhanced */}
            <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] border border-white/5 shadow-xl">
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
                {/* Animated rings */}
                <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden md:block">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-spin" style={{ animationDuration: '20s' }} />
                    <div className="absolute inset-4 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-8 rounded-full border-2 border-primary/30 animate-spin" style={{ animationDuration: '10s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      Hello, {user?.name || "User"}!
                    </h1>
                    <p className="text-white/50 text-sm mb-4">
                      Welcome back to Levlyfy
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-white">
                        Level {currentLevel}
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-sm text-primary font-semibold">
                        {currentLevel >= 5
                          ? "Sales Master"
                          : currentLevel >= 3
                          ? "Rising Star"
                          : "Rookie"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* daily goals - Enhanced */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 p-6 flex flex-col shadow-xl w-full lg:w-80">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-white">Daily Goal</h2>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <ProgressRing
                  progress={callsProgress}
                  size={120}
                  strokeWidth={12}
                  text={`${userStats?.callsMade || 0}/20`}
                  textClassName="text-xl font-bold text-white"
                  strokeColor="#3b82f6"
                  bgColor="rgba(59, 130, 246, 0.1)"
                />
                <p className="text-primary text-sm mt-3 font-medium">
                  calls completed
                </p>
              </div>
            </div>
          </div>

          {/* deals - Enhanced */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 p-6 shadow-xl">
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-white/60 uppercase tracking-wider font-semibold text-sm">
                Performance Overview
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {userStats?.callsMade || 0}
                </div>
                <div className="text-sm text-white/50">Total Calls</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-green-500/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {userStats?.dealsClosed || 0}
                </div>
                <div className="text-sm text-white/50">Deals Closed</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {userStats?.upsells || 0}
                </div>
                <div className="text-sm text-white/50">Upsells</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-white/50">Weekly Goal Progress</span>
                <span className="text-sm text-primary font-semibold">
                  {Math.round(dealsProgress)}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${dealsProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Updated buttons section - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <DialerModal
              trigger={
                <Button className="w-full h-14 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white text-lg font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Call Customer
                </Button>
              }
              open={isDialerOpen}
              onOpenChange={setIsDialerOpen}
            />
            <Button
              onClick={openFeedbackModal}
              className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-white text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Brain className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              AI Feedback
            </Button>
          </div>

          {/* Call Logging Section - Enhanced */}
          <div className="w-full">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 p-6 shadow-xl">
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-white">Recent Calls</h2>
                </div>
                <Button
                  onClick={fetchRecentCalls}
                  variant="outline"
                  size="sm"
                  disabled={callsLoading}
                  className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30 text-white"
                >
                  {callsLoading ? "Loading..." : "Refresh"}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-white/50 border-b border-white/10">
                      <th className="pb-4 font-medium text-sm">Date</th>
                      <th className="pb-4 font-medium text-sm">Source</th>
                      <th className="pb-4 font-medium text-sm">Status</th>
                      <th className="pb-4 font-medium text-sm">Score</th>
                      <th className="pb-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {callsLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-white/50"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                            <span>Loading calls...</span>
                          </div>
                        </td>
                      </tr>
                    ) : recentCalls.length > 0 ? (
                      recentCalls.map((call) => (
                        <tr
                          key={call._id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 text-sm text-white/80">
                            {new Date(call.createdAt).toLocaleDateString()}{" "}
                            <span className="text-white/40">{new Date(call.createdAt).toLocaleTimeString()}</span>
                          </td>
                          <td className="py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                call.source === "twilio-recording"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-purple-500/20 text-purple-400"
                              }`}
                            >
                              {call.source === "twilio-recording"
                                ? "Twilio"
                                : "Manual"}
                            </span>
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                call.status === "analyzed"
                                  ? "bg-green-500/20 text-green-400"
                                  : call.status === "processing"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : call.status === "failed"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-white/10 text-white/60"
                              }`}
                            >
                              {call.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm">
                            {call.score ? (
                              <span
                                className={`font-semibold ${
                                  call.score >= 80
                                    ? "text-green-400"
                                    : call.score >= 60
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                              >
                                {call.score}/100
                              </span>
                            ) : (
                              <span className="text-white/30">-</span>
                            )}
                          </td>
                          <td className="py-4">
                            {call.status === "analyzed" && (
                              <Button
                                onClick={() => viewCallFeedback(call)}
                                variant="outline"
                                size="sm"
                                className="text-xs bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30 text-white"
                              >
                                View Feedback
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-16 text-center"
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                              <Phone className="w-8 h-8 text-white/30" />
                            </div>
                            <div>
                              <p className="font-semibold text-white text-lg mb-1">
                                No calls yet
                              </p>
                              <p className="text-sm text-white/40">
                                Start making calls to see your logs here
                              </p>
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
        </div>

        {/* Call Screen - Keep existing implementation */}
        {isCalling && (
          <CallScreen
            contactName={currentCallName}
            contactPhone={currentCallNumber}
            onEndCall={handleEndCall}
            isConnected={callConnected}
            callStatus={callStatus}
          />
        )}

        {/* right div */}
        <div className="flex flex-col space-y-6 w-full lg:w-1/2">
          {/* insights box - Enhanced */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 p-6 shadow-xl">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Insights Box</h2>
            </div>
            <div className="border-l-2 border-primary/50 pl-4">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Motivational Insights</h3>
              {/* RECOMMENDATIONS for Dynamic Insights:
                  1. Performance trends: "Your call-to-deal ratio improved 15% this week"
                  2. Comparative insights: "You're 3 calls ahead of last week's pace"
                  3. Goal tracking: "On track to hit monthly target by [date]"
                  4. Skill insights: "Your average call duration is optimal at 8.5 minutes"
                  5. Market insights: "Best calling times: 10-11 AM (32% higher success rate)"
                  6. AI-powered recommendations based on call analysis
                  7. Seasonal/trend analysis from historical data
              */}
              <div className="relative h-20 bg-white/5 rounded-xl p-4 flex items-center border border-white/5">
                {motivationalQuotes.map((quote, index) => (
                  <p
                    key={index}
                    className={`text-sm text-white/80 absolute inset-4 flex items-center transition-all duration-500 ${
                      currentQuote === index
                        ? "opacity-100 transform translate-y-0"
                        : "opacity-0 transform translate-y-2"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" />
                    {quote}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* performance tracker - Enhanced */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1830] to-[#0a1628] border border-white/5 shadow-xl">
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Performance Tracker</h2>
            </div>
            <div className="p-4">
              <PerformanceChart data={performanceHistory} isLoading={loading} />
            </div>
          </div>

          {/* team highlights - wrapper for consistency */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 shadow-xl">
            {/* RECOMMENDATIONS for Team Highlights:
                1. Create /api/performance/team-highlights endpoint
                2. Aggregate recent achievements: top deals, high call volumes, best sentiment scores
                3. Real-time updates when team members achieve milestones
                4. Filter by time period (today, this week, this month)
                5. Include achievement types: deals_closed, calls_made, sentiment_score, upsells
                6. Add team member avatars from user profiles
                7. Notification system for celebrating team wins
            */}
            <TeamHighlights />
          </div>

          {/* leaderboard highlights - wrapper for consistency */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 shadow-xl">
            <LeaderboardHighlights data={leaderboardData} />
          </div>
        </div>
      </div>

      {/* AI Feedback Modal - Enhanced */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0d1117] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              AI Call Analysis & Feedback
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Review AI-generated insights and feedback from your analyzed calls
            </DialogDescription>
          </DialogHeader>

          {selectedCall ? (
            // Single call feedback view
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Call from{" "}
                  {new Date(selectedCall.createdAt).toLocaleDateString()}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCall(null)}
                  size="sm"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  Back to All Calls
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white/70">Overall Score</span>
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      selectedCall.score >= 80
                        ? "text-green-400"
                        : selectedCall.score >= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedCall.score || "N/A"}/100
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquareText className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white/70">Sentiment</span>
                  </div>
                  <Badge
                    variant={
                      selectedCall.sentiment === "positive"
                        ? "default"
                        : selectedCall.sentiment === "negative"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedCall.sentiment || "neutral"}
                  </Badge>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white/70">Results</span>
                  </div>
                  <div className="space-y-1">
                    {selectedCall.dealClosed && (
                      <Badge className="bg-green-500/20 text-green-400 border-0">
                        Deal Closed
                      </Badge>
                    )}
                    {selectedCall.upsell && (
                      <Badge className="bg-primary/20 text-primary border-0">
                        Upsell
                      </Badge>
                    )}
                    {!selectedCall.dealClosed && !selectedCall.upsell && (
                      <span className="text-white/40 text-sm">No deal</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedCall.summary && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-white">
                    <FileText className="w-4 h-4 text-white/50" />
                    Call Summary
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {selectedCall.summary}
                  </p>
                </div>
              )}

              {selectedCall.feedback && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-white">
                    <Brain className="w-4 h-4 text-primary" />
                    AI Feedback & Recommendations
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedCall.feedback}
                  </p>
                </div>
              )}

              {selectedCall.transcript && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2 text-white">Call Transcript</h4>
                  <div className="max-h-40 overflow-y-auto text-sm text-white/70 leading-relaxed">
                    {selectedCall.transcript}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // List of all calls with feedback
            <div className="space-y-4">
              {feedbackCalls.length > 0 ? (
                <div className="space-y-3">
                  {feedbackCalls.map((call) => (
                    <div
                      key={call._id}
                      className="bg-white/5 border border-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/10 hover:border-primary/30 transition-all"
                      onClick={() => setSelectedCall(call)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-white">
                            {new Date(call.createdAt).toLocaleDateString()} at{" "}
                            {new Date(call.createdAt).toLocaleTimeString()}
                          </span>
                          <Badge
                            variant={
                              call.sentiment === "positive"
                                ? "default"
                                : call.sentiment === "negative"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {call.sentiment || "neutral"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {call.dealClosed && (
                            <ThumbsUp className="w-4 h-4 text-green-400" />
                          )}
                          {call.upsell && (
                            <Star className="w-4 h-4 text-yellow-400" />
                          )}
                          <span
                            className={`font-bold ${
                              call.score >= 80
                                ? "text-green-400"
                                : call.score >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {call.score || "N/A"}/100
                          </span>
                        </div>
                      </div>
                      {call.summary && (
                        <p className="text-sm text-white/50 line-clamp-2">
                          {call.summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-10 h-10 text-white/30" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    No AI Feedback Available
                  </h3>
                  <p className="text-white/50 mb-6">
                    Start making calls to get AI-powered insights and feedback
                    on your performance.
                  </p>
                  <Button 
                    onClick={() => setShowFeedbackModal(false)}
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white"
                  >
                    Start Calling
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
