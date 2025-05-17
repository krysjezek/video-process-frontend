// src/utils/api.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://23.88.121.164:8000';
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '012345678'; // Replace with your actual API key

export async function submitJob(formData) {
  const res = await fetch(`${API_BASE_URL}/api/submit-job`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Job submission failed');
  }
  return res.json();
}

export async function getJobStatus(jobId) {
  const res = await fetch(`${API_BASE_URL}/api/job-status/${jobId}`);
  if (!res.ok) {
    throw new Error('Status check failed');
  }
  return res.json();
}

export async function listTemplates() {
  const res = await fetch(`${API_BASE_URL}/api/templates`);
  if (!res.ok) {
    throw new Error('Failed to fetch templates');
  }
  return res.json();
}
