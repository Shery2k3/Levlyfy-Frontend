"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("calls-made");
  const [timePeriod, setTimePeriod] = useState("weekly");

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
          onValueChange={setActiveTab}
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
            onValueChange={setTimePeriod}
            className="w-full sm:w-fit"
          >
            <TabsList className="bg-gray-800 w-full sm:w-auto grid grid-cols-3 sm:flex">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="all-time">All-Time</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            onClick={() => alert("Your place is 1st!")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
          >
            Show My Place
          </Button>
        </div>
      </div>

      {/* Top Performers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PerformerCard
          name="Rootless"
          badge="challenger"
          trophy="gold"
          calls="40 - 67"
          deals="157"
          feedback="67%"
        />
        <PerformerCard
          name="Knight"
          badge="challenger"
          trophy="silver"
          calls="40 - 67"
          deals="157"
          feedback="67%"
        />
        <PerformerCard
          name="Ninja"
          badge="challenger"
          trophy="gold"
          calls="40 - 67"
          deals="157"
          feedback="67%"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="py-3 px-4 text-left">Place</th>
              <th className="py-3 px-4 text-left">Agent ID</th>
              <th className="py-3 px-4 text-left">Calls Made</th>
              <th className="py-3 px-4 text-left">Deals Closed</th>
              <th className="py-3 px-4 text-left">Total Score</th>
              <th className="py-3 px-4 text-left">Rank</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <LeaderboardRow
                key={index}
                place={index + 1}
                name={getRandomName()}
                calls={`${Math.floor(Math.random() * 30) + 40} (${
                  Math.floor(Math.random() * 300) + 400
                })`}
                deals={`${Math.floor(Math.random() * 10) + 10} (${
                  Math.floor(Math.random() * 300) + 400
                })`}
                score={`${Math.floor(Math.random() * 1000) + 3000}`}
                rank={Math.random() > 0.5 ? "challenger" : "gold"}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getRandomName() {
  const firstNames = [
    "Alex",
    "Mia",
    "Liam",
    "Olivia",
    "Noah",
    "Emma",
    "James",
    "Sophia",
    "William",
    "Isabella",
  ];
  const lastNames = [
    "Johnson",
    "Chen",
    "Smith",
    "García",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
  ];

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]
  }`;
}

function PerformerCard({
  name,
  badge,
  trophy,
  calls,
  deals,
  feedback,
}: {
  name: string;
  badge: "challenger" | "gold";
  trophy: "gold" | "silver";
  calls: string;
  deals: string;
  feedback: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-12 w-12 border-2 border-gray-700">
          <AvatarImage src="/placeholder.svg?height=48&width=48" alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold text-lg">{name}</div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center rounded-full px-2 py-0.5 text-xs ${
                badge === "challenger" ? "badge-challenger" : "badge-gold"
              }`}
            >
              <div
                className={`mr-1 w-2 h-2 rounded-full ${
                  badge === "challenger" ? "dot-challenger" : "dot-gold"
                }`}
              ></div>
              Challenger
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <div
            className={`w-16 h-16 rounded-full ${
              trophy === "gold" ? "bg-yellow-600/20" : "bg-gray-400/20"
            } flex items-center justify-center`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-10 h-10 ${
                trophy === "gold" ? "text-yellow-600" : "text-gray-400"
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
}: {
  place: number;
  name: string;
  calls: string;
  deals: string;
  score: string;
  rank: "challenger" | "gold";
}) {
  return (
    <tr
      className={`${
        place % 2 === 0 ? "bg-gray-700/50" : ""
      } hover:bg-gray-600/50 transition-colors`}
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
      <td className="py-4 px-4">{name}</td>
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
            rank === "challenger" ? "badge-challenger" : "badge-gold"
          }`}
        >
          {rank === "challenger" ? "Challenger" : "Gold"}
          <div
            className={`ml-1 w-3 h-3 rounded-full ${
              rank === "challenger" ? "dot-challenger" : "dot-gold"
            }`}
          ></div>
        </div>
      </td>
    </tr>
  );
}
