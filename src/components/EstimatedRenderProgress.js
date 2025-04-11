// EstimatedRenderProgress.js
import React, { useState, useEffect } from 'react';

export default function EstimatedRenderProgress({ scenesData, jobFinished }) {
  // Filter out scenes that are not used (i.e. with no frames)
  const validScenes = scenesData.filter(
    scene => (scene.out_frame - scene.in_frame) > 0
  );

  // Track the index of the currently active scene
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  // Track progress (0 to 100) for the active scene
  const [activeProgress, setActiveProgress] = useState(0);

  useEffect(() => {
    // If the job is finished, don't run the timers
    if (jobFinished) return;

    // If there is still an active scene to process...
    if (activeSceneIndex < validScenes.length) {
      const scene = validScenes[activeSceneIndex];
      const frameCount = scene.out_frame - scene.in_frame;
      const totalSeconds = frameCount * 0.5 + 15;
      const totalDurationMs = totalSeconds * 1000;
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalDurationMs) * 100, 100);
        setActiveProgress(progress);
        if (progress >= 100) {
          clearInterval(timer);
          // After a short delay, move to the next scene
          setTimeout(() => {
            setActiveSceneIndex((prev) => prev + 1);
            setActiveProgress(0);
          }, 500);
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, [activeSceneIndex, validScenes, jobFinished]);

  // Hide the entire progress display if the job succeeded
  if (jobFinished) return null;

  return (
    <div>
      {validScenes.map((scene, index) => {
        const frameCount = scene.out_frame - scene.in_frame;
        const totalSeconds = frameCount * 0.5 + 15;

        if (index < activeSceneIndex) {
          // Completed scenes show 100% progress.
          return (
            <div key={index} style={{ marginBottom: '10px' }}>
              <p style={{ marginBottom: '4px' }}>
                Scene {index + 1} – Completed (Estimated: {totalSeconds.toFixed(1)} sec)
              </p>
              <div style={{
                background: '#ddd',
                borderRadius: '4px',
                width: '100%',
                height: '20px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#0070f3',
                  borderRadius: '4px'
                }} />
              </div>
              <p style={{ margin: '4px 0', fontSize: '0.9em' }}>100%</p>
            </div>
          );
        } else if (index === activeSceneIndex) {
          // The active scene shows the running progress.
          return (
            <div key={index} style={{ marginBottom: '10px' }}>
              <p style={{ marginBottom: '4px' }}>
                Scene {index + 1} – {frameCount} frame{frameCount > 1 ? 's' : ''} (Estimated: {totalSeconds.toFixed(1)} sec)
              </p>
              <div style={{
                background: '#ddd',
                borderRadius: '4px',
                width: '100%',
                height: '20px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${activeProgress}%`,
                  height: '100%',
                  background: '#0070f3',
                  borderRadius: '4px',
                  transition: 'width 0.1s ease-out'
                }} />
              </div>
              <p style={{ margin: '4px 0', fontSize: '0.9em' }}>{Math.floor(activeProgress)}%</p>
            </div>
          );
        } else {
          // Scenes that have not started yet
          return (
            <div key={index} style={{ marginBottom: '10px' }}>
              <p style={{ marginBottom: '4px' }}>
                Scene {index + 1} – {frameCount} frame{frameCount > 1 ? 's' : ''} (Estimated: {totalSeconds.toFixed(1)} sec) - Not started
              </p>
              <div style={{
                background: '#ddd',
                borderRadius: '4px',
                width: '100%',
                height: '20px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '0%',
                  height: '100%',
                  background: '#0070f3',
                  borderRadius: '4px'
                }} />
              </div>
              <p style={{ margin: '4px 0', fontSize: '0.9em' }}>0%</p>
            </div>
          );
        }
      })}
    </div>
  );
}
