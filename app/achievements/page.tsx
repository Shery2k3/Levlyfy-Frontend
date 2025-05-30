"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("completed");
  const [newsTab, setNewsTab] = useState("general");

  return (
    <div className="px-4 md:px-8 py-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-yellow-900/50 to-gray-900 rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-32 md:h-40">
          <div className="absolute inset-0 banner-gradient z-10 flex flex-col justify-center p-8">
            <h1 className="text-3xl font-bold mb-2">ACHIEVEMENTS</h1>
            <p className="text-gray-300">
              "Unlock Your Potential! Celebrate, Progress, and Shine."
            </p>
          </div>
          <Image
            src="/placeholder.svg?height=160&width=800"
            alt="Achievements Banner"
            width={800}
            height={160}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4">
        <button
          className={`rounded-full px-6 py-2 font-bold transition-colors ${
            activeTab === "completed"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          COMPLETED
        </button>
        <button
          className={`rounded-full px-6 py-2 font-bold transition-colors ${
            activeTab === "in-progress"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("in-progress")}
        >
          IN PROGRESS
        </button>
        <button
          className={`rounded-full px-6 py-2 font-bold transition-colors ${
            activeTab === "locked"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("locked")}
        >
          LOCKED
        </button>
      </div>

      {/* Achievement Showcase */}
      <div>
        <h2 className="text-4xl font-bold mb-8 text-center">Achievements</h2>
        <div className="border-b-2 border-yellow-600 w-48 mx-auto mb-8"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {activeTab === "completed" && (
            <>
              <AchievementCard
                title="Agent of the Month"
                image="/placeholder.svg?height=120&width=120"
                date="08/31/2022"
                completed={true}
              />
              <AchievementCard
                title="Feedback Champion"
                image="/placeholder.svg?height=120&width=120"
                date="08/31/2022"
                completed={true}
              />
              <AchievementCard
                title="Streak Master"
                image="/placeholder.svg?height=120&width=120"
                date="08/31/2022"
                completed={true}
              />
              <AchievementCard
                title="Rising Star"
                image="/placeholder.svg?height=120&width=120"
                date="08/31/2022"
                completed={true}
              />
              <AchievementCard
                title="New Skill Unlocked"
                image="/placeholder.svg?height=120&width=120"
                date="08/31/2022"
                completed={true}
              />
            </>
          )}

          {activeTab === "in-progress" && (
            <>
              <AchievementCard
                title="Call Master"
                image="/placeholder.svg?height=120&width=120"
                date="In Progress"
                completed={false}
              />
              <AchievementCard
                title="Deal Closer"
                image="/placeholder.svg?height=120&width=120"
                date="In Progress"
                completed={false}
              />
              <AchievementCard
                title="Team Player"
                image="/placeholder.svg?height=120&width=120"
                date="In Progress"
                completed={false}
              />
            </>
          )}

          {activeTab === "locked" && (
            <>
              <AchievementCard
                title="Sales Legend"
                image="/placeholder.svg?height=120&width=120"
                date="Locked"
                completed={false}
              />
              <AchievementCard
                title="Perfect Month"
                image="/placeholder.svg?height=120&width=120"
                date="Locked"
                completed={false}
              />
              <AchievementCard
                title="Mentor Status"
                image="/placeholder.svg?height=120&width=120"
                date="Locked"
                completed={false}
              />
              <AchievementCard
                title="Top Performer"
                image="/placeholder.svg?height=120&width=120"
                date="Locked"
                completed={false}
              />
            </>
          )}
        </div>
      </div>

      {/* News Feed */}
      <div className="mt-12">
        <Tabs
          defaultValue="general"
          value={newsTab}
          onValueChange={setNewsTab}
          className="w-full"
        >
          <TabsList className="bg-black/20 p-1 rounded-md w-full flex overflow-x-auto">
            <TabsTrigger
              value="general"
              className="flex-1 data-[state=active]:bg-blue-600"
            >
              GENERAL COMPANY UPDATES
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex-1">
              PERSONAL ACHIEVEMENTS
            </TabsTrigger>
            <TabsTrigger value="team" className="flex-1">
              KEY TEAM MILESTONES
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1">
              EVENT HIGHLIGHTS
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">
              AI INSIGHTS UPDATES
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  <NewsItem
                    title="Samuel Lee Levels Up: Achieves Rank 5 in Objection Handling!"
                    description="Celebrated for exceptional improvement in key skills."
                    date="07/15/2022"
                  />
                  <NewsItem
                    title="Alex Johnson Hits Record Sales of $50K in a Single Day!"
                    description="A personal best for Alex, inspiring the team to aim higher."
                    date="07/15/2022"
                    isNew={true}
                  />
                  <NewsItem
                    title="Samuel Lee Levels Up: Achieves Rank 5 in Objection Handling!"
                    description="Celebrated for exceptional improvement in key skills."
                    date="07/15/2022"
                  />
                  <NewsItem
                    title="Jessica Smith Completes Advanced Training Module in Leadership!"
                    description="Congratulations to Jessica for completing a challenging course with flying colors."
                    date="07/15/2022"
                  />
                  <NewsItem
                    title="David Patel Closes 100th Deal This Quarter!"
                    description="David's milestone sets a new benchmark for the team."
                    date="07/15/2022"
                    isNew={true}
                  />
                </div>
                <div className="relative min-h-[300px]">
                  <Image
                    src="/placeholder.svg?height=600&width=600"
                    alt="News highlight"
                    width={600}
                    height={600}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-6">
                    <p className="text-xl md:text-2xl font-medium">
                      A personal best for Alex, inspiring the team to aim
                      higher.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personal" className="mt-4">
            <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">
                Your Recent Achievements
              </h2>
              <div className="space-y-4">
                <NewsItem
                  title="You've Completed the Advanced Objection Handling Course!"
                  description="Your dedication to improving your skills has paid off."
                  date="07/10/2022"
                  isNew={true}
                />
                <NewsItem
                  title="You've Reached Level 3: Rising Star!"
                  description="Your consistent performance has earned you a promotion."
                  date="07/01/2022"
                />
                <NewsItem
                  title="You've Closed 50 Deals This Quarter!"
                  description="A significant milestone in your sales career."
                  date="06/28/2022"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AchievementCard({
  title,
  image,
  date,
  completed,
}: {
  title: string;
  image: string;
  date: string;
  completed: boolean;
}) {
  return (
    <div className="achievement-card group relative">
      <div className="p-4 flex justify-center">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={120}
          height={120}
          className={`object-contain ${!completed && "opacity-50 grayscale"}`}
        />
      </div>
      {completed && (
        <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
          <CheckCircle className="h-5 w-5" />
        </div>
      )}
      <div className="p-4 text-center">
        <h3 className="font-bold mb-1">"{title}"</h3>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white text-black p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p
          className="text-sm mb-2"
          style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
        >
          Short description about the achievement.
        </p>
        <p
          className="text-md text-green-800 font-extrabold"
        >
          {completed ? "Progress: Completed" : "Progress: In Progress"}
        </p>
      </div>
    </div>
  );
}

function NewsItem({
  title,
  description,
  date,
  isNew = false,
}: {
  title: string;
  description: string;
  date: string;
  isNew?: boolean;
}) {
  return (
    <div className="news-item">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-gray-400 mb-1">{description}</p>
      <p className="text-xs text-gray-500">{date}</p>
      {isNew && (
        <div className="absolute right-2 top-2 bg-blue-600 text-xs px-2 py-0.5 rounded-full">
          NEW
        </div>
      )}
    </div>
  );
}
