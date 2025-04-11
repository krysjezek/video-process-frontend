"use client";
import React, { useState, useEffect } from "react";
import SceneProgressBar from "./SceneProgressBar";

export default function EstimatedRenderProgress({ scenesData }) {
  // Filter out scenes that have 0 or negative frames.
  const validScenes = scenesData.filter(scene => (scene.out_frame - scene.in_frame) > 0);
  // activeSceneIndex tracks which scene's progress should run.
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Reset activeSceneIndex if the validScenes list changes.
  useEffect(() => {
    setActiveSceneIndex(0);
  }, [validScenes]);

  // Callback for when the current active progress bar completes.
  const handleSceneComplete = () => {
    // Move on to next scene if available.
    setActiveSceneIndex((prevIndex) => Math.min(prevIndex + 1, validScenes.length));
  };

  return (
    <div>
      {validScenes.map((scene, index) => {
        // Determine if this scene should be active or finished.
        const isActive = index === activeSceneIndex;
        const isFinished = index < activeSceneIndex;
        return (
          <SceneProgressBar
            key={index}
            scene={scene}
            sceneIndex={index}
            isActive={isActive}
            isFinished={isFinished}
            onComplete={isActive ? handleSceneComplete : undefined}
          />
        );
      })}
    </div>
  );
}
