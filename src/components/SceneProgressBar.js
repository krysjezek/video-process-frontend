// SceneProgressBar.js
import React, { useState, useEffect } from 'react';

export default function SceneProgressBar({ scene, sceneIndex }) {
  // Calculate the number of frames for the scene.
  const frameCount = scene.out_frame - scene.in_frame;

  // If frameCount is 0 or negative, return null so nothing renders.
  if (frameCount <= 0) return null;

  // Compute the total duration in seconds.
  const totalSeconds = frameCount * 0.5 + 15;
  // Convert to milliseconds for the timer.
  const totalDurationMs = totalSeconds * 1000;

  // State to keep track of the progress percentage.
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Calculate progress as a percentage (maximum of 100%)
      const newProgress = Math.min((elapsed / totalDurationMs) * 100, 100);
      setProgress(newProgress);

      // If progress reaches 100%, clear the interval.
      if (newProgress === 100) {
        clearInterval(timer);
      }
    }, 100); // Update progress every 100ms for a smooth transition

    // Cleanup interval on component unmount or if totalDurationMs changes.
    return () => clearInterval(timer);
  }, [totalDurationMs]);

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
