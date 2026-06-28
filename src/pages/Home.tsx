import React from 'react'
import Search from '../components/Search'
import HowItWorks from '../components/HowItWorks'
import RuntimeStatus from '../components/RuntimeStatus'

export default function Home() {
  return (
    <>
      <div className="card">
        <Search />
      </div>
      <RuntimeStatus />
      <HowItWorks />
    </>
  )
}
