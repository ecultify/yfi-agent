"use client";

import * as React from "react";
import { PhoneOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/Waveform";

interface CallModalProps {
  open: boolean;
  onClose: () => void;
  assistantName: string;
  transcript: Array<{ role: string; text: string; timestamp: number }>;
  isSpeaking: boolean;
}

export function CallModal({
  open,
  onClose,
  assistantName,
  transcript,
  isSpeaking,
}: CallModalProps) {
  const transcriptEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcript arrives
  React.useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">
            Connected to {assistantName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          {/* Waveform Visualization */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 flex items-center justify-center">
            <Waveform isActive={isSpeaking} />
          </div>

          {/* Live Transcript */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">
              Live Transcript
            </h3>
            <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-gray-50 space-y-3">
              {transcript.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Transcript will appear here...
                </p>
              ) : (
                transcript.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      item.role === "assistant"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <span className="font-semibold text-xs block mb-1">
                      {item.role === "assistant" ? assistantName : "You"}
                    </span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          {/* Disconnect Button */}
          <Button
            onClick={onClose}
            variant="destructive"
            size="lg"
            className="w-full"
          >
            <PhoneOff className="mr-2 h-5 w-5" />
            End Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

