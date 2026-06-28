import React from 'react'
import Search from '../components/Search'
import HomeInfo from '../components/HomeInfo'

export default function Home() {
  return (
    <>
      <div className="card">
        <Search />
      </div>
      <HomeInfo />
    </>
  )
}
