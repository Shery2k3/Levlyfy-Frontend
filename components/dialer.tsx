"use client";

import { useState, useEffect, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import axiosInstance from "../lib/api";

// Use the verified phone number from your .env
const VERIFIED_PHONE_NUMBER_TO_CALL = "+923142113157";

const Dialer = () => {
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

          setCallStatus("Connected"); // Change from "On Call" to "Connected"
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

    const params = { To: VERIFIED_PHONE_NUMBER_TO_CALL };

    console.log(`Attempting to call ${params.To}...`);
    setCallStatus("Calling..."); // Add intermediate status
    device.connect({ params });
  };

  const handleHangup = () => {
    const device = twilioDeviceRef.current;
    if (device) {
      device.disconnectAll();
    }
  };

  if (isLoading) {
    return (
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <h2>Web Dialer</h2>
        <p>Loading Twilio Device...</p>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
      <h2>Web Dialer</h2>
      <p>
        Status:{" "}
        <strong
          style={{
            color:
              callStatus === "Connected"
                ? "green"
                : callStatus === "Calling..."
                ? "orange"
                : callStatus === "Error"
                ? "red"
                : "black",
          }}
        >
          {callStatus}
        </strong>
      </p>

      {callStatus !== "Connected" && callStatus !== "Calling..." ? (
        <button
          onClick={handleCall}
          disabled={callStatus !== "Ready"}
          style={{
            padding: "10px 20px",
            backgroundColor: callStatus === "Ready" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: callStatus === "Ready" ? "pointer" : "not-allowed",
          }}
        >
          Call Verified Number
        </button>
      ) : (
        <button
          onClick={handleHangup}
          style={{
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Hang Up
        </button>
      )}

      <p style={{ marginTop: "15px", fontSize: "12px", color: "#666" }}>
        This will attempt to call: {VERIFIED_PHONE_NUMBER_TO_CALL}
      </p>
    </div>
  );
};

export default Dialer;
