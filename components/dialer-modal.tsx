"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Device } from "@twilio/voice-sdk"
import axiosInstance from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, PhoneCall, PhoneOff, Loader2 } from "lucide-react"

const countries = [
  { code: "+1", country: "United States", flag: "🇺🇸", iso: "US" },
  { code: "+1", country: "Canada", flag: "🇨🇦", iso: "CA" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", iso: "GB" },
  { code: "+33", country: "France", flag: "🇫🇷", iso: "FR" },
  { code: "+49", country: "Germany", flag: "🇩🇪", iso: "DE" },
  { code: "+39", country: "Italy", flag: "🇮🇹", iso: "IT" },
  { code: "+34", country: "Spain", flag: "🇪🇸", iso: "ES" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱", iso: "NL" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭", iso: "CH" },
  { code: "+46", country: "Sweden", flag: "🇸🇪", iso: "SE" },
  { code: "+47", country: "Norway", flag: "🇳🇴", iso: "NO" },
  { code: "+45", country: "Denmark", flag: "🇩🇰", iso: "DK" },
  { code: "+358", country: "Finland", flag: "🇫🇮", iso: "FI" },
  { code: "+43", country: "Austria", flag: "🇦🇹", iso: "AT" },
  { code: "+32", country: "Belgium", flag: "🇧🇪", iso: "BE" },
  { code: "+351", country: "Portugal", flag: "🇵🇹", iso: "PT" },
  { code: "+30", country: "Greece", flag: "🇬🇷", iso: "GR" },
  { code: "+48", country: "Poland", flag: "🇵🇱", iso: "PL" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿", iso: "CZ" },
  { code: "+36", country: "Hungary", flag: "🇭🇺", iso: "HU" },
  { code: "+61", country: "Australia", flag: "🇦🇺", iso: "AU" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿", iso: "NZ" },
  { code: "+81", country: "Japan", flag: "🇯🇵", iso: "JP" },
  { code: "+82", country: "South Korea", flag: "🇰🇷", iso: "KR" },
  { code: "+86", country: "China", flag: "🇨🇳", iso: "CN" },
  { code: "+91", country: "India", flag: "🇮🇳", iso: "IN" },
  { code: "+65", country: "Singapore", flag: "🇸🇬", iso: "SG" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", iso: "MY" },
  { code: "+66", country: "Thailand", flag: "🇹🇭", iso: "TH" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳", iso: "VN" },
  { code: "+63", country: "Philippines", flag: "🇵🇭", iso: "PH" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩", iso: "ID" },
  { code: "+55", country: "Brazil", flag: "🇧🇷", iso: "BR" },
  { code: "+52", country: "Mexico", flag: "🇲🇽", iso: "MX" },
  { code: "+54", country: "Argentina", flag: "🇦🇷", iso: "AR" },
  { code: "+56", country: "Chile", flag: "🇨🇱", iso: "CL" },
  { code: "+57", country: "Colombia", flag: "🇨🇴", iso: "CO" },
  { code: "+51", country: "Peru", flag: "🇵🇪", iso: "PE" },
  { code: "+27", country: "South Africa", flag: "🇿🇦", iso: "ZA" },
  { code: "+20", country: "Egypt", flag: "🇪🇬", iso: "EG" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬", iso: "NG" },
  { code: "+254", country: "Kenya", flag: "🇰🇪", iso: "KE" },
  { code: "+971", country: "UAE", flag: "🇦🇪", iso: "AE" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", iso: "SA" },
  { code: "+972", country: "Israel", flag: "🇮🇱", iso: "IL" },
  { code: "+90", country: "Turkey", flag: "🇹🇷", iso: "TR" },
  { code: "+7", country: "Russia", flag: "🇷🇺", iso: "RU" },
]

// Use the verified phone number from your .env
const VERIFIED_PHONE_NUMBER_TO_CALL = "+923142113157";

interface DialerModalProps {
  trigger?: React.ReactNode;
}

export default function DialerModal({ trigger }: DialerModalProps) {
  const [selectedCountry, setSelectedCountry] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  
  // Twilio states
  const twilioDeviceRef = useRef<Device | null>(null);
  const [callStatus, setCallStatus] = useState("Offline");
  const [conn, setConn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch token and initialize Twilio Device
  useEffect(() => {
    if (twilioDeviceRef.current) {
      return;
    }

    const setupTwilioDevice = async () => {
      try {
        setIsLoading(true);

        const response = await axiosInstance.get("/twilio/token");
        console.log("Received Twilio token:", response.data);
        const data = response.data;

        const device = new Device(data.token, {
          logLevel: 2,
        });

        twilioDeviceRef.current = device;

        // Set up event listeners BEFORE registering
        device.on("ready", () => {
          console.log("Twilio Device is ready.");
          setCallStatus("Ready");
          setIsLoading(false);
        });

        device.on("error", (error) => {
          console.error("Twilio Device Error:", error);
          setCallStatus("Error");
          setIsLoading(false);
        });

        // Fix the connect event to properly handle CallSid
        device.on("connect", async (connection) => {
          console.log("Successfully established call!");
          console.log("Connection object:", connection);
          console.log("Connection parameters:", connection.parameters);

          setCallStatus("Connected");
          setConn(connection);

          // Get CallSid from connection - try multiple possible locations
          const callSid =
            connection.parameters?.CallSid ||
            connection.parameters?.callSid ||
            connection.outgoingConnectionId ||
            connection.parameters?.["Call-SID"];

          console.log("Extracted CallSid:", callSid);

          if (callSid) {
            try {
              console.log("🔄 Storing call metadata...");
              const response = await axiosInstance.post("/twilio/call-started", {
                callSid: callSid,
                phoneNumber: VERIFIED_PHONE_NUMBER_TO_CALL,
              });
              console.log("✅ Call metadata stored successfully:", response.data);
            } catch (error) {
              console.error("❌ Failed to store call metadata:", error);
            }
          } else {
            console.error("❌ Could not extract CallSid from connection");
            console.error("Available connection properties:", Object.keys(connection));
            console.error("Available parameters:", Object.keys(connection.parameters || {}));
          }
        });

        device.on("disconnect", () => {
          console.log("Call disconnected.");
          setCallStatus("Ready");
          setConn(null);
        });

        device.on("registered", () => {
          console.log("Device registered successfully");
          setCallStatus("Ready");
          setIsLoading(false);
        });

        device.on("unregistered", () => {
          console.log("Device unregistered");
          setCallStatus("Offline");
        });

        // Register the device
        await device.register();

        setTimeout(() => {
          if (callStatus === "Offline" && device.state === "registered") {
            console.log("Device ready timeout - setting status manually");
            setCallStatus("Ready");
            setIsLoading(false);
          }
        }, 3000);
      } catch (error) {
        console.error("Error setting up Twilio Device:", error);
        setCallStatus("Error");
        setIsLoading(false);
      }
    };

    setupTwilioDevice();

    return () => {
      if (twilioDeviceRef.current) {
        twilioDeviceRef.current.destroy();
        twilioDeviceRef.current = null;
      }
    };
  }, []);

  const handleCall = () => {
    const device = twilioDeviceRef.current;
    if (!device) {
      alert("Twilio Device not initialized.");
      return;
    }

    // Use the verified number for now, but you could extend this to use custom numbers
    const numberToCall = VERIFIED_PHONE_NUMBER_TO_CALL;
    // For custom dialing: const numberToCall = `${selectedCountry}${phoneNumber.replace(/\D/g, '')}`;

    const params = { To: numberToCall };

    console.log(`Attempting to call ${params.To}...`);
    setCallStatus("Calling...");
    device.connect({ params });
  };

  const handleHangup = () => {
    const device = twilioDeviceRef.current;
    if (device) {
      device.disconnectAll();
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format based on length (US format as example)
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  const getStatusColor = () => {
    switch (callStatus) {
      case "Connected":
        return "text-green-400"
      case "Calling...":
        return "text-yellow-400"
      case "Error":
        return "text-red-400"
      case "Ready":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />
    }
    switch (callStatus) {
      case "Connected":
      case "Calling...":
        return <PhoneCall className="w-4 h-4" />
      case "Ready":
        return <Phone className="w-4 h-4" />
      default:
        return <PhoneOff className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Call Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-lime-400" />
            Make a Call
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isLoading ? "Initializing Twilio Device..." : "Ready to make calls via Twilio"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Device Status */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm text-gray-400">Status:</span>
              <span className={`font-medium ${getStatusColor()}`}>
                {callStatus}
              </span>
            </div>
          </div>

          {/* For demo purposes, we'll show the verified number that will be called */}
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="text-sm text-yellow-400 mb-1">Demo Mode - Calling Verified Number:</div>
            <div className="text-lg font-mono text-yellow-300">
              {VERIFIED_PHONE_NUMBER_TO_CALL}
            </div>
            <div className="text-xs text-yellow-600 mt-1">
              This is the only number we can call in Twilio trial mode
            </div>
          </div>

          {/* Country Selector - For future use when not in trial mode */}
          <div className="space-y-2 opacity-50">
            <Label htmlFor="country" className="text-sm font-medium text-gray-300">
              Country (Future Feature)
            </Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-lime-500 focus:ring-lime-500">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white max-h-60">
                {countries.map((country) => (
                  <SelectItem
                    key={`${country.iso}-${country.code}`}
                    value={country.code}
                    className="focus:bg-gray-600 focus:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium">{country.code}</span>
                      <span className="text-gray-300">{country.country}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number Input - For future use when not in trial mode */}
          <div className="space-y-2 opacity-50">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
              Phone Number (Future Feature)
            </Label>
            <div className="flex gap-2">
              <div className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-lime-400 font-medium min-w-fit">
                {selectedCountry}
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="123-456-7890"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-lime-500 focus:ring-lime-500 flex-1"
                maxLength={12}
                disabled
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            
            {callStatus !== "Connected" && callStatus !== "Calling..." ? (
              <Button
                onClick={handleCall}
                disabled={callStatus !== "Ready" || isLoading}
                className="flex-1 bg-lime-500 hover:bg-lime-600 text-black disabled:bg-gray-600 disabled:text-gray-400 flex items-center gap-2 font-medium"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PhoneCall className="w-4 h-4" />
                )}
                {isLoading ? "Initializing..." : "Call Now"}
              </Button>
            ) : (
              <Button
                onClick={handleHangup}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 font-medium"
              >
                <PhoneOff className="w-4 h-4" />
                Hang Up
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
