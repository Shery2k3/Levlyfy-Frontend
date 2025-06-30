"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="px-4 md:px-8 py-4 space-y-6">
      <h1 className="text-3xl font-bold">Latest News & Updates</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-gray-800 p-1 grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="all" className="flex-1">
            All Updates
          </TabsTrigger>
          <TabsTrigger value="company" className="flex-1">
            Company News
          </TabsTrigger>
          <TabsTrigger value="product" className="flex-1">
            Product Updates
          </TabsTrigger>
          <TabsTrigger value="training" className="flex-1">
            Training Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2 bg-gray-900 border-none overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
              <div className="relative h-72">
                <Image
                  src="/placeholder.svg?height=288&width=600"
                  alt="Featured News"
                  width={600}
                  height={288}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-6">
                  <Badge className="w-fit mb-2 bg-blue-600 hover:bg-blue-700">Featured</Badge>
                  <h2 className="text-2xl font-bold mb-2">New CRM Features Released This Month</h2>
                  <p className="text-gray-300">
                    Enhanced reporting capabilities and AI-driven insights to boost your sales performance
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-none overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
              <div className="relative h-72">
                <Image
                  src="/placeholder.svg?height=288&width=300"
                  alt="Company Announcement"
                  width={300}
                  height={288}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-6">
                  <Badge className="w-fit mb-2 bg-yellow-600 hover:bg-yellow-700">Company</Badge>
                  <h2 className="text-xl font-bold mb-2">Q2 Sales Targets Exceeded</h2>
                  <p className="text-gray-300">Team performance exceeds expectations for second quarter in a row</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NewsCard
              title="Advanced Sales Techniques Webinar"
              description="Join our expert panel to learn cutting-edge sales techniques for the digital era"
              category="Training"
              date="August 15, 2022"
              image="/placeholder.svg?height=200&width=300"
            />
            <NewsCard
              title="New Mobile App Version Released"
              description="Version 2.5 brings improved call logging and on-the-go analytics"
              category="Product"
              date="August 10, 2022"
              image="/placeholder.svg?height=200&width=300"
            />
            <NewsCard
              title="Sales Team Expansion"
              description="We're growing our team across multiple regions - refer qualified candidates"
              category="Company"
              date="August 5, 2022"
              image="/placeholder.svg?height=200&width=300"
            />
          </div>

          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Recent Updates</h2>
            <div className="space-y-4">
              <UpdateItem
                title="AI Coaching Tool Improvements"
                description="Our AI coaching system now provides more personalized feedback based on your call patterns"
                date="August 3, 2022"
                category="Product"
              />
              <UpdateItem
                title="Team Building Event"
                description="Save the date: Virtual team building event scheduled for August 25th"
                date="August 2, 2022"
                category="Company"
              />
              <UpdateItem
                title="New Training Module: Enterprise Sales"
                description="Learn how to effectively sell to enterprise clients with our new comprehensive module"
                date="July 28, 2022"
                category="Training"
              />
              <UpdateItem
                title="Leaderboard Algorithm Update"
                description="We've updated how scores are calculated to better reflect overall performance"
                date="July 25, 2022"
                category="Product"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="company" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NewsCard
              title="Q2 Sales Targets Exceeded"
              description="Team performance exceeds expectations for second quarter in a row"
              category="Company"
              date="August 12, 2022"
              image="/placeholder.svg?height=200&width=300"
            />
            <NewsCard
              title="Sales Team Expansion"
              description="We're growing our team across multiple regions - refer qualified candidates"
              category="Company"
              date="August 5, 2022"
              image="/placeholder.svg?height=200&width=300"
            />
          </div>

          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Company Announcements</h2>
            <div className="space-y-4">
              <UpdateItem
                title="Team Building Event"
                description="Save the date: Virtual team building event scheduled for August 25th"
                date="August 2, 2022"
                category="Company"
              />
              <UpdateItem
                title="New Office Location"
                description="We're opening a new office in Austin, TX next month"
                date="July 20, 2022"
                category="Company"
              />
              <UpdateItem
                title="Annual Company Retreat"
                description="This year's retreat will be held in Colorado from September 15-18"
                date="July 15, 2022"
                category="Company"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NewsCard({
  title,
  description,
  category,
  date,
  image,
}: {
  title: string
  description: string
  category: string
  date: string
  image: string
}) {
  const bgColor =
    category === "Training"
      ? "bg-purple-600 hover:bg-purple-700"
      : category === "Product"
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-yellow-600 hover:bg-yellow-700"

  return (
    <Card className="bg-gray-900 border-none overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-40">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="p-4">
        <Badge className={`w-fit mb-2 ${bgColor}`}>{category}</Badge>
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-300 mb-2">{description}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </CardContent>
    </Card>
  )
}

function UpdateItem({
  title,
  description,
  date,
  category,
}: {
  title: string
  description: string
  date: string
  category: string
}) {
  const bgColor =
    category === "Training"
      ? "bg-purple-600 hover:bg-purple-700"
      : category === "Product"
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-yellow-600 hover:bg-yellow-700"

  return (
    <div className="flex items-start gap-4 pb-4 border-b border-gray-800 hover:bg-gray-800/30 p-2 rounded-md transition-colors">
      <Badge className={`mt-1 ${bgColor}`}>{category}</Badge>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
      </div>
    </div>
  )
}
