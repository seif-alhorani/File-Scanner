CREATE TABLE IF NOT EXISTS scans (
  id SERIAL PRIMARY KEY,
  input_type TEXT NOT NULL,
  input_value TEXT NOT NULL,
  result_summary TEXT,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  file_name TEXT,
  file_type TEXT
);

INSERT INTO scans (input_type, input_value, result_summary, notes,file_name,file_type)
VALUES
('url', 'https://example.com', '0 malicious', 'Safe site','Test','txt'),
('file', '9e107d9d372bb6826bd81d3542a419d6', '2 malicious', 'Suspicious hash','keylog','exe');