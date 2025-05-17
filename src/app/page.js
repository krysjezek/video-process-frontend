"use client";
import { useState, useEffect } from 'react';
import JobSubmissionForm from '../components/JobSubmissionForm';
import StatusDisplay from '../components/StatusDisplay';
import CombinedRenderProgress from '../components/CombinedRenderProgress';
import { submitJob, getJobStatus, API_BASE_URL } from '../utils/api';

export default function Home() {
  const [mockups, setMockups] = useState({});
  const [jobId, setJobId] = useState('');
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalScenes, setTotalScenes] = useState(3);
  const [scenesData, setScenesData] = useState([]);

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

  useEffect(() => {
    if (jobId) {
      const interval = setInterval(async () => {
        try {
          const data = await getJobStatus(jobId);
          setStatus(`Current status: ${data.status}`);
          
          if (data.status === "SUCCESS") {
            setDownloadUrl(data.download_url);
            setStatus(`Job ${jobId} succeeded.`);
            clearInterval(interval);
            setIsLoading(false);
          } else if (data.status === "FAILURE") {
            setStatus(`Job failed: ${data.error}`);
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
        <JobSubmissionForm 
          mockups={mockups} 
          onSubmit={handleJobSubmit} 
          onScenesChange={setScenesData}
        />
      ) : (
        <p>Loading mockup configurations...</p>
      )}
      <StatusDisplay 
        status={status} 
        downloadUrl={downloadUrl} 
        jobSubmitted={jobId !== ''}
      />
      
      {jobId && scenesData.length > 0 && !downloadUrl && (
        <div style={{ marginTop: "20px" }}>
          <CombinedRenderProgress scenesData={scenesData} />
        </div>
      )}
    </div>
  );
}
