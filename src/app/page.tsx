"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useVapi } from "@/hooks/useVapi";
import { CallModal } from "@/components/CallModal";

const ASSISTANTS = {
  maya: "09ed31b4-5f9e-4f81-80cc-c4efcd015bb7",
  rohan: "0dea8c20-d0a0-482d-a07a-24e5837f8bd3",
};

export default function Home() {
  const [selectedAssistant, setSelectedAssistant] = useState<"maya" | "rohan">("maya");
  
  const {
    isSessionActive,
    isLoading,
    startCall,
    endCall,
    transcript,
    isSpeaking,
  } = useVapi({ assistantId: ASSISTANTS[selectedAssistant] });

  const handleConnect = async () => {
    try {
      await startCall();
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose Assistant</label>
            <Select
              value={selectedAssistant}
              onValueChange={(value) => setSelectedAssistant(value as "maya" | "rohan")}
              disabled={isSessionActive || isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an assistant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maya">Maya (Female)</SelectItem>
                <SelectItem value="rohan">Rohan (Male)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isLoading || isSessionActive}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      </div>

      {/* Call Modal - Opens when connected */}
      <CallModal
        open={isSessionActive}
        onClose={endCall}
        assistantName={selectedAssistant === "maya" ? "Maya" : "Rohan"}
        transcript={transcript}
        isSpeaking={isSpeaking}
      />
    </main>
  );
}
