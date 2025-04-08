"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDropZone({ onFileAccepted }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Accept the first file from the drop event.
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "1px dashed rgba(255,255,255,0.1)",
        backgroundColor: "transparent",
        borderRadius: "12px",
        padding: "60px",
        width: "100%",
        textAlign: "center",
        cursor: "pointer",
        color: "rgba(255,255,255,0.5)",
        backgroundColor: isDragActive ? "rgba(255,255,255,0.075)" : "rgba(255,255,255,0.02)",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag 'n' drop a video file here, or click to select one</p>
      )}
    </div>
  );
}
