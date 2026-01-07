import React, { useState } from 'react';
import { sha256 } from 'js-sha256';
import './UpForm.css'; // optional styling

function UploadForm() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleScan() {
    if (file) {
      fileToHash(file, function (hash) {
        sendToBackend({
          hash: hash,
          fileName: file.name,
          fileType: file.type
        });
      });
    } else if (url.trim() !== '') {
      sendToBackend({ url: url.trim() });
    } else {
      alert('Please upload a file or enter a URL.');
    }
  }

  function fileToHash(file, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const contents = new Uint8Array(event.target.result);
      const hash = sha256(contents);
      callback(hash);
    };
    reader.onerror = function () {
      alert('Error reading the file.');
    };
    reader.readAsArrayBuffer(file);
  }

  function sendToBackend(data) {
    setLoading(true);
    setResult(null);

    fetch('http://localhost:5000/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setResult(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.error('Scan error:', error);
        alert('Scan failed. Check console for details.');
        setLoading(false);
      });
  }

  return (
    <div className="upload-form">
      <h3>Scan File or URL</h3>

      <input
        type="file"
        onChange={handleFileChange}
        accept=".exe,.pdf,.zip,.docx,.txt"
      />

      <input
        type="text"
        placeholder="Or enter a URL"
        value={url}
        onChange={function (e) {
          setUrl(e.target.value);
        }}
      />

      <button onClick={handleScan}>Scan Now</button>

      {loading && <p>Scanning...</p>}

      {result && result.error ? (
        <div className="scan-result">
          <p style={{ color: 'red' }}>Error: {result.error.message}</p>
        </div>
      ) : result && result.data && result.data.attributes ? (
        <div className="scan-result">
          <h4>Scan Summary</h4>
          <p><strong>Type:</strong> {result.data.type}</p>
          <p><strong>ID:</strong> {result.data.id}</p>
          <p><strong>Malicious:</strong> {result.data.attributes.last_analysis_stats.malicious}</p>
          <p><strong>Harmless:</strong> {result.data.attributes.last_analysis_stats.harmless}</p>
          <p><strong>Suspicious:</strong> {result.data.attributes.last_analysis_stats.suspicious}</p>
          <p><strong>Undetected:</strong> {result.data.attributes.last_analysis_stats.undetected}</p>
          <p><strong>Known Name:</strong> {result.data.attributes.names ? result.data.attributes.names[0] : 'N/A'}</p>

        </div>
      ) : result && (
        <div className="scan-result">
          <p>No detailed scan result found.</p>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
