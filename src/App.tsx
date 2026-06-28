import React from 'react'
import Search from './components/Search'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>ATM10 Explorer</h1>
        <p>Search mods, items, versions and docs for the ATM10 modpack.</p>
      </header>
      <main>
        <Search />
      </main>
    </div>
  )
}
