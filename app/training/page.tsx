"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Play } from "lucide-react";
import { QuizModal } from "@/components/quiz-modal";

export default function TrainingPage() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(false);

  return (
    <div className="px-4 md:px-8 py-4 space-y-6">
      {/* Banner */}
      <div className="bg-blue-950 rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-32 md:h-40">
          <div className="absolute inset-0 banner-gradient z-10 flex flex-col justify-center p-8">
            <h1 className="text-3xl font-bold mb-2">TRAINING CENTER</h1>
            <p className="text-gray-300">
              "Personalized training to help you level up in your career."
            </p>
          </div>
          <Image
            src="/placeholder.svg?height=160&width=800"
            alt="Training Center Banner"
            width={800}
            height={160}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-black/40 rounded-lg p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="mr-4 p-2 bg-blue-900 rounded-lg">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-400">
                <path
                  d="M12 15C8.7 15 6 12.3 6 9V4.5C6 4.2 6.2 4 6.5 4C10.4 4 11 2 15 2C15.3 2 15.5 2.2 15.5 2.5V9C15.5 12.3 12.8 15 9.5 15H12ZM9.5 2C9.8 2 10 2.2 10 2.5V9C10 12.3 7.3 15 4 15H1.5C1.2 15 1 14.8 1 14.5V9C1 5.7 3.7 3 7 3C8.3 3 9.1 2.3 9.5 2ZM22.5 15H20C16.7 15 14 12.3 14 9V2.5C14 2.2 14.2 2 14.5 2C14.9 2.3 15.7 3 17 3C20.3 3 23 5.7 23 9V14.5C23 14.8 22.8 15 22.5 15Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <div className="text-gray-400 text-sm uppercase font-bold">
                STATS
              </div>
              <div className="text-lg font-bold">Overall</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">objection handling</span>
                <span className="text-xs text-gray-400">Lv3 65%</span>
              </div>
              <Progress value={65} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">rapport building</span>
                <span className="text-xs text-gray-400">Lv3 65%</span>
              </div>
              <Progress
                value={65}
                className="h-1.5 bg-orange-900/30"
                indicatorClassName="bg-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Call Opening Script</span>
                <span className="text-xs text-gray-400">Lv3 25%</span>
              </div>
              <Progress
                value={25}
                className="h-1.5 bg-yellow-900/30"
                indicatorClassName="bg-yellow-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">In progress</span>
                <span className="text-xs text-gray-400">Lv3 65%</span>
              </div>
              <Progress
                value={65}
                className="h-1.5 bg-purple-900/30"
                indicatorClassName="bg-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="md:col-span-3 space-y-6">
          {/* Mental Training */}
          <div className="stats-card hover:shadow-blue-900/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-blue-700 rounded-full">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-300">
                  <path
                    d="M12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3ZM12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 11.28 15.79 10.62 15.42 10.06L12 13.5L10.5 12L13.94 8.58C13.38 8.21 12.72 8 12 8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Mental Training</h2>
                <p className="text-sm text-gray-400">
                  Strengthen your focus, decision-making, and resilience with
                  interactive games and challenges designed to sharpen your
                  mental agility.
                </p>
              </div>
              <div className="ml-auto flex flex-col items-center">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-20 h-20">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#444"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4cd964"
                      strokeWidth="3"
                      strokeDasharray="4, 100"
                      strokeLinecap="round"
                    />
                    <text
                      x="18"
                      y="21"
                      textAnchor="middle"
                      fontSize="8"
                      fill="white"
                      fontWeight="bold"
                    >
                      1/25
                    </text>
                  </svg>
                </div>
                <span className="text-xs text-lime mt-1">
                  Challenges Completed
                </span>
              </div>
            </div>
            <Button
              className="lime-button w-full"
              onClick={() => setShowQuizModal(true)}
            >
              Start Training
            </Button>
            {showQuizModal && (
              <QuizModal onClose={() => setShowQuizModal(false)}  />
            )}
          </div>

          {/* Objection Handling */}
          <div className="stats-card hover:shadow-blue-900/20 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-cyan-700 rounded-full">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-300">
                  <path
                    d="M9.5 3C7.56 3 5.96 4.51 5.79 6.43L2.5 9.72C2.18 10.04 2 10.47 2 10.94C2 11.88 2.76 12.64 3.7 12.64C4.17 12.64 4.6 12.46 4.92 12.14L8.21 8.85C8.97 8.54 9.57 7.93 9.88 7.17L18.41 15.7C18.79 16.08 19.38 16.08 19.76 15.7C20.15 15.31 20.15 14.72 19.76 14.34L14.82 9.39L16.64 7.58L18.23 9.17C18.5 9.44 18.89 9.59 19.29 9.59C20.13 9.59 20.8 8.92 20.8 8.08C20.8 7.8 20.72 7.53 20.58 7.3L18.91 4.32C18.61 3.76 18.05 3.42 17.42 3.42C17.05 3.42 16.71 3.53 16.42 3.73L14.21 5.25C13.88 5.47 13.66 5.81 13.56 6.2L11.36 4C10.97 3.62 10.4 3.35 9.78 3.3C9.68 3.29 9.59 3.28 9.5 3.28V3Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Objection Handling</h2>
                <p className="text-sm text-gray-400">
                  Master customer objections with interactive scenarios and
                  expert techniques. Improve your confidence in closing deals
                  effectively.
                </p>
              </div>
              <div className="ml-auto flex flex-col items-center">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-20 h-20">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#444"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4cd964"
                      strokeWidth="3"
                      strokeDasharray="0, 100"
                      strokeLinecap="round"
                    />
                    <text
                      x="18"
                      y="21"
                      textAnchor="middle"
                      fontSize="8"
                      fill="white"
                      fontWeight="bold"
                    >
                      0/4
                    </text>
                  </svg>
                </div>
                <span className="text-xs text-lime mt-1">
                  Scenarios Completed
                </span>
              </div>
            </div>
            <Button className="lime-button w-full">Start Practice</Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Performance Impact */}
          <div className="stats-card hover:shadow-blue-900/20 transition-all duration-300">
            <h2 className="text-xl font-bold mb-4">Performance Impact</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Customer Sentiment Score increased</span>
                <span className="text-lime font-bold">
                  <svg
                    className="w-4 h-4 inline mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  12.75%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Deal Close Rate increased</span>
                <span className="text-lime font-bold">
                  <svg
                    className="w-4 h-4 inline mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  +8%
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="stats-card hover:shadow-blue-900/20 transition-all duration-300">
            <h2 className="text-xl font-bold mb-4">Weekly Goals</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="text-lime mr-2 h-5 w-5" />
                <span>Complete 3 training sessions this week</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-lime mr-2 h-5 w-5" />
                <span>Practice objection handling in 1 scenario</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-lime mr-2 h-5 w-5" />
                <span>Watch an inspirational video</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-lime mr-2 h-5 w-5" />
                <span>Complete 1 mental agility game</span>
              </div>
            </div>
          </div>

          {/* Inspirational Videos */}
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Inspirational Videos</h2>
                <p className="text-xs text-gray-400">
                  Fuel your motivation with stories from top performers and
                  thought leaders. Learn strategies to overcome challenges and
                  stay inspired.
                </p>
              </div>
              <div className="text-sm">17/32 Videos Watched</div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=160&width=400"
                width={400}
                height={160}
                alt="Inspirational video thumbnail"
                className="w-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="text-2xl font-bold">
                  Believe. Hustle. Inspire.
                </div>
                <div className="text-sm text-gray-300">
                  | Sales Motivation |
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Watch Now
              </Button>
              <Button variant="outline">PLAYLIST</Button>
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="space-y-2">
                {[
                  "The Art of Turning No into Yes",
                  "Building Rapport in Seconds",
                  "Overcoming Setbacks Like a Pro",
                  "The Power of a Positive Mindset",
                  "Mastering Objection Handling",
                ].map((title, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 rounded-md ${
                      activeVideo === index
                        ? "bg-gray-800"
                        : "hover:bg-gray-800/50"
                    } cursor-pointer transition-colors`}
                    onClick={() => setActiveVideo(index)}
                  >
                    <div className="w-6 text-center mr-2">{index + 1}</div>
                    <div className="flex-1">{title}</div>
                    {index === 0 || index === 4 ? (
                      <CheckCircle className="text-lime h-5 w-5" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5 text-blue-400"
                      >
                        <path
                          d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}