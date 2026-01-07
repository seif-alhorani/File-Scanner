const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const db = require("./db");

db.query("SELECT NOW()")
  .then((res) => console.log("Database connected:", res.rows[0]))
  .catch((err) => console.error("DB connection failed:", err));

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Main scan route
app.post('/scan', async function (req, res) {
  const { hash, url, fileName, fileType } = req.body;

  try {
    let response;
    let inputType;
    let inputValue;

    if (hash) {
      inputType = 'file';
      inputValue = hash;

      // Query VirusTotal with file hash
      response = await axios.get(`https://www.virustotal.com/api/v3/files/${hash}`, {
        headers: { 'x-apikey': process.env.VT_API_KEY }
      });

    } else if (url) {
      inputType = 'url';
      inputValue = url;

      // Encode URL and query VirusTotal
      const encoded = Buffer.from(url).toString('base64').replace(/=+$/, '');
      response = await axios.get(`https://www.virustotal.com/api/v3/urls/${encoded}`, {
        headers: { 'x-apikey': process.env.VT_API_KEY }
      });

    } else {
      return res.status(400).json({ error: 'Missing hash or URL' });
    }

    // Get analysis stats
    const stats = response.data?.data?.attributes?.last_analysis_stats;
    const summary = stats
      ? `${stats.malicious} malicious`
      : 'No summary available';

    // Insert into PostgreSQL (for both files and URLs)
    await db.query(
      'INSERT INTO scans (input_type, input_value, result_summary, file_name, file_type) VALUES ($1, $2, $3, $4, $5)',
      [inputType, inputValue, summary, fileName || null, fileType || null]
    );

    // Return scan result to frontend
    return res.json(response.data);

  } catch (error) {
    console.error('Scan error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Scan failed' });
  }
});


app.get("/History", async function (req, res) {
  try {
    const result = await db.query(
      "SELECT * FROM scans ORDER BY scanned_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});
app.delete("/scan/:id", async function (req, res) {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM scans WHERE id = $1", [id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});
app.put("/scan/:id", async function (req, res) {
  const id = req.params.id;
  const { notes } = req.body;
  try {
    await db.query("UPDATE scans SET notes = $1 WHERE id = $2", [notes, id]);
    res.json({ message: "Notes updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

app.listen(PORT, function () {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
