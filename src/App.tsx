import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import ModPage from './pages/ModPage'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1><Link to="/" style={{color:'inherit',textDecoration:'none'}}>ATM10 Explorer</Link></h1>
        <p>Search mods, items, versions and docs for the ATM10 modpack.</p>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mod/:id" element={<ModPage />} />
        </Routes>
      </main>
    </div>
  )
}
