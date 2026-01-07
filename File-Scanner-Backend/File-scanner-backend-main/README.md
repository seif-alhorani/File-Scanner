# File Scanner Back end
this the Back end of the file scanner app which built in using Node.js and Express.js

- Receiving file hashes or URLs
- Querying VirusTotal API
- Storing scan results in the database
- Returning history, handling notes, and deleting records

# feateures 
- integration with VirusTotal
- PostgreSQL for storage
- Support CRUD operation

# Setup 
- create a .env file inside put the port 5000 , VT_API_KEY = your API key and the DATABASE_URL = postgresql://username:password@localhost:5432/filescanner
- cd file-scanner-backend
- run npm install
- run node server.js

# API End point 

POST /scan
{
  "hash": "abc123...",
  "fileName": "file.exe",
  "fileType": "application/x-msdownload"
}

if URL
{
  "url": "https://example.com"
}

GET /history
[
  {
    "id": 1,
    "input_type": "file",
    "input_value": "abc123...",
    "result_summary": "1 malicious",
    "notes": "Test file",
    "file_name": "file.exe",
    "file_type": "application/x-msdownload",
    "scanned_at": "2024-06-10T12:00:00Z"
  }
]

PUT /scan/:id
{ "notes": "trusted file" }


DELETE /scan/:id