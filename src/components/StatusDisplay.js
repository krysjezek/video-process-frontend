"use client";
export default function StatusDisplay({ status, downloadUrl }) {
  const proxied = downloadUrl
    ? `/api/download?url=${encodeURIComponent(downloadUrl)}`
    : '';

  return (
    <div style={{ marginBottom: 20 }}>
      {proxied && (
        <>
          <h2 style={{ marginTop: 20 }}>Download final video</h2>
          <a
            href={proxied}
            download               
            style={{
              padding: '10px 20px',
              backgroundColor: '#6f42c1',
              color: '#fff',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Download
          </a>
        </>
      )}
      <p>{status}</p>
    </div>
  );
}
