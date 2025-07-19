"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProgressRing from "@/components/progress-ring";
import PerformanceChart from "@/components/performance-chart";
import {
  Phone,
  Clock,
  MessageSquareText,
  Star,
  TrendingUp,
} from "lucide-react";
import TeamHighlights from "@/components/team-highlights";
import LeaderboardHighlights from "@/components/leaderboard-highlights";
import CallScreen from "@/components/call-screen";
import ModernDialer from "@/components/modern-dialer";
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
  const [callConnected, setCallConnected] = useState(false);
  const [currentCallNumber, setCurrentCallNumber] = useState("");
  const [currentCallName, setCurrentCallName] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const [twilioDevice, setTwilioDevice] = useState<any>(null);

  useEffect(() => {
    const setupTwilio = async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        return;
      }

      try {
        console.log("🎫 Requesting microphone permission...");
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("✅ Microphone permission granted!");
        
        console.log("🎫 Fetching Twilio token...");
        const response = await api.get("/twillio/token");
        const { token } = response.data;
        console.log("✅ Token received! Length:", token.length);
        
        console.log("📱 Setting up Twilio Device with token");
        
        // Dynamically import Twilio Device to avoid SSR issues
        const { Device } = await import("twilio-client");
        const device = new Device();
        console.log("📱 Device instance created, setting up...");
        
        device.setup(token, {
          codecPreferences: ["pcmu", "opus"] as any,
          fakeLocalDTMF: true,
          enableRingingState: true,
        });

        device.on("ready", () => {
          console.log("✅ Twilio Device Ready! Status:", device.status());
          setTwilioDevice(device);
          toast({
            title: "Device Ready",
            description: "Twilio device is ready for calls",
          });
        });

        device.on("error", (error) => {
          console.error("❌ Twilio Device Error:", error);
          console.error("❌ Error Details:", {
            message: error.message,
            code: error.code,
          });
          toast({
            title: "Device Error",
            description: `Twilio device error: ${error.message}`,
            variant: "destructive",
          });
        });

        device.on("connect", (conn) => {
          console.log("🔗 Call connected! Connection details:", conn);
          console.log("🔗 Connection parameters:", conn.parameters);
          setCallConnected(true);
          toast({
            title: "Connected",
            description: "Call is now active. You can speak!",
          });
        });

        device.on("disconnect", (conn) => {
          console.log("📞 Call disconnected. Connection:", conn);
          console.log("📞 Disconnect reason:", conn ? conn.error : 'Unknown');
          setIsCalling(false);
          setCallConnected(false);
          setCurrentCallNumber("");
          setCurrentCallName("");
          toast({
            title: "Call Ended",
            description: "The call has been disconnected.",
          });
        });

        device.on("incoming", (conn) => {
          console.log("📞 🔥 INCOMING CALL FROM TWILIO! This is what we want!");
          console.log("📞 Connection object:", conn);
          console.log("📞 Connection parameters:", conn.parameters);
          console.log("📞 From:", conn.parameters?.From);
          console.log("📞 To:", conn.parameters?.To);
          
          toast({
            title: "Incoming Call",
            description: "Connecting your browser to the phone call...",
          });
          
          console.log("📞 Accepting incoming connection...");
          // Auto-accept the incoming connection from your backend
          conn.accept();
          console.log("✅ Connection accepted! You should be able to speak now!");
        });

        device.on("cancel", () => {
          console.log("📞 Call was cancelled");
        });

        device.on("presence", (presenceEvent) => {
          console.log("👥 Presence event:", presenceEvent);
        });

      } catch (error) {
        console.error("❌ Error setting up Twilio:", error);
        console.error("❌ Full error object:", error);
        toast({
          title: "Setup Error",
          description: "Failed to set up Twilio. Check console for details.",
          variant: "destructive",
        });
      }
    };

    if (user) {
      console.log("👤 User authenticated, setting up Twilio...");
      setupTwilio();
    } else {
      console.log("❌ No user authenticated yet");
    }

    return () => {
      if (twilioDevice && typeof window !== 'undefined') {
        console.log("🧹 Cleaning up Twilio device");
        twilioDevice.destroy();
        setTwilioDevice(null);
      }
    };
  }, [user, toast]);

  const handleCall = async (numberToCall?: string, contactName?: string) => {
    console.log("🚀 HANDLE CALL CLICKED!");
    console.log("📱 Twilio Device Status:", twilioDevice?.status());
    console.log("📱 Device Ready?", twilioDevice ? "YES" : "NO");
    
    if (!twilioDevice) {
      console.error("❌ Twilio device not ready!");
      toast({
        title: "Error",
        description: "Twilio device not ready.",
        variant: "destructive",
      });
      return;
    }
    
    // Use the provided number or fallback to the hardcoded one
    const phoneNumber = numberToCall || "+923142113157";
    console.log("📞 About to call:", phoneNumber);

    // Set call information
    setCurrentCallNumber(phoneNumber);
    setCurrentCallName(contactName || "Customer");

    try {
      console.log("📡 Making API call to start-call...");
      const response = await api.post("/twillio/start-call", { to: phoneNumber });
      console.log("✅ Start-call API response:", response.data);
      
      setIsCalling(true);
      toast({
        title: "Calling",
        description: `Calling ${contactName || phoneNumber}...`,
      });
      
      console.log("📞 Call initiated! Now waiting for incoming connection...");
      console.log("📞 Expected flow: Phone rings → You answer → Press key → Browser receives 'incoming' event");
      
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
    if (twilioDevice) {
      twilioDevice.disconnectAll();
    }
    setIsCalling(false);
    setCallConnected(false);
    setCurrentCallNumber("");
    setCurrentCallName("");
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
    const minCallsPerWeek = totalCalls > 0 ? Math.max(1, Math.floor(totalCalls / weeks)) : 1;
    const minDealsPerWeek = totalDeals > 0 ? Math.max(0, Math.floor(totalDeals / weeks)) : 0;
    const minUpsellsPerWeek = totalUpsells > 0 ? Math.max(0, Math.floor(totalUpsells / weeks)) : 0;
    
    for (let i = 0; i < weeks; i++) {
      // Create progressive improvement over time
      const weekProgress = (i + 1) / weeks;
      const variation = 0.7 + Math.random() * 0.6; // 30% variation
      
      // For small numbers, ensure we show a clear progression
      let weekCalls, weekDeals, weekUpsells;
      
      if (totalCalls <= 5) {
        // For very small call counts, show clear week-by-week progression
        weekCalls = Math.max(0, Math.floor(weekProgress * totalCalls * variation));
        weekDeals = Math.min(weekCalls, Math.floor(weekProgress * totalDeals * variation));
        weekUpsells = Math.min(weekDeals, Math.floor(weekProgress * totalUpsells * variation));
      } else {
        // For larger numbers, use the original logic
        weekCalls = Math.floor(totalCalls * weekProgress * variation / 4);
        weekDeals = Math.min(weekCalls, Math.floor(totalDeals * weekProgress * variation / 4));
        weekUpsells = Math.min(weekDeals, Math.floor(totalUpsells * weekProgress * variation / 4));
      }
      
      history.push({
        callsMade: Math.max(0, weekCalls),
        dealsClosed: Math.max(0, weekDeals),
        upsells: Math.max(0, weekUpsells),
        period: `Week ${i + 1}`
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
          period: `Week ${i + 1}`
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
      quotes.push(`You're only ${callsToGoal} calls away from reaching today's goal—keep going!`);
    } else {
      quotes.push("Amazing! You've exceeded your daily call goal—great momentum!");
    }
    
    if (stats.dealsClosed > 0) {
      quotes.push(`Excellent work! You've closed ${stats.dealsClosed} deals this week!`);
    }
    
    if (stats.totalScore > 0) {
      quotes.push(`Your total score of ${stats.totalScore} shows real progress—keep building!`);
    }
    
    if (stats.upsells > 0) {
      quotes.push(`Great upselling! You've achieved ${stats.upsells} upsells this week!`);
    }
    
    quotes.push(`You're currently level ${level}—each call brings you closer to the next level!`);
    
    return quotes;
  };

  // Calculate progress percentages and level
  const callsProgress = userStats ? Math.min((userStats.callsMade / 20) * 100, 100) : 0; // Goal: 20 calls
  const dealsProgress = userStats ? Math.min((userStats.dealsClosed / 5) * 100, 100) : 0; // Goal: 5 deals
  const currentLevel = userStats ? Math.floor(userStats.totalScore / 100) : 0; // 100 points per level

  const motivationalQuotes = generateMotivationalQuotes(userStats, currentLevel);

  useEffect(() => {
    fetchUserStats();
    fetchLeaderboardData();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/performance/leaderboard/me?period=alltime');
      setUserStats(response.data.data);
      // Generate performance history based on current stats
      const history = generatePerformanceHistory(response.data.data);
      console.log('Generated performance history:', history);
      console.log('Current stats:', response.data.data);
      setPerformanceHistory(history);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await api.get('/performance/leaderboard?period=alltime');
      setLeaderboardData(response.data.data?.slice(0, 3) || []); // Top 3
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 3000);

    return () => clearInterval(quoteInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row px-4 md:px-8 py-4 gap-6">
        {/* left div */}
        <div className="flex flex-col space-y-6 w-full lg:w-1/2">
          {/* welcome and daily goals */}
          <div className="w-full flex flex-col lg:flex-row gap-6">
            {/* welcome card */}
            <div className="flex-1 card-gradient rounded-lg overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Hello, {user?.name || 'User'}!
                  </h1>
                  <p className="text-slate-300 mb-4">
                    Welcome Back to Level up CRM
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-900 rounded-lg">
                      <Star className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-lg font-bold">
                      Level {currentLevel}: {currentLevel >= 5 ? 'Sales Master' : currentLevel >= 3 ? 'Rising Star' : 'Rookie'}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center p-4">
                  <Image
                    src="/placeholder.svg?height=150&width=150"
                    width={150}
                    height={150}
                    alt="Welcome"
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* daily goals */}
            <div className="bg-gray-900 rounded-lg p-6 flex flex-col shadow-lg w-full lg:w-80">
              <h2 className="text-xl font-bold mb-4">Daily Goal</h2>
              <div className="flex-1 flex flex-col items-center justify-center">
                <ProgressRing
                  progress={callsProgress}
                  size={120}
                  strokeWidth={12}
                  text={`${userStats?.callsMade || 0}/20`}
                  textClassName="text-xl font-bold"
                />
                <p className="text-lime text-sm mt-3 font-medium">calls completed</p>
              </div>
            </div>
          </div>

          {/* deals */}
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-gray-400 uppercase tracking-wide font-bold mb-4 text-sm">PERFORMANCE OVERVIEW</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">{userStats?.callsMade || 0}</div>
                <div className="text-sm text-gray-400 mb-1">Total Calls</div>
                <div className="text-lime font-semibold text-xs">All Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">{userStats?.dealsClosed || 0}</div>
                <div className="text-sm text-gray-400 mb-1">Deals Closed</div>
                <div className="h-1 mt-2 bg-green-600 rounded-full mx-auto w-16"></div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">{userStats?.upsells || 0}</div>
                <div className="text-sm text-gray-400 mb-1">Upsells</div>
                <div className="h-1 mt-2 bg-purple-600 rounded-full mx-auto w-16"></div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Goal Progress</span>
                <span className="text-sm text-lime font-semibold">{Math.round(dealsProgress)}%</span>
              </div>
              <Progress
                value={dealsProgress}
                className="h-2 bg-gray-800"
              />
            </div>
          </div>

          {/* buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <Button className="lime-button w-full py-3 text-base md:text-lg flex items-center justify-center" onClick={openDialer}>
              <Phone className="mr-2 h-5 w-5" />
              Call Next Customer
            </Button>
            <Button className="lime-button w-full py-3 text-base md:text-lg flex items-center justify-center">
              <MessageSquareText className="mr-2 h-5 w-5" />
              Review AI Feedback
            </Button>
            <Button className="lime-button w-full py-3 text-base md:text-lg flex items-center justify-center">
              <Clock className="mr-2 h-5 w-5" />
              History
            </Button>
          </div>

          {/* call logging */}
          <div className="w-full">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Call Logging</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Phone</th>
                      <th className="pb-3 font-medium">Notes</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* FIXME: Replace with dynamic API call once Twilio integration is complete */}
                    {/* This will be populated with customer data from CRM/Twilio APIs */}
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-gray-700 rounded-full">
                            <Phone className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg mb-1">Call Logs from Twilio</p>
                            <p className="text-sm text-gray-500">Features: Auto-dialing, call logging, customer notes</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Dialer */}
        <ModernDialer
          isOpen={isDialerOpen}
          onClose={() => setIsDialerOpen(false)}
          onCall={handleCall}
        />

        {/* Call Screen */}
        {isCalling && (
          <CallScreen
            contactName={currentCallName}
            contactPhone={currentCallNumber}
            onEndCall={handleEndCall}
            isConnected={callConnected}
          />
        )}

        {/* right div */}
        <div className="flex flex-col space-y-6 w-full lg:w-1/2">
          {/* insights box */}
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold">Insights Box</h2>
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="border-l-4 border-yellow-400 pl-4">
              <h3 className="text-lg font-bold mb-3">Motivational Insights</h3>
              {/* RECOMMENDATIONS for Dynamic Insights:
                  1. Performance trends: "Your call-to-deal ratio improved 15% this week"
                  2. Comparative insights: "You're 3 calls ahead of last week's pace"
                  3. Goal tracking: "On track to hit monthly target by [date]"
                  4. Skill insights: "Your average call duration is optimal at 8.5 minutes"
                  5. Market insights: "Best calling times: 10-11 AM (32% higher success rate)"
                  6. AI-powered recommendations based on call analysis
                  7. Seasonal/trend analysis from historical data
              */}
              <div className="relative h-16 bg-gray-800 rounded-lg p-3 flex items-center">
                {motivationalQuotes.map((quote, index) => (
                  <p
                    key={index}
                    className={`text-sm absolute inset-3 flex items-center transition-all duration-500 ${
                      currentQuote === index
                        ? "opacity-100 transform translate-y-0"
                        : "opacity-0 transform translate-y-2"
                    }`}
                  >
                    "{quote}"
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* performance tracker */}
          <div className="performance-card">
            <div className="p-4 border-b border-blue-900">
              <h2 className="text-xl font-bold">Performance Tracker</h2>
            </div>
            <div className="p-4">
              <PerformanceChart data={performanceHistory} isLoading={loading} />
            </div>
          </div>

          {/* team highlights */}
          <div>
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

          {/* leaderboard highlights */}
          <div>
            <LeaderboardHighlights data={leaderboardData} />
          </div>
        </div>
      </div>
    </>
  );
}
