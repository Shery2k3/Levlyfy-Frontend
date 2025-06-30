"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "./ui/progress";
import { StatHexagon } from "./user-profile";
import { Switch } from "@/components/ui/switch";

import { Sun, Moon, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState<"daily" | "overall">("daily");

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { href: "/", label: "CAREER" },
    { href: "/leaderboard", label: "LEADERBOARD" },
    { href: "/training", label: "TRAINING CENTER" },
    { href: "/achievements", label: "ACHIEVEMENTS" },
    { href: "/news", label: "NEWS" },
  ];

  const { logout } = useAuth();

  const handelLogout = () => {
    console.log("User logged out");
    logout();
    window.location.href = "/auth/login"; // Redirect to login page
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-black/90 to-black/60 backdrop-blur-md shadow-lg">
      <div className="flex justify-between items-center px-4 md:px-8 py-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-7 w-7 text-white transition-transform duration-200" />
            ) : (
              <Menu className="h-7 w-7 text-white transition-transform duration-200" />
            )}
          </Button>

          {/* Desktop navigation */}
          <div className="hidden md:flex gap-2 lg:gap-6">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
              />
            ))}
          </div>
        </div>

        <div className={"relative"}>
          <div
            className={`flex items-center gap-2 cursor-pointer transition-transform ${
              profileDropdownOpen ? "scale-125" : "scale-100"
            }`}
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  width={48}
                  height={48}
                  alt="User profile"
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
          </div>

          {/* Dropdown menu */}
          {profileDropdownOpen && (
            <div className="absolute right-14 -mt-4 w-80 bg-black rounded-lg p-6 z-50 backdrop-blur-sm border border-gray-700">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Profile"
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-gray-700"
                    />
                    <div className="absolute -top-1 left-64">
                      <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">Player Level</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">78</span>
                        <Progress
                          value={75}
                          className="w-24 h-2 bg-green-900/30 bg-green-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">
                        Leaderboard Ranking
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">1904/5076</span>
                        <Progress
                          value={40}
                          className="w-24 h-2 bg-blue-900/30"
                          style={
                            {
                              "--indicator-color": "bg-blue-500",
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Toggle & Dark Mode */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex">
                  <button
                    className={`px-3 py-1 text-sm font-medium transition-colors rounded ${
                      view === "daily"
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setView("daily")}
                  >
                    DAILY TASKS
                  </button>
                  <button
                    className={`px-3 py-1 text-sm font-medium transition-colors rounded ${
                      view === "overall"
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setView("overall")}
                  >
                    OVERALL
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-gray-400" />
                  <Switch
                    checked={!isDarkMode}
                    onCheckedChange={() => setIsDarkMode(!isDarkMode)}
                    size="sm"
                  />
                  <Sun className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <StatHexagon
                  title="Progress"
                  value="80%"
                  color="gold"
                  icon={
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        d="M20 12l-6-6v5H6v2h8v5l6-6z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />
                <StatHexagon
                  title="Calls Made"
                  value="180"
                  color="orange"
                  icon={
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM21 6h-3V3h-2v3h-3v2h3v3h2V8h3z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />
                <StatHexagon
                  title="Deals Closed"
                  value="78%"
                  color="blue"
                  icon={
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path
                        d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-gray-400 text-xs mb-1">AI Feedback</div>
                  <div className="text-lg font-bold">12</div>
                  <div className="text-xxs text-gray-500">improvements</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Performance</div>
                  <div className="text-lg font-bold">12,450</div>
                  <div className="text-xxs text-gray-500">points</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Challenges</div>
                  <div className="text-lg font-bold">2</div>
                  <div className="text-xxs text-gray-500">completed</div>
                </div>
              </div>
              {/* logout button */}
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  className="w-full py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-semibold"
                  onClick={handelLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 animate-fade-in">
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-3 px-4 font-bold text-center rounded-lg shadow-md transition-all duration-200 border border-transparent ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white border-blue-500 scale-105"
                    : "bg-navItem-default text-gray-200 hover:bg-blue-900/60 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 flex items-center gap-2
        ${active
          ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg scale-105 border border-blue-500"
          : "bg-navItem-default text-gray-200 hover:bg-blue-900/60 hover:text-white border border-transparent"}
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400`}
    >
      <span className="z-10">{label}</span>
      {active && (
        <span className="absolute left-0 top-0 w-full h-full rounded-lg border-2 border-blue-400 animate-pulse pointer-events-none" style={{boxShadow: '0 0 8px 2px #60a5fa55'}} />
      )}
    </Link>
  );
}
