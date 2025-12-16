"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Security: Type-safe interface to prevent injection attacks
interface VapiConfig {
  apiKey?: string;
  assistantId?: string;
}

interface UseVapiParams {
  assistantId?: string;
}

// Security: Sanitize and validate user input
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "");
};

export function useVapi(params?: UseVapiParams) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: string; text: string; timestamp: number }>>([]);
  const vapiRef = useRef<any>(null);
  const [isVapiLoaded, setIsVapiLoaded] = useState(false);

  // Initialize Vapi when component mounts
  useEffect(() => {
    const loadVapi = async () => {
      try {
        // Dynamically import Vapi to avoid SSR issues
        const Vapi = (await import("@vapi-ai/web")).default;
        
        // Security: Only initialize with validated config
        const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        
        if (!apiKey) {
          console.warn("Vapi API key not provided. Please set NEXT_PUBLIC_VAPI_API_KEY");
          setCallStatus("Configuration error: API key missing");
          return;
        }

        // Initialize Vapi instance
        vapiRef.current = new Vapi(apiKey);
        setIsVapiLoaded(true);

        // Set up event listeners
        vapiRef.current.on("call-start", () => {
          setIsSessionActive(true);
          setCallStatus("Call connected");
          setIsLoading(false);
          setTranscript([]);
        });

        vapiRef.current.on("call-end", () => {
          setIsSessionActive(false);
          setCallStatus("Call ended");
          setIsLoading(false);
          setIsSpeaking(false);
        });

        vapiRef.current.on("speech-start", () => {
          setIsSpeaking(true);
          setCallStatus("AI is speaking...");
        });

        vapiRef.current.on("speech-end", () => {
          setIsSpeaking(false);
          setCallStatus("Listening...");
        });

        // Transcript events - handle streaming updates
        vapiRef.current.on("message", (message: any) => {
          console.log("Vapi message:", message);
          
          if (message.type === "transcript") {
            const role = message.role || "user";
            const text = message.transcript || message.transcriptChunk || "";
            const isFinal = message.isFinal !== false; // Default to true if not specified
            
            if (text) {
              setTranscript((prev) => {
                // If it's a partial transcript (not final), update the last message of the same role
                if (!isFinal && prev.length > 0 && prev[prev.length - 1].role === role) {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: sanitizeInput(role),
                    text: sanitizeInput(text),
                    timestamp: Date.now(),
                  };
                  return updated;
                }
                
                // Otherwise, add a new message
                return [
                  ...prev,
                  {
                    role: sanitizeInput(role),
                    text: sanitizeInput(text),
                    timestamp: Date.now(),
                  },
                ];
              });
            }
          }
        });

        // Handle conversation updates
        vapiRef.current.on("conversation-update", (update: any) => {
          console.log("Conversation update:", update);
          
          if (update.transcript) {
            const role = update.role || "assistant";
            const text = update.transcript;
            const isFinal = update.isFinal !== false;
            
            setTranscript((prev) => {
              // Update last message if it's the same role and not final
              if (!isFinal && prev.length > 0 && prev[prev.length - 1].role === role) {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: sanitizeInput(role),
                  text: sanitizeInput(text),
                  timestamp: Date.now(),
                };
                return updated;
              }
              
              // Add new message
              return [
                ...prev,
                {
                  role: sanitizeInput(role),
                  text: sanitizeInput(text),
                  timestamp: Date.now(),
                },
              ];
            });
          }
        });

        vapiRef.current.on("error", (error: any) => {
          console.error("Vapi error:", error);
          setCallStatus(`Error: ${sanitizeInput(error.message || "Unknown error")}`);
          setIsLoading(false);
        });

      } catch (error) {
        console.error("Failed to load Vapi:", error);
        setCallStatus("Failed to initialize voice agent");
      }
    };

    loadVapi();

    // Cleanup on unmount
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!vapiRef.current || !isVapiLoaded) {
      setCallStatus("Voice agent not ready");
      return;
    }

    try {
      setIsLoading(true);
      setCallStatus("Connecting...");

      // Security: Use assistant ID from params or environment
      const assistantId = params?.assistantId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

      if (!assistantId) {
        throw new Error("Assistant ID not configured");
      }

      // Start the call with proper error handling
      await vapiRef.current.start(assistantId);
    } catch (error: any) {
      console.error("Failed to start call:", error);
      setCallStatus(`Failed to connect: ${sanitizeInput(error.message || "Unknown error")}`);
      setIsLoading(false);
    }
  }, [params?.assistantId, isVapiLoaded]);

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      setIsSessionActive(false);
      setCallStatus("");
      setIsMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current && isSessionActive) {
      const newMutedState = !isMuted;
      vapiRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
      setCallStatus(newMutedState ? "Microphone muted" : "Microphone active");
    }
  }, [isMuted, isSessionActive]);

  return {
    isSessionActive,
    isMuted,
    isLoading,
    callStatus,
    isVapiLoaded,
    isSpeaking,
    transcript,
    startCall,
    endCall,
    toggleMute,
  };
}

