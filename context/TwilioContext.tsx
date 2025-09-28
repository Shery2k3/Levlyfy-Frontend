"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Device } from "@twilio/voice-sdk";
import axiosInstance from "@/lib/api";

type InitStatus = "idle" | "initializing" | "ready" | "error";

type TwilioContextValue = {
  deviceRef: React.MutableRefObject<Device | null>;
  initStatus: InitStatus;
  lastError: any;
  currentConnection: any | null;
  lastIncoming: any | null;
  callDuration: number;
  isMuted: boolean;
  init: () => Promise<void>;
  connect: (params: Record<string, any>) => any | null;
  disconnectAll: () => void;
  mute: (connection: any | null, shouldMute: boolean) => void;
  acceptIncoming: (incoming: any) => void;
};

const TwilioContext = createContext<TwilioContextValue | undefined>(undefined);

export function TwilioProvider({ children }: { children: React.ReactNode }) {
  const deviceRef = useRef<Device | null>(null);
  const [initStatus, setInitStatus] = useState<InitStatus>("idle");
  const [lastError, setLastError] = useState<any>(null);
  const [currentConnection, setCurrentConnection] = useState<any | null>(null);
  const [lastIncoming, setLastIncoming] = useState<any | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  const callTimerRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (deviceRef.current) {
        try {
          deviceRef.current.destroy();
        } catch (e) {
          // ignore
        }
        deviceRef.current = null;
      }
      if (callTimerRef.current !== null) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    };
  }, []);

  const startCallTimer = () => {
    if (callTimerRef.current !== null) return;
    callTimerRef.current = window.setInterval(() => {
      setCallDuration((p) => p + 1);
    }, 1000) as unknown as number;
  };

  const stopCallTimer = () => {
    if (callTimerRef.current !== null) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallDuration(0);
  };

  // Lazy init - safe to call multiple times
  const init = async () => {
    if (deviceRef.current) return; // already initialized
    setInitStatus("initializing");
    try {
      const response = await axiosInstance.get("/twilio/token");
      const data = response.data;
      const device = new Device(data.token);
      deviceRef.current = device;

      device.on("ready", () => {
        setInitStatus("ready");
      });

      device.on("error", (err) => {
        console.error("Twilio Device Error (provider):", err);
        setLastError(err);
        setInitStatus("error");
      });

      // Track last connect params so we can use them in the connect event
      const lastConnectParamsRef = {
        current: null as Record<string, any> | null,
      };

      device.on("connect", (connection: any) => {
        console.log("[TwilioProvider] connect", connection);
        setCurrentConnection(connection);

        const rawStatus =
          connection.parameters?.DialCallStatus ||
          connection.parameters?.CallStatus ||
          connection.parameters?.callStatus ||
          connection.parameters?.status;

        if (rawStatus) {
          const s = String(rawStatus).toLowerCase();
          if (s === "in-progress" || s === "answered" || s === "connected") {
            startCallTimer();
          }
        }

        // wire a few connection-level handlers
        try {
          connection.on?.("accept", () => {
            startCallTimer();
          });
          connection.on?.("disconnect", () => {
            stopCallTimer();
            setCurrentConnection(null);
            setIsMuted(false);
          });
        } catch (e) {
          console.debug("Connection event wiring not supported:", e);
        }

        // Persist call metadata server-side if we have params and a CallSid
        const callSid =
          connection.parameters?.CallSid ||
          connection.parameters?.callSid ||
          connection.outgoingConnectionId ||
          connection.parameters?.["Call-SID"];

        if (callSid) {
          try {
            const numberCalled =
              lastConnectParamsRef.current?.To ||
              lastConnectParamsRef.current?.to ||
              null;
            if (numberCalled) {
              console.log(
                "[TwilioProvider] Storing call metadata for:",
                numberCalled
              );
              axiosInstance
                .post("/twilio/call-started", {
                  callSid: callSid,
                  phoneNumber: numberCalled,
                })
                .then((res) => console.log("Call metadata stored", res.data))
                .catch((e) =>
                  console.warn("Failed to store call metadata:", e)
                );
            }
          } catch (err) {
            console.error("Failed to store call metadata (provider):", err);
          }
        }
      });

      device.on("incoming", (incomingCall: any) => {
        console.log("[TwilioProvider] incoming call", incomingCall);
        setLastIncoming(incomingCall);
      });

      device.on("cancel", () => {
        console.log("[TwilioProvider] call cancelled");
      });

      device.on("presence", (p: any) => {
        console.log("[TwilioProvider] presence", p);
      });

      device.on("disconnect", () => {
        stopCallTimer();
        setCurrentConnection(null);
        setIsMuted(false);
      });

      // register device - best-effort
      try {
        await device.register();
      } catch (e) {
        console.warn("Twilio device register failed (provider):", e);
      }

      setInitStatus("ready");
    } catch (err) {
      console.error("Twilio init failed:", err);
      setLastError(err);
      setInitStatus("error");
    }
  };

  // Keep track of last params so provider can persist metadata when connection fires
  const lastConnectParamsRef = useRef<Record<string, any> | null>(null);

  const connect = (params: Record<string, any>) => {
    const device = deviceRef.current;
    if (!device) {
      console.warn("connect() called before device init");
      return null;
    }
    try {
      lastConnectParamsRef.current = params;
      const c = device.connect({ params });
      return c as any;
    } catch (e) {
      console.error("Device.connect failed:", e);
      return null;
    }
  };

  const disconnectAll = () => {
    const device = deviceRef.current;
    if (device) {
      try {
        device.disconnectAll();
      } catch (e) {
        console.warn("disconnectAll failed:", e);
      }
    }
  };

  const mute = (connection: any | null, shouldMute: boolean) => {
    if (!connection) return;
    try {
      connection.mute(shouldMute);
      setIsMuted(shouldMute);
    } catch (e) {
      console.warn("mute failed:", e);
    }
  };

  const acceptIncoming = (incoming: any) => {
    try {
      incoming?.accept?.();
      // also set as current connection
      setCurrentConnection(incoming);
    } catch (e) {
      console.warn("acceptIncoming failed:", e);
    }
  };

  const value: TwilioContextValue = {
    deviceRef,
    initStatus,
    lastError,
    currentConnection,
    lastIncoming,
    callDuration,
    isMuted,
    init,
    connect,
    disconnectAll,
    mute,
    acceptIncoming,
  };

  return (
    <TwilioContext.Provider value={value}>{children}</TwilioContext.Provider>
  );
}

export function useTwilio() {
  const ctx = useContext(TwilioContext);
  if (!ctx) throw new Error("useTwilio must be used within TwilioProvider");
  return ctx;
}
