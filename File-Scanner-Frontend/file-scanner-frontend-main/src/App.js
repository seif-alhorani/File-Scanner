import React, { useState } from 'react'

import UploadForm from './Components/Upload/UploadForm';
import HistoryPage from './Components/History/History';

import './App.css';

function App() {
  const [view, setView] = useState('scanner');

  return (
    <div className="container">
      <h1>File Scanner</h1>
      <button onClick={() => setView('scanner')}>Scan</button>
      <button onClick={() => setView('history')}>History</button>
      <hr />
      {view === 'scanner' ? <UploadForm /> : <HistoryPage />}
    </div>
  );
}

export default App;
