"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { leaderboardAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
  LeaderboardUser, 
  TopPerformer 
} from "@/types/api";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'calls-made' | 'deals-closed' | 'upsells'>("calls-made");
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'all-time'>("weekly");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [userPosition, setUserPosition] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user: currentUser } = useAuth();

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [activeTab, timePeriod]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [leaderboardResponse, topPerformersResponse] = await Promise.all([
        leaderboardAPI.getLeaderboard(timePeriod, activeTab === 'calls-made' ? 'calls-made' : activeTab === 'deals-closed' ? 'deals-closed' : 'upsells', 50),
        leaderboardAPI.getTopPerformers(timePeriod, 3)
      ]);

      setLeaderboardData(leaderboardResponse.data.leaderboard);
      setTopPerformers(topPerformersResponse.data.topPerformers);

      // Fetch user position if user is logged in
      if (currentUser) {
        try {
          const userPosResponse = await leaderboardAPI.getUserPosition(
            currentUser._id, 
            timePeriod, 
            activeTab === 'calls-made' ? 'calls-made' : activeTab === 'deals-closed' ? 'deals-closed' : 'upsells'
          );
          setUserPosition(userPosResponse.data.position);
        } catch (posError) {
          console.warn('Could not fetch user position:', posError);
          setUserPosition('Unranked');
        }
      }

    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to load leaderboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowMyPlace = () => {
    if (userPosition) {
      alert(`Your current position is: ${userPosition}${typeof userPosition === 'number' ? getOrdinalSuffix(userPosition) : ''}!`);
    } else {
      alert("Unable to determine your position. Please try again.");
    }
  };

  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const formatMetricValue = (user: LeaderboardUser): string => {
    switch (activeTab) {
      case 'calls-made':
        return `${user.metrics.callsMade} (${user.metrics.totalCallScore || 0})`;
      case 'deals-closed':
        return `${user.metrics.dealsClosedWon} ($${user.metrics.dealValue?.toLocaleString() || 0})`;
      case 'upsells':
        return `${user.metrics.upsells} (${user.metrics.dealsClosedWon})`;
      default:
        return `${user.metrics.callsMade} (${user.metrics.totalCallScore || 0})`;
    }
  };

  if (loading) {
    return (
      <div className="px-4 md:px-8 py-4 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 md:px-8 py-4 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">❌</div>
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-4 space-y-6">
      {/* Banner */}
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-32 md:h-40">
          <div className="absolute inset-0 banner-gradient z-10 flex flex-col justify-center p-8">
            <h1 className="text-3xl font-bold mb-2">LEADERBOARD</h1>
            <p className="text-gray-300">
              "Rise to the Top! Compete, Improve, and Achieve."
            </p>
          </div>
          <Image
            src="/placeholder.svg?height=160&width=800"
            alt="Leaderboard Banner"
            width={800}
            height={160}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Tabs
          defaultValue="calls-made"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="w-full sm:w-fit"
        >
          <TabsList className="bg-gray-800 w-full sm:w-auto grid grid-cols-3 sm:flex">
            <TabsTrigger value="calls-made">Calls Made</TabsTrigger>
            <TabsTrigger value="deals-closed">Deals Closed</TabsTrigger>
            <TabsTrigger value="upsells">Upsells</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-end items-end">
          <Tabs
            defaultValue="weekly"
            value={timePeriod}
            onValueChange={(value) => setTimePeriod(value as typeof timePeriod)}
            className="w-full sm:w-fit"
          >
            <TabsList className="bg-gray-800 w-full sm:w-auto grid grid-cols-3 sm:flex">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="all-time">All-Time</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            onClick={handleShowMyPlace}
            disabled={!currentUser}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Show My Place
          </Button>
        </div>
      </div>

      {/* Top Performers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPerformers.map((performer, index) => (
          <PerformerCard
            key={performer.userId}
            name={performer.name}
            badge={performer.badge}
            trophy={performer.trophy}
            calls={performer.calls}
            deals={performer.deals}
            feedback={performer.feedback}
            profilePicture={performer.profilePicture}
          />
        ))}
        {/* Show placeholder cards if we have less than 3 performers */}
        {topPerformers.length < 3 && Array.from({ length: 3 - topPerformers.length }).map((_, index) => (
          <div key={`placeholder-${index}`} className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg opacity-50">
            <div className="text-center text-gray-500">
              <p>No data available</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons - Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center mt-2">
        <Button className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow transition-all text-base sm:text-lg">
          Call Next Customer
        </Button>
        <Button className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white shadow transition-all text-base sm:text-lg">
          Review AI Feedback
        </Button>
        <Button className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-gray-700 hover:bg-gray-800 text-white shadow transition-all text-base sm:text-lg">
          History
        </Button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="py-3 px-4 text-left">Place</th>
              <th className="py-3 px-4 text-left">Agent Name</th>
              <th className="py-3 px-4 text-left">
                {activeTab === 'calls-made' ? 'Calls Made' : 
                 activeTab === 'deals-closed' ? 'Deals Closed' : 'Upsells'}
              </th>
              <th className="py-3 px-4 text-left">
                {activeTab === 'calls-made' ? 'Deals Closed' : 
                 activeTab === 'deals-closed' ? 'Calls Made' : 'Deals Closed'}
              </th>
              <th className="py-3 px-4 text-left">Total Score</th>
              <th className="py-3 px-4 text-left">Rank</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user) => (
              <LeaderboardRow
                key={user.userId}
                place={user.position}
                name={user.name}
                calls={formatMetricValue(user)}
                deals={activeTab === 'calls-made' ? 
                  `${user.metrics.dealsClosedWon} ($${user.metrics.dealValue?.toLocaleString() || 0})` :
                  activeTab === 'deals-closed' ?
                  `${user.metrics.callsMade} (${user.metrics.totalCallScore || 0})` :
                  `${user.metrics.dealsClosedWon} ($${user.metrics.dealValue?.toLocaleString() || 0})`
                }
                score={user.metrics.totalScore.toLocaleString()}
                rank={user.metrics.rank}
                profilePicture={user.profilePicture}
                isCurrentUser={user.userId === currentUser?._id}
              />
            ))}
            {leaderboardData.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                  No leaderboard data available for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PerformerCard({
  name,
  badge,
  trophy,
  calls,
  deals,
  feedback,
  profilePicture,
}: {
  name: string;
  badge: "challenger" | "gold" | "silver" | "bronze";
  trophy: "gold" | "silver" | "bronze";
  calls: string;
  deals: string;
  feedback: string;
  profilePicture?: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 flex-wrap">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-gray-700">
          <AvatarImage src={profilePicture || "/placeholder.svg?height=48&width=48"} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="font-bold text-base sm:text-lg truncate">{name}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`flex items-center rounded-full px-2 py-0.5 text-xs sm:text-sm ${
                badge === "challenger" ? "badge-challenger" : 
                badge === "gold" ? "badge-gold" :
                badge === "silver" ? "badge-silver" : "badge-bronze"
              }`}
            >
              <div
                className={`mr-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  badge === "challenger" ? "dot-challenger" : 
                  badge === "gold" ? "dot-gold" :
                  badge === "silver" ? "dot-silver" : "dot-bronze"
                }`}
              ></div>
              <span className="truncate capitalize">{badge}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${
              trophy === "gold" ? "bg-yellow-600/20" : 
              trophy === "silver" ? "bg-gray-400/20" : "bg-amber-700/20"
            } flex items-center justify-center`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-7 h-7 sm:w-10 sm:h-10 ${
                trophy === "gold" ? "text-yellow-600" : 
                trophy === "silver" ? "text-gray-400" : "text-amber-700"
              }`}
            >
              <path
                d="M5,16 L3,5 L8.5,5 L9.5,3 L14.5,3 L15.5,5 L21,5 L19,16 L5,16 Z M5,16 L8,20 L16,20 L19,16 M12,9 L12,13 M10,11 L14,11"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 text-center text-sm mb-2">
        <div>Calls Made</div>
        <div>Deals Closed</div>
        <div>AI Feedback Followed</div>
      </div>

      <div className="grid grid-cols-3 text-center text-gray-300 mb-4">
        <div>{calls}</div>
        <div>{deals}</div>
        <div>{feedback}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="h-1 bg-orange-700 rounded-full"></div>
        <div className="h-1 bg-green-700 rounded-full"></div>
        <div className="h-1 bg-blue-700 rounded-full"></div>
      </div>
    </div>
  );
}

function LeaderboardRow({
  place,
  name,
  calls,
  deals,
  score,
  rank,
  profilePicture,
  isCurrentUser = false,
}: {
  place: number;
  name: string;
  calls: string;
  deals: string;
  score: string;
  rank: "challenger" | "gold" | "silver" | "bronze";
  profilePicture?: string;
  isCurrentUser?: boolean;
}) {
  return (
    <tr
      className={`${
        place % 2 === 0 ? "bg-gray-700/50" : ""
      } hover:bg-gray-600/50 transition-colors ${
        isCurrentUser ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full ${
              place === 1
                ? "bg-yellow-600"
                : place === 2
                ? "bg-gray-400"
                : place === 3
                ? "bg-amber-700"
                : "bg-gray-600"
            } flex items-center justify-center font-bold`}
          >
            {place}
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profilePicture || "/placeholder.svg?height=32&width=32"} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <span className={isCurrentUser ? "font-bold text-blue-400" : ""}>{name}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          {calls}
          <div className="w-24 h-1 bg-orange-700 rounded-full mt-1"></div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          {deals}
          <div className="w-20 h-1 bg-green-700 rounded-full mt-1"></div>
        </div>
      </td>
      <td className="py-4 px-4">{score}</td>
      <td className="py-4 px-4">
        <div
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
            rank === "challenger" ? "badge-challenger" : 
            rank === "gold" ? "badge-gold" :
            rank === "silver" ? "badge-silver" : "badge-bronze"
          }`}
        >
          <span className="capitalize">{rank}</span>
          <div
            className={`ml-1 w-3 h-3 rounded-full ${
              rank === "challenger" ? "dot-challenger" : 
              rank === "gold" ? "dot-gold" :
              rank === "silver" ? "dot-silver" : "dot-bronze"
            }`}
          ></div>
        </div>
      </td>
    </tr>
  );
}
