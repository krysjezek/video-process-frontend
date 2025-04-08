"use client";
export default function StatusDisplay({ status, downloadUrl, jobSubmitted }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      {status && <p>{status}</p>}
      {/* Show download button only if downloadUrl exists */}
      {downloadUrl && (
        <div style={{ marginTop: "20px" }}>
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
