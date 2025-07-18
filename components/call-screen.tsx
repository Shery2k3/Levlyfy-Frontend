"use client";

import { Mic, MicOff, Grid3X3, Video, PhoneOff, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import api from "@/lib/api";

const callUsers = [
  { name: "Leslie Alexander", phone: "(307) 555-0133", img: "/avatars/1.jpg" },
  { name: "Courtney Henry", phone: "(219) 555-0114", img: "/avatars/2.jpg" },
  { name: "Jane Cooper", phone: "(229) 555-0109", img: "/avatars/3.jpg" },
  { name: "Brooklyn Simmons", phone: "(208) 555-0112", img: "/avatars/4.jpg" },
  { name: "Floyd Miles", phone: "(629) 555-0129", img: "/avatars/5.jpg" },
];

export default function CallScreen() {
  let twilioDevice = null; // global reference

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  const handleNumberClick = (num: string) => {
    setPhoneNumber((prev) => prev + num);
  };

  const handleCall = async () => {
  if (!phoneNumber) return alert("Please enter a phone number");

  try {
    const tokenRes = await api.get("/twillio/token");
    const token = tokenRes.data.token;

    const device = new Device(token, {
      debug: true,
    });

    device.on("ready", () => {
      console.log("Twilio device ready")
      device.connect({ To: phoneNumber }); // this triggers /twillio/voice
    });

    device.on("error", (err) => {
      console.error("Device error:", err);
    });

    device.on("disconnect", () => {
      console.log("Call disconnected");
      setIsCalling(false);
    });

    device.register(); // important to register the device
    setIsCalling(true);
  } catch (error) {
    console.error("Call failed:", error);
    alert("Call failed. Check console.");
  }
};


  return (
    <div className="relative w-full h-screen text-white">
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      <div className="relative z-10 flex flex-col lg:flex-row md:flex-row items-center justify-center h-full">
        {/* Left Panel */}
        <div className="h-5/6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 pt-10 w-80 flex flex-col items-center justify-center space-y-6 mb-6 md:mb-0 md:mr-10">
          {!isCalling ? (
            <>
              <div className="text-xl font-semibold">Dial a Number</div>
              <div className="text-xl bg-white text-black px-4 py-2 rounded">
                {phoneNumber || "___"}
              </div>

              {/* Dialpad */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "*",
                  "0",
                  "#",
                ].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleNumberClick(digit)}
                    className="bg-gray-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl hover:bg-gray-600"
                  >
                    {digit}
                  </button>
                ))}
              </div>

              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4"
                onClick={handleCall}
              >
                Call
              </Button>
            </>
          ) : (
            <>
              <Image
                src="/avatars/kristin.jpg"
                alt="Kristin Watson"
                width={100}
                height={100}
                className="rounded-full border-4 border-white mb-4"
              />
              <div className="text-xl font-semibold">Kristin Watson</div>
              <div className="text-sm text-gray-300 mb-6">{phoneNumber}</div>

              <div className="flex justify-between items-center space-x-4 mb-6">
                <ActionIcon icon={<Mic size={20} />} />
                <ActionIcon icon={<Grid3X3 size={20} />} />
                <ActionIcon icon={<MicOff size={20} />} />
                <ActionIcon icon={<CircleDot size={20} />} />
              </div>

              <Button
                className="bg-red-600 hover:bg-red-700 w-12 h-12 rounded-full flex items-center justify-center"
                onClick={() => {
                  setIsCalling(false);
                  setPhoneNumber("");
                }}
              >
                <PhoneOff className="text-white" size={24} />
              </Button>
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-6 md:mb-0 md:mr-10">
          <div className="right-10 z-10 bg-white text-black rounded-md p-2 shadow-lg w-72">
            <textarea
              placeholder="Notes.."
              className="w-full h-28 resize-none p-2 bg-white border-none rounded-md focus:outline-none"
            />
          </div>

          <div className="bg-[#1F2937] rounded-xl shadow-lg p-4 w-72 overflow-y-auto max-h-[400px]">
            {callUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={user.img}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.phone}</div>
                  </div>
                </div>
                <button className="bg-red-600 hover:bg-red-700 rounded-full p-2">
                  <PhoneOff size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionIcon = ({ icon }: { icon: React.ReactNode }) => (
  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 cursor-pointer">
    {icon}
  </div>
);
