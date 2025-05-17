"use client";
import React, { useEffect, useState } from 'react';

export default function CombinedRenderProgress({ scenesData }) {
  // Calculate the overall estimated render time using the new formula: (frames * 0.2) + 7 for each scene.
  const totalTimeSeconds = scenesData.reduce((acc, scene) => {
    const frames = scene.out_frame - scene.in_frame;
    if (frames > 0) {
      return acc + (frames * 1);
    }
    return acc;
  }, 0);

  // If there is no valid estimated time, do not render anything.
  if (totalTimeSeconds <= 0) return null;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDurationMs = totalTimeSeconds * 1000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDurationMs) * 100, 100);
      setProgress(newProgress);

      // Clear the timer when progress reaches 100%
      if (newProgress >= 100) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [totalTimeSeconds]);

  // Update the text based on the progress value.
  const displayText = progress < 100
    ? `Overall Estimated Rendering Time: ${totalTimeSeconds.toFixed(1)} sec`
    : "Hang on a sec, we are preparing the final video";

  return (
    <div style={{ marginBottom: "10px" }}>
      <p style={{ marginBottom: "4px" }}>{displayText}</p>
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
