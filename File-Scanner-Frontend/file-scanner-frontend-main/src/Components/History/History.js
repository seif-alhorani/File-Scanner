import React, { useEffect, useState } from "react";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/History")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.error("Expected an array, got:", data);
          setHistory([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setHistory([]);
      });
  }, []);

  function deleteScan(id) {
    fetch(`http://localhost:5000/scan/${id}`, { method: "DELETE" })
      .then(() => setHistory(history.filter((scan) => scan.id !== id)))
      .catch((err) => console.error(err));
  }

  function updateNote(id) {
    fetch(`http://localhost:5000/scan/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: newNote }),
    })
      .then(() => {
        const updated = history.map((scan) =>
          scan.id === id ? { ...scan, notes: newNote } : scan
        );
        setHistory(updated);
        setEditingId(null);
        setNewNote("");
      })
      .catch((err) => console.error(err));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Scan History</h2>
      {history.map((scan) => (
        <div
          key={scan.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 10,
            padding: 10,
            borderRadius: 5,
          }}
        >
          <p>
            <strong>Type:</strong> {scan.input_type}
          </p>
          <p>
            <strong>Value:</strong> {scan.input_value}
          </p>
          <p>
            <strong>Result:</strong> {scan.result_summary}
          </p>
          <p>
            <strong>Date:</strong> {new Date(scan.scanned_at).toLocaleString()}
          </p>
          {scan.file_name && <p><strong>File Name:</strong> {scan.file_name}</p>}
          {scan.file_type && <p><strong>File Type:</strong> {scan.file_type}</p>}
          {editingId === scan.id ? (
            <>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                style={{ width: "100%" }}
              />
              <button onClick={() => updateNote(scan.id)}>Save Note</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p>
                <strong>Note:</strong> {scan.notes || "—"}
              </p>
              <button
                onClick={() => {
                  setEditingId(scan.id);
                  setNewNote(scan.notes || "");
                }}
              >
                Edit Note
              </button>
              <button onClick={() => deleteScan(scan.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default HistoryPage;
