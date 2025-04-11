import React, { useState, useEffect } from 'react';

export default function EstimatedRenderProgress({ scenesData, jobFinished }) {
  // Filter out scenes that have a positive frame count.
  const validScenes = scenesData.filter(scene => (scene.out_frame - scene.in_frame) > 0);

  // Track which scene is currently active (starting at 0).
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  // Track the progress for the currently active scene.
  const [activeProgress, setActiveProgress] = useState(0);

  useEffect(() => {
    // When the job finished, do nothing.
    if (jobFinished) return;
    // Stop if we've processed all valid scenes.
    if (activeSceneIndex >= validScenes.length) return;

    const scene = validScenes[activeSceneIndex];
    const frameCount = scene.out_frame - scene.in_frame;
    // Total time (in seconds) for this scene: (frames * 0.5 sec) + 15 sec.
    const totalSeconds = frameCount * 0.5 + 15;
    const totalDurationMs = totalSeconds * 1000;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDurationMs) * 100, 100);
      setActiveProgress(progress);
      if (progress === 100) {
        clearInterval(timer);
        // Short delay before starting next scene.
        setTimeout(() => {
          setActiveSceneIndex(prev => prev + 1);
          setActiveProgress(0);
        }, 500);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [activeSceneIndex, validScenes, jobFinished]);

  // Hide progress bars if the job is finished
  if (jobFinished) return null;

  return (
    <div>
      {validScenes.map((scene, index) => {
        const frameCount = scene.out_frame - scene.in_frame;
        const totalSeconds = frameCount * 0.5 + 15;

        // Determine what percentage to show:
        // - Completed scenes always show 100%.
        // - The active scene shows 'activeProgress'.
        // - Future scenes show 0%.
        let progressVal = 0;
        if (index < activeSceneIndex) {
          progressVal = 100;
        } else if (index === activeSceneIndex) {
          progressVal = activeProgress;
        }

        return (
          <div key={index} style={{ marginBottom: '10px' }}>
            <p style={{ marginBottom: '4px' }}>
              Scene {index + 1} – {frameCount} frame{frameCount > 1 ? 's' : ''} (Estimated: {totalSeconds.toFixed(1)} sec)
            </p>
            <div
              style={{
                background: '#ddd',
                borderRadius: '4px',
                width: '100%',
                height: '20px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progressVal}%`,
                  height: '100%',
                  background: '#0070f3',
                  borderRadius: '4px',
                  transition: 'width 0.1s ease-out'
                }}
              />
            </div>
            <p style={{ margin: '4px 0', fontSize: '0.9em' }}>{Math.floor(progressVal)}%</p>
          </div>
        );
      })}
    </div>
  );
}
