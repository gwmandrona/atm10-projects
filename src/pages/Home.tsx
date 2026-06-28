import React from 'react'
import Search from '../components/Search'
import HowItWorks from '../components/HowItWorks'

export default function Home() {
  return (
    <>
      <div className="card">
        <Search />
      </div>
      <HowItWorks />
    </>
  )
}
