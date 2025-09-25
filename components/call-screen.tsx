"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CallScreenProps {
  contactName?: string;
  contactPhone?: string;
  onEndCall: () => void;
  isConnected: boolean;
  callStatus: "idle" | "calling" | "ringing" | "connected" | "disconnected";
}

export default function CallScreen({
  contactName = "Unknown",
  contactPhone = "",
  onEndCall,
  isConnected,
  callStatus,
}: CallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [notes, setNotes] = useState("");

  const getStatusText = () => {
    switch (callStatus) {
      case "ringing":
        return "Ringing...";
      case "connected":
        return "Connected";
      case "disconnected":
        return "Call Ended";
      default:
        return "Connecting...";
    }
  };

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {contactName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">
            {contactName}
          </h2>
          <p className="text-blue-100 text-sm mb-2">{contactPhone}</p>

          {/* Call Status */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${
              callStatus === "connected" ? 'bg-green-400' :
              callStatus === "ringing" ? 'bg-yellow-400' :
              'bg-gray-400'
            } animate-pulse`}></div>
            <span className="text-white text-sm">
              {getStatusText()}
            </span>
          </div>

          {/* Call Duration */}
          {isConnected && (
            <div className="flex items-center justify-center gap-1 text-blue-100">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatDuration(callDuration)}</span>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="p-6">
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full ${
                isMuted
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>

            <Button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-12 h-12 rounded-full ${
                isSpeakerOn
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {isSpeakerOn ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>

            <Button
              onClick={onEndCall}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>

          {/* Call Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Call Notes
            </label>
            <Textarea
              placeholder="Add notes about this call..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none h-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
