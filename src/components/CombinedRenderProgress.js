"use client";
import React, { useEffect, useState } from 'react';

export default function CombinedRenderProgress({ scenesData }) {
  // Calculate the total estimated render time (in seconds) for all scenes.
  // Use the formula: (frames * 0.5) + 15 seconds for each scene.
  const totalTimeSeconds = scenesData.reduce((acc, scene) => {
    const frames = scene.out_frame - scene.in_frame;
    if (frames > 0) {
      return acc + (frames * 0.2 + 7);
    }
    return acc;
  }, 0);

  // If totalTimeSeconds is zero (or no scene has frames), we return nothing.
  if (totalTimeSeconds <= 0) return null;

  // State to keep track of overall progress percentage.
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Convert total estimated time to milliseconds.
    const totalDurationMs = totalTimeSeconds * 1000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Calculate progress as a percentage (max capped at 100).
      const newProgress = Math.min((elapsed / totalDurationMs) * 100, 100);
      setProgress(newProgress);

      // Clear timer when progress is complete.
      if (newProgress >= 100) {
        clearInterval(timer);
      }
    }, 100); // update every 100ms

    return () => clearInterval(timer);
  }, [totalTimeSeconds]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <p style={{ marginBottom: "4px" }}>
        Overall Estimated Render Time: {totalTimeSeconds.toFixed(1)} sec
      </p>
      <div
        style={{
          background: "#ddd",
          borderRadius: "4px",
          width: "100%",
          height: "20px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#0070f3",
            borderRadius: "4px",
            transition: "width 0.1s ease-out"
          }}
        />
      </div>
      <p style={{ margin: "4px 0", fontSize: "0.9em" }}>{Math.floor(progress)}%</p>
    </div>
  );
}
