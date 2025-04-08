"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SceneCard from "./SceneCard";
import FileDropZone from "./FileDropZone";

export default function JobSubmissionForm({ mockups, onSubmit }) {
  const defaultMockup = Object.keys(mockups)[0] || '';
  const [selectedMockup, setSelectedMockup] = useState(defaultMockup);
  const [scenesData, setScenesData] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  // When the selected mockup changes, update scenesData including thumb and max_frame.
  useEffect(() => {
    if (mockups[selectedMockup]) {
      const defaultOrder = mockups[selectedMockup].scenes.map(scene => ({
        scene_id: scene.scene_id,
        in_frame: 0,
        out_frame: scene.default_duration_frames,
        max_frame: scene.default_duration_frames, // Fixed maximum slider value.
        thumb: scene.thumb,  // Include thumbnail property.
      }));
      setScenesData(defaultOrder);
    }
  }, [selectedMockup, mockups]);

  const handleMockupChange = (e) => {
    setSelectedMockup(e.target.value);
  };

  // Callback to update individual scene card data.
  const handleSceneChange = (index, newData) => {
    const updated = Array.from(scenesData);
    updated[index] = newData;
    setScenesData(updated);
  };

  // Handler for drag end to reorder scenesData.
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(scenesData);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setScenesData(reordered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }
    const sceneOrder = JSON.stringify(scenesData, null, 2);
    const formData = new FormData();
    formData.append("mockup_id", selectedMockup);
    formData.append("scene_order", sceneOrder);
    formData.append("file", videoFile);
    onSubmit(formData);
  };

  // Container style for horizontal stacking.
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    overflowX: "auto",
    padding: "10px 0",
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="mockupSelector" style={{ fontWeight: "bold" }}>Select Mockup:</label>
        <select
          id="mockupSelector"
          value={selectedMockup}
          onChange={handleMockupChange}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          {Object.keys(mockups).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      {/* Toggle reordering mode */}
      <div style={{ marginBottom: "10px" }}>
        <button
          type="button"
          onClick={() => setIsReordering(prev => !prev)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {isReordering ? "Done" : "Reorder"}
        </button>
      </div>

      {/* Render scene cards horizontally */}
      {isReordering ? (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="scenes" direction="horizontal" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
            {(provided) => (
              <div style={containerStyle} {...provided.droppableProps} ref={provided.innerRef}>
                {scenesData.map((scene, index) => {
                  const draggableId = `${selectedMockup}-${scene.scene_id}-${index}`;
                  return (
                    <Draggable key={draggableId} draggableId={draggableId} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <SceneCard index={index} scene={scene} onChange={handleSceneChange} />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div style={containerStyle}>
          {scenesData.map((scene, index) => (
            <div key={`${selectedMockup}-${scene.scene_id}-${index}`}>
              <SceneCard index={index} scene={scene} onChange={handleSceneChange} />
            </div>
          ))}
        </div>
      )}

      {/* File drop area */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Video File:</label>
        <FileDropZone onFileAccepted={(file) => setVideoFile(file)} />
        {videoFile && <p>Selected file: {videoFile.name}</p>}
      </div>

      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Submit Job
      </button>
    </form>
  );
}
