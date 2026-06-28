import React from 'react'

export default function HowItWorks() {
  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h2>How it works</h2>
      <p>This app combines a React frontend with a Tauri Rust backend to provide a desktop search experience.</p>
      <ul>
        <li><strong>Search UI:</strong> The home page sends queries to the backend when you search.</li>
        <li><strong>Tauri command:</strong> The Rust backend exposes a `fetch_url` command that performs HTTP requests and returns raw JSON.</li>
        <li><strong>API integration:</strong> The backend queries the Modpack Index API at <code>https://www.modpackindex.com/api/v1</code>.</li>
        <li><strong>Local cache:</strong> Responses are cached on disk using the app data directory to avoid repeated downloads.</li>
        <li><strong>Routing:</strong> React Router handles navigation from search results to `/mod/:id` detail pages.</li>
      </ul>
      <p>These pieces work together so the desktop app can safely access the network through Rust while keeping the UI responsive and portable.</p>
    </div>
  )
}
