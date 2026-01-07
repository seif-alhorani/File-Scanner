# File Scanner

Full stack file scanning app with a React frontend and a Node/Express backend. The frontend sends file hashes or URLs to the backend, which queries the VirusTotal API and stores scan history in PostgreSQL.

## Project structure
- `File-Scanner-Backend/File-scanner-backend-main` - Node/Express API
- `File-Scanner-Frontend/file-scanner-frontend-main` - React UI

## Prerequisites
- Node.js (v22 recommended)
- npm
- PostgreSQL
- VirusTotal API key

## Backend setup
1) Open `File-Scanner-Backend/File-scanner-backend-main`.
2) Copy `.env.example` to `.env` and set:
   - `PORT=5000`
   - `VT_API_KEY=your_key`
   - `DATABASE_URL=postgresql://username:password@localhost:5432/filescanner`
3) Install dependencies and start the server:

```bash
npm install
node server.js
```

## Frontend setup
1) Open `File-Scanner-Frontend/file-scanner-frontend-main`.
2) Install dependencies and start the app:

```bash
npm install
npm start
```

The frontend calls the backend at `http://localhost:5000` (see `src/Components/Upload/UploadForm.js` and `src/Components/History/History.js`).

## API endpoints (backend)
- `POST /scan` - scan a file hash or URL
- `GET /history` - list scan history
- `PUT /scan/:id` - update notes
- `DELETE /scan/:id` - delete a scan record
