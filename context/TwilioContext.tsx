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
    console.log("[TwilioProvider] init() called");
    setInitStatus("initializing");
    try {
      const response = await axiosInstance.get("/twilio/token");
      const data = response.data;
      console.log("[TwilioProvider] token response:", data);
      const device = new Device(data.token);
      console.log("[TwilioProvider] Device constructed");
      deviceRef.current = device;

      device.on("ready", () => {
        console.log("[TwilioProvider] device ready");
        setInitStatus("ready");
      });

      device.on("error", (err) => {
        console.error("[TwilioProvider] Twilio Device Error:", err);
        setLastError(err);
        setInitStatus("error");
      });

      // Track last connect params so we can use them in the connect event
      const lastConnectParamsRef = {
        current: null as Record<string, any> | null,
      };

      device.on("connect", (connection: any) => {
        console.log("[TwilioProvider] connect event", {
          connection,
          params: connection?.parameters,
        });
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
            console.log("[TwilioProvider] connection accepted");
            startCallTimer();
          });
          connection.on?.("disconnect", () => {
            console.log("[TwilioProvider] connection disconnected");
            stopCallTimer();
            setCurrentConnection(null);
            setIsMuted(false);
          });
          connection.on?.("error", (err: any) => {
            console.warn("[TwilioProvider] connection error:", err);
          });
        } catch (e) {
          console.debug("[TwilioProvider] Connection event wiring not supported:", e);
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
            console.log("[TwilioProvider] callSid detected:", callSid, "to:", numberCalled);
            if (numberCalled) {
              axiosInstance
                .post("/twilio/call-started", {
                  callSid: callSid,
                  phoneNumber: numberCalled,
                })
                .then((res) => console.log("[TwilioProvider] Call metadata stored", res.data))
                .catch((e) => console.warn("[TwilioProvider] Failed to store call metadata:", e));
            }
          } catch (err) {
            console.error("[TwilioProvider] Failed to store call metadata:", err);
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
        console.log("[TwilioProvider] device disconnect event");
        stopCallTimer();
        setCurrentConnection(null);
        setIsMuted(false);
      });

      // register device - best-effort
      try {
        await device.register();
        console.log("[TwilioProvider] device register attempted");
      } catch (e) {
        console.warn("[TwilioProvider] Twilio device register failed:", e);
      }

      console.log("[TwilioProvider] init successful, provider ready");
      setInitStatus("ready");
    } catch (err) {
      console.error("[TwilioProvider] Twilio init failed:", err);
      setLastError(err);
      setInitStatus("error");
    }
  };

  // Keep track of last params so provider can persist metadata when connection fires
  const lastConnectParamsRef = useRef<Record<string, any> | null>(null);

  const connect = (params: Record<string, any>) => {
    const device = deviceRef.current;
    if (!device) {
      console.warn("[TwilioProvider] connect() called before device init");
      return null;
    }
    try {
      lastConnectParamsRef.current = params;
      console.log("[TwilioProvider] connect() params:", params);
      const cPromise = device.connect({ params });
      // device.connect may return a Promise that resolves to the connection
      if (cPromise && typeof (cPromise as any).then === "function") {
        (cPromise as any)
          .then((conn: any) => {
            try {
              conn?.on?.("accept", () => console.log("[TwilioProvider] connection.accept fired"));
              conn?.on?.("disconnect", () => console.log("[TwilioProvider] connection.disconnect fired"));
              conn?.on?.("error", (e: any) => console.warn("[TwilioProvider] connection.error:", e));
            } catch (e) {
              // ignore wiring failures
            }
          })
          .catch((e: any) => console.warn("[TwilioProvider] connection promise rejected:", e));
      }
      return cPromise as any;
    } catch (e) {
      console.error("[TwilioProvider] Device.connect failed:", e);
      return null;
    }
  };

  const disconnectAll = () => {
    const device = deviceRef.current;
    if (device) {
      try {
        console.log("[TwilioProvider] disconnectAll()");
        device.disconnectAll();
      } catch (e) {
        console.warn("[TwilioProvider] disconnectAll failed:", e);
      }
    }
  };

  const mute = (connection: any | null, shouldMute: boolean) => {
    if (!connection) return;
    try {
      console.log("[TwilioProvider] mute()", { shouldMute });
      connection.mute(shouldMute);
      setIsMuted(shouldMute);
    } catch (e) {
      console.warn("[TwilioProvider] mute failed:", e);
    }
  };

  const acceptIncoming = (incoming: any) => {
    try {
      console.log("[TwilioProvider] acceptIncoming()", incoming);
      incoming?.accept?.();
      // also set as current connection
      setCurrentConnection(incoming);
    } catch (e) {
      console.warn("[TwilioProvider] acceptIncoming failed:", e);
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
