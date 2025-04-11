"use client";
import React, { useState, useEffect } from "react";

export default function SceneProgressBar({ scene, sceneIndex, isActive, isFinished, onComplete }) {
  // Calculate the number of frames for the scene.
  const frameCount = scene.out_frame - scene.in_frame;
  if (frameCount <= 0) return null;

  // Compute total render time in seconds and convert to ms.
  const totalSeconds = frameCount * 0.5 + 15;
  const totalDurationMs = totalSeconds * 1000;

  // Progress state: if finished, start at 100, otherwise 0.
  const [progress, setProgress] = useState(isFinished ? 100 : 0);

  useEffect(() => {
    // Only run the timer if this progress bar is active.
    if (!isActive) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDurationMs) * 100, 100);
      setProgress(newProgress);

      // If progress is complete, stop timer and trigger onComplete.
      if (newProgress >= 100) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, totalDurationMs, onComplete]);

  // For non-active progress bars:
  // - If finished: display 100%.
  // - If not started: display 0%.
  let displayProgress = progress;
  if (!isActive) {
    displayProgress = isFinished ? 100 : 0;
  }

  return (
    <div style={{ marginBottom: "10px" }}>
      <p style={{ marginBottom: "4px" }}>
        Scene {sceneIndex + 1} – {frameCount} frame{frameCount > 1 ? "s" : ""} (Estimated: {totalSeconds.toFixed(1)} sec)
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
            width: `${displayProgress}%`,
            height: "100%",
            background: "#0070f3",
            borderRadius: "4px",
            transition: "width 0.1s ease-out"
          }}
        />
      </div>
      <p style={{ margin: "4px 0", fontSize: "0.9em" }}>{Math.floor(displayProgress)}%</p>
    </div>
  );
}
