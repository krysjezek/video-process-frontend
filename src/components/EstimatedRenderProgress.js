// EstimatedRenderProgress.js
import React from 'react';
import SceneProgressBar from './SceneProgressBar';

export default function EstimatedRenderProgress({ scenesData }) {
  return (
    <div>
      {scenesData.map((scene, index) => {
        // Render a progress bar only if the scene has a positive frame count.
        if (scene.out_frame - scene.in_frame > 0) {
          return <SceneProgressBar key={index} scene={scene} sceneIndex={index} />;
        }
        return null;
      })}
    </div>
  );
}
