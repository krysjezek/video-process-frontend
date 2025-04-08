"use client";
import { useState, useEffect } from "react";
import { Range } from "react-range";

export default function SceneCard({ scene, index, onChange }) {
  const [inFrame, setInFrame] = useState(scene.in_frame);
  const [outFrame, setOutFrame] = useState(scene.out_frame);
  // Use the passed max_frame as a fixed maximum for the slider.
  const [maxFrame] = useState(() => Number(scene.max_frame) || 300);

  useEffect(() => {
    setInFrame(scene.in_frame);
    setOutFrame(scene.out_frame);
  }, [scene.in_frame, scene.out_frame]);

  const handleSliderChange = (values) => {
    const [start, end] = values;
    setInFrame(start);
    setOutFrame(end);
    onChange(index, { ...scene, in_frame: start, out_frame: end });
  };

  // Prevent slider events from propagating.
  const stopPropagation = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // Build thumbnail path from scene.thumb (prepend "/" so it's served from public)
  const thumbPath = scene.thumb ? `/${scene.thumb}` : null;

  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.02)",
        borderRadius: "12px",
        padding: "10px",
        width: "300px",
        position: "relative",
        marginBottom: "10px",
      }}
    >
      {/* Thumbnail image or placeholder */}
      {thumbPath ? (
        <img
          src={thumbPath}
          alt={`Thumbnail for ${scene.scene_id}`}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "4px",
            marginBottom: "8px"
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: "#ddd",
            borderRadius: "4px",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.5)"
          }}
        >
          Image
        </div>
      )}

      {/* Scene title */}
      <h3 style={{ margin: "12px 0", fontWeight: "bold" }}>Scene {index + 1}</h3>

      {/* Frame range label */}
      <p style={{ marginBottom: "10px", fontSize: "0.9em", color: "rgba(255,255,255,0.5)" }}>Frame range:</p>

      {/* Slider container */}
      <div onMouseDown={stopPropagation} onTouchStart={stopPropagation}>
        <Range
          step={1}
          min={0}
          max={maxFrame}
          values={[inFrame, outFrame]}
          onChange={handleSliderChange}
          allowOverlap={false}
          renderTrack={({ props, children }) => {
            // Calculate percentage positions for the selected track
            const leftPercent = (inFrame / maxFrame) * 100;
            const widthPercent = ((outFrame - inFrame) / maxFrame) * 100;
            return (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "6px",
                  background: "rgba(255,255,255,0.075)",
                  borderRadius: "3px",
                  margin: "10px 0",
                  position: "relative",
                }}
              >
                {/* Selected track */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    height: "100%",
                    backgroundColor: "#0070f3",
                  }}
                />
                {children}
              </div>
            );
          }}
          renderThumb={({ props, isDragged }, thumbIndex) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={key || `thumb-${thumbIndex}`}
                {...restProps}
                style={{
                  ...restProps.style,
                  height: "12px",
                  width: "12px",
                  backgroundColor: "#0070f3",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            );
          }}
        />
      </div>

      {/* Display numeric in/out frames */}
      <div style={{ marginTop: "8px", fontSize: "0.9em", color: "rgba(255,255,255,0.5)" }}>
        {inFrame} - {outFrame}
      </div>
    </div>
  );
}
