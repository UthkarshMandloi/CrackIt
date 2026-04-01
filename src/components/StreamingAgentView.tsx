"use client";

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import * as did from "@d-id/client-sdk";

export interface StreamingAgentHandle {
  sendMessage: (text: string) => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => void;
  status: "idle" | "connecting" | "connected" | "error";
}

interface StreamingAgentViewProps {
  agentId: string;
  clientKey: string;
  onMessage?: (message: string) => void;
  onStatusChange?: (status: StreamingAgentHandle["status"]) => void;
}

const StreamingAgentView = forwardRef<StreamingAgentHandle, StreamingAgentViewProps>(
  ({ agentId, clientKey, onMessage, onStatusChange }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const agentManagerRef = useRef<any>(null);
    const [status, setStatus] = useState<StreamingAgentHandle["status"]>("idle");

    const updateStatus = useCallback((newStatus: StreamingAgentHandle["status"]) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    }, [onStatusChange]);

    const connect = useCallback(async () => {
      if (agentManagerRef.current || status === "connecting") return;
      
      updateStatus("connecting");
      try {
        const auth = { type: "key" as const, clientKey };
        
        const agentManager = await did.createAgentManager(agentId, {
          auth,
          callbacks: {
            onSrcObjectReady(stream) {
              console.log("D-ID: Stream ready");
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
            },
            onConnectionStateChange(state) {
              console.log("D-ID: Connection state:", state);
              if (state === "connected") updateStatus("connected");
              if (state === "disconnected") updateStatus("idle");
            },
            onNewMessage(message: any) {
              console.log("D-ID: Message received:", message);
              if (typeof message === "string") {
                onMessage?.(message);
              } else if (message && typeof message === 'object' && 'content' in message) {
                // @ts-ignore
                onMessage?.(message.content);
              }
            },
            onError(error) {
              console.error("D-ID: Error:", error);
              updateStatus("error");
            }
          }
        });

        agentManagerRef.current = agentManager;
        await agentManager.connect();
      } catch (err) {
        console.error("D-ID: Failed to initialize:", err);
        updateStatus("error");
      }
    }, [agentId, clientKey, onMessage, onStatusChange, status, updateStatus]);

    const disconnect = useCallback(() => {
      if (agentManagerRef.current) {
        agentManagerRef.current.disconnect();
        agentManagerRef.current = null;
        updateStatus("idle");
      }
    }, [updateStatus]);

    const sendMessage = useCallback(async (text: string) => {
      if (agentManagerRef.current && status === "connected") {
        await agentManagerRef.current.chat(text);
      } else {
        console.warn("D-ID: Not connected, cannot send message");
      }
    }, [status]);

    useImperativeHandle(ref, () => ({
      sendMessage,
      connect,
      disconnect,
      status
    }));

    useEffect(() => {
      return () => {
        if (agentManagerRef.current) {
          agentManagerRef.current.disconnect();
        }
      };
    }, []);

    return (
      <div className="w-full h-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-2xl group animate-fade-in">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 pointer-events-none z-10" />
        
        {/* The Live Video Stream */}
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Overlay when not connected */}
          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 backdrop-blur-sm z-20">
              <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6 shadow-soft">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Initialize AI Agent</h4>
              <p className="text-slate-400 text-xs mb-8 max-w-xs">
                To enable two-way sync and deep interactive mock interviews, connect to the D-ID agent stream.
              </p>
              <button
                onClick={connect}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm shadow-card hover:-translate-y-0.5 transition-all"
              >
                Start AI Stream
              </button>
            </div>
          )}

          {status === "connecting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md z-30">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
              <p className="text-white text-xs font-bold uppercase tracking-widest animate-pulse">Establishing WebRTC Stream...</p>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/60 backdrop-blur-md z-30 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 border border-red-500/30">
                <span className="text-red-500 font-bold">!</span>
              </div>
              <p className="text-white text-xs font-bold mb-4 italic">Connection failed. Check API key and domain allowance.</p>
              <button
                onClick={connect}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/10"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>

        {/* Floating Status Indicator */}
        <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none z-40">
          <div className="px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-2 shadow-card">
            <div className={`w-2 h-2 rounded-full ${status === "connected" ? "bg-green-400 animate-pulse" : "bg-slate-400"}`} />
            <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">
              {status === "connected" ? "Live Sync Active" : "Stream Idle"}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

StreamingAgentView.displayName = "StreamingAgentView";

export default StreamingAgentView;
