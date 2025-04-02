"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [mockupId, setMockupId] = useState('mockup1');
  const [sceneOrder, setSceneOrder] = useState(
    `[{"scene_id": "scene1", "in_frame": 0, "out_frame": 88}, {"scene_id": "scene2", "in_frame": 0, "out_frame": 88}, {"scene_id": "scene3", "in_frame": 0, "out_frame": 88}]`
  );
  const [videoFile, setVideoFile] = useState(null);
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  // Total number of scenes (for now, it's fixed to 3)
  const totalScenes = 3;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://23.88.121.164:8000';

  // Handler for job submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Submitting job...");

    if (!videoFile) {
      alert("Please select a video file.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("mockup_id", mockupId);
    formData.append("scene_order", sceneOrder);
    formData.append("file", videoFile);

    try {
      const res = await fetch(`${API_BASE_URL}/submit-job`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Job submission failed");
      const data = await res.json();
      setJobId(data.job_id);
      setStatus(`Job submitted. Job ID: ${data.job_id}. Video processing is pending, check back in 5 mins (Do not close this page).`);
    } catch (error) {
      console.error(error);
      setStatus("Error submitting job: " + error.message);
      setIsLoading(false);
    }
  };

  // Automatically poll for job status every 5 seconds
  useEffect(() => {
    if (jobId) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/job-status/${jobId}`);
          if (!res.ok) throw new Error("Status check failed");
          const data = await res.json();

          // If meta is provided with progress info, update overall progress.
          if (data.status === "PROGRESS" && data.meta && typeof data.meta === "object") {
            // Assuming meta includes { current_scene: "sceneX", progress: <percent> }
            const sceneMatch = data.meta.current_scene.match(/scene(\d+)/);
            let currentSceneIndex = 1;
            if (sceneMatch && sceneMatch[1]) {
              currentSceneIndex = parseInt(sceneMatch[1], 10);
            }
            const sceneProgress = data.meta.progress;
            const overall = ((currentSceneIndex - 1) * 100 / totalScenes) + (sceneProgress * (100 / totalScenes) / 100);
            setOverallProgress(Math.round(overall));
          }
          
          setStatus(`Current status: ${data.status}.`);
          
          if (data.status === "SUCCESS") {
            // Here, we assume that data.meta is a string containing the final file path.
            if (typeof data.meta === "string") {
              const filename = data.meta.split('/').pop();
              setDownloadUrl(`${API_BASE_URL}/download/${filename}`);
            }
            setStatus(`Job ${jobId} succeeded.`);
            clearInterval(interval);
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
          setStatus("Error checking job status: " + error.message);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [jobId, API_BASE_URL, totalScenes]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Video Processing Frontend</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="mockupId" style={{ fontWeight: "bold" }}>Mockup Selector:</label>
          <select
            id="mockupId"
            value={mockupId}
            onChange={(e) => setMockupId(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="mockup1">mockup1</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="sceneOrder" style={{ fontWeight: "bold" }}>Scene Order (JSON):</label>
          <br />
          <textarea
            id="sceneOrder"
            value={sceneOrder}
            onChange={(e) => setSceneOrder(e.target.value)}
            rows="6"
            cols="60"
            placeholder={`Example:
[
  {"scene_id": "scene1", "in_frame": 0, "out_frame": 88},
  {"scene_id": "scene2", "in_frame": 0, "out_frame": 88},
  {"scene_id": "scene3", "in_frame": 0, "out_frame": 88}
]`}
            style={{
              border: "2px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
              fontFamily: "monospace"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="videoFile" style={{ fontWeight: "bold" }}>Video File:</label>
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            style={{ marginLeft: "10px" }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: isLoading ? "#aaa" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Submitting..." : "Submit Job"}
        </button>
      </form>

      {jobId && (
        <div style={{ marginBottom: "20px" }}>
          <p>Overall progress: {overallProgress}%</p>
          <div style={{ width: "100%", backgroundColor: "#eee", borderRadius: "4px" }}>
            <div
              style={{
                width: `${overallProgress}%`,
                backgroundColor: "#0070f3",
                height: "20px",
                borderRadius: "4px"
              }}
            ></div>
          </div>
        </div>
      )}

      <p>{status}</p>

      {downloadUrl && (
        <div>
          <h2>Download Final Video</h2>
          <a
            href={downloadUrl}
            download
            style={{
              padding: "10px 20px",
              backgroundColor: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              textDecoration: "none"
            }}
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}
