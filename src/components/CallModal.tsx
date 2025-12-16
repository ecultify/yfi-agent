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
  isSpeaking,
}: CallModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Connected to {assistantName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Waveform Visualization */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-12 flex items-center justify-center">
            <Waveform isActive={isSpeaking} />
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div
              className={`w-3 h-3 rounded-full transition-all ${
                isSpeaking
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            />
            <span>{isSpeaking ? "AI is speaking..." : "Listening..."}</span>
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

