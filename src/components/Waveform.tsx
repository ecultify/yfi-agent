"use client";

import * as React from "react";

interface WaveformProps {
  isActive: boolean;
}

export function Waveform({ isActive }: WaveformProps) {
  const animationRef = React.useRef<number | undefined>(undefined);
  const phaseRef = React.useRef(0);
  const currentAmplitudeRef = React.useRef(2);
  const targetAmplitudeRef = React.useRef(2);

  React.useEffect(() => {
    const canvas = document.getElementById("waveform-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update target amplitude based on speaking state
      if (isActive) {
        // Random modulation when speaking (like voice fluctuation)
        if (Math.random() > 0.95) {
          targetAmplitudeRef.current = 15 + Math.random() * 25;
        }
      } else {
        // Small breathing effect when idle
        targetAmplitudeRef.current = 2;
      }

      // Smooth interpolation (lerping) toward target - 8% per frame
      currentAmplitudeRef.current +=
        (targetAmplitudeRef.current - currentAmplitudeRef.current) * 0.08;

      // Draw three layered waves
      drawWave(ctx, width, centerY, phaseRef.current * 0.5, currentAmplitudeRef.current * 0.6, "#9333ea", 3, 0.4); // Purple - Back layer
      drawWave(ctx, width, centerY, phaseRef.current * 0.8, currentAmplitudeRef.current * 0.8, "#ec4899", 2.5, 0.6); // Pink - Middle layer
      drawWave(ctx, width, centerY, phaseRef.current, currentAmplitudeRef.current, "#3b82f6", 3, 1); // Blue - Front layer

      // Increment phase for animation
      phaseRef.current += 0.05;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  // Function to draw a single wave layer
  const drawWave = (
    ctx: CanvasRenderingContext2D,
    width: number,
    centerY: number,
    phase: number,
    amplitude: number,
    color: string,
    lineWidth: number,
    opacity: number
  ) => {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;

    const points = 100;
    const step = width / points;

    for (let i = 0; i <= points; i++) {
      const x = i * step;
      const frequency1 = 0.02;
      const frequency2 = 0.04;
      const frequency3 = 0.01;

      // Multiple sine waves combined for organic look
      const y =
        centerY +
        Math.sin(x * frequency1 + phase) * amplitude +
        Math.sin(x * frequency2 + phase * 1.5) * (amplitude * 0.5) +
        Math.sin(x * frequency3 + phase * 0.8) * (amplitude * 0.3);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <canvas
        id="waveform-canvas"
        width={800}
        height={200}
        className="w-full h-full drop-shadow-lg"
        style={{ filter: "drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3))" }}
      />
    </div>
  );
}

