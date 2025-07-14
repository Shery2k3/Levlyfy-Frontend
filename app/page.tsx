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
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function HomePage() {
  const [isCalling, setIsCalling] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [userStats, setUserStats] = useState<any>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
      const response = await api.get('/performance/leaderboard/me?period=weekly');
      setUserStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await api.get('/performance/leaderboard?period=weekly');
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
      <div className="flex flex-row px-4 md:px-8 py-4 space-y-6 space-x-6">
        {/* left div */}
        <div className="flex flex-col space-y-6 w-1/2">
          {/* welcome and daily goals */}
          <div className="w-full flex flex-row space-x-10">
            {/* welcome card */}
            <div className="lg:col-span-2 card-gradient rounded-lg overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Hello, {user?.name || 'User'}
                  </h1>
                  <p className="text-slate-300 mb-6">
                    Welcome Back to Level up CRM
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-900 rounded-lg">
                      <Star className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-xl font-bold">
                      Level {currentLevel}: {currentLevel >= 5 ? 'Sales Master' : currentLevel >= 3 ? 'Rising Star' : 'Rookie'}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    width={200}
                    height={200}
                    alt="Welcome"
                    className="h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* daily goals */}
            <div className="bg-gray-900 rounded-lg p-6 flex flex-col shadow-lg col-span-1 ">
              <h2 className="text-xl font-bold mb-2">Daily Goal</h2>
              <div className="flex-1 flex flex-col items-center justify-center">
                <ProgressRing
                  progress={callsProgress}
                  size={120}
                  strokeWidth={12}
                  text={`${userStats?.callsMade || 0}/20`}
                  textClassName="text-xl font-bold"
                />
                <p className="text-success text-sm mt-2">calls completed</p>
              </div>
            </div>
          </div>

          {/* deals */}
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-gray-500 uppercase font-bold mb-2">DEALS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold">{userStats?.callsMade || 0}</div>
                <div className="text-sm text-gray-400">Total Calls</div>
                <div className="text-lime font-bold">This Week</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{userStats?.dealsClosed || 0}</div>
                <div className="text-sm text-gray-400">Deals Closed</div>
                <div className="h-2 mt-2 bg-green-700 rounded-full"></div>
              </div>
              <div>
                <div className="text-4xl font-bold">{userStats?.upsells || 0}</div>
                <div className="text-sm text-gray-400">Upsells</div>
                <div className="h-2 mt-2 bg-blue-700 rounded-full"></div>
              </div>
            </div>
            <Progress
              value={dealsProgress}
              className="h-2 mt-4 bg-lime/25"
            />
          </div>

          {/* buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <Button className="lime-button w-full py-3 text-base md:text-lg flex items-center justify-center" onClick={() => setIsCalling(true)}>
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
          <div className="w-full lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Call logging</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Phone</th>
                      <th className="pb-2">Notes</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CallLogRow
                      name="Alex Johnson"
                      phone="(555)-123-4567"
                      notes="Interested in product demo; prefers afternoon calls."
                      available={true}
                    />
                    <CallLogRow
                      name="Rachel Green"
                      phone="(555)-888-1234"
                      notes="Interested in a demo; prefers morning calls."
                      available={false}
                    />
                    <CallLogRow
                      name="Monica Geller"
                      phone="(555)-777-4567"
                      notes="Requested a pricing breakdown."
                      available={false}
                    />
                    <CallLogRow
                      name="Chandler Bing"
                      phone="(555)-333-6789"
                      notes="Needs help with product configuration."
                      available={true}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Call Screen */}

        {isCalling && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
            onClick={() => setIsCalling(false)}
          >
            <CallScreen />
          </div>
        )}

        {/* right div */}
        <div className="flex flex-col space-y-6 w-1/2">
          {/* insights box */}
          <div className="bg-gray-900 flex flex-row rounded-lg p-6 shadow-lg h-56 mt-[-24px]">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold">Insights Box</h2>
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="border-l-4 border-yellow-400 pl-2 mb-4">
                <h3 className="text-lg font-bold">Motivational Insights</h3>
                <div className="relative h-12 w-11/12">
                  {motivationalQuotes.map((quote, index) => (
                    <p
                      key={index}
                      className={`text-sm absolute ${
                        currentQuote === index
                          ? "quote-transition"
                          : "opacity-0"
                      }`}
                      style={{ animationDelay: `${index * 4}s` }}
                    >
                      "{quote}"
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <Image
                src="/placeholder.svg?height=100&width=150"
                width={150}
                height={100}
                alt="Motivational"
                className="ml-auto"
              />
            </div>
          </div>

          {/* performance tracker */}
          <div className="performance-card">
            <div className="p-4 border-b border-blue-900">
              <h2 className="text-xl font-bold">Performance Tracker</h2>
            </div>
            <div className="p-4">
              <PerformanceChart />
            </div>
          </div>

          {/* team highlights */}
          <div>
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

function CallLogRow({
  name,
  phone,
  notes,
  available,
}: {
  name: string;
  phone: string;
  notes: string;
  available: boolean;
}) {
  return (
    <tr className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
      <td className="py-4">{name}</td>
      <td className="py-4">{phone}</td>
      <td className="py-4 max-w-[200px] truncate">{notes}</td>
      <td className="py-4">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${
            available
              ? "bg-lime/25 hover:bg-lime/40"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <Phone
            className={`h-5 w-5 ${available ? "text-lime" : "text-gray-400"}`}
          />
        </Button>
      </td>
    </tr>
  );
}
