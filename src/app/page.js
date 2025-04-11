"use client";
import { useState, useEffect } from 'react';
import JobSubmissionForm from '../components/JobSubmissionForm';
import StatusDisplay from '../components/StatusDisplay';
import { submitJob, getJobStatus, API_BASE_URL } from '../utils/api';

export default function Home() {
  const [mockups, setMockups] = useState({});
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalScenes, setTotalScenes] = useState(3);

  // Load mockup.json from public folder on mount
  useEffect(() => {
    fetch('/mockup.json')
      .then((res) => res.json())
      .then((data) => {
        setMockups(data);
        const keys = Object.keys(data);
        if (keys.length > 0) {
          setTotalScenes(data[keys[0]].scenes.length);
        }
      })
      .catch((error) => {
        console.error("Error loading mockup.json:", error);
      });
  }, []);

  // Poll for job status every 5 seconds
  useEffect(() => {
    if (jobId) {
      const interval = setInterval(async () => {
        try {
          const data = await getJobStatus(jobId);
          setStatus(`Current status: ${data.status}.`);
          if (data.status === "SUCCESS" && data.meta) {
            // Use data.meta instead of data.result
            const filename = data.meta.split('/').pop();
            setDownloadUrl(`${API_BASE_URL}/download/${filename}`);
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
  }, [jobId, totalScenes]);


  const handleJobSubmit = async (formData) => {
    setIsLoading(true);
    // Reset the download URL when a new job is submitted
    setDownloadUrl('');
    setStatus("Submitting job...");
    try {
      const data = await submitJob(formData);
      setJobId(data.job_id);
      setStatus(`Job submitted. Job ID: ${data.job_id}. Video processing is pending, check back in 5 mins (Do not close this page).`);
    } catch (error) {
      console.error(error);
      setStatus("Error submitting job: " + error.message);
      setIsLoading(false);
    }
  };
  

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Video Processing Frontend</h1>
      {Object.keys(mockups).length > 0 ? (
        <JobSubmissionForm mockups={mockups} onSubmit={handleJobSubmit} />
      ) : (
        <p>Loading mockup configurations...</p>
      )}
      <StatusDisplay 
        status={status} 
        downloadUrl={downloadUrl} 
        jobSubmitted={jobId !== ''}
      />
    </div>
  );
}
