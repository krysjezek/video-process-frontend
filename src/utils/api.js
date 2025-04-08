// src/utils/api.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://23.88.121.164:8000';

export async function submitJob(formData) {
  const res = await fetch(`${API_BASE_URL}/submit-job`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Job submission failed');
  }
  return res.json();
}

export async function getJobStatus(jobId) {
  const res = await fetch(`${API_BASE_URL}/job-status/${jobId}`);
  if (!res.ok) {
    throw new Error('Status check failed');
  }
  return res.json();
}
