"use client";

import * as React from "react";

interface WaveformProps {
  isActive: boolean;
}

export function Waveform({ isActive }: WaveformProps) {
  const [points, setPoints] = React.useState<number[]>([]);
  const animationRef = React.useRef<number>();
  const phaseRef = React.useRef(0);

  React.useEffect(() => {
    const numPoints = 60;
    
    const animate = () => {
      if (isActive) {
        // Create smooth sine wave with multiple frequencies
        const newPoints = Array.from({ length: numPoints }, (_, i) => {
          const x = i / numPoints;
          const wave1 = Math.sin(x * Math.PI * 4 + phaseRef.current) * 30;
          const wave2 = Math.sin(x * Math.PI * 2 + phaseRef.current * 1.5) * 20;
          const wave3 = Math.sin(x * Math.PI * 6 + phaseRef.current * 0.8) * 15;
          return 50 + wave1 + wave2 + wave3;
        });
        setPoints(newPoints);
        phaseRef.current += 0.15;
      } else {
        // Flat line when not speaking
        setPoints(Array.from({ length: numPoints }, () => 50));
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  // Generate SVG path from points
  const generatePath = () => {
    if (points.length === 0) return "";
    
    const width = 600;
    const height = 100;
    const step = width / (points.length - 1);
    
    let path = `M 0,${points[0]}`;
    
    for (let i = 1; i < points.length; i++) {
      const x = i * step;
      const y = points[i];
      const prevX = (i - 1) * step;
      const prevY = points[i - 1];
      
      // Create smooth curves using quadratic bezier
      const cpX = prevX + step / 2;
      const cpY = (prevY + y) / 2;
      path += ` Q ${cpX},${cpY} ${x},${y}`;
    }
    
    return path;
  };

  return (
    <div className="w-full h-32 flex items-center justify-center">
      <svg
        width="600"
        height="100"
        viewBox="0 0 600 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path
          d={generatePath()}
          stroke="url(#waveGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

