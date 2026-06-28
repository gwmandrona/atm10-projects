import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ModDetail from '../components/ModDetail'

export default function ModPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  if (!id) return <div>No mod id provided</div>

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{marginBottom:8}}>Back</button>
      <div className="card">
        <ModDetail id={decodeURIComponent(id)} />
      </div>
    </div>
  )
}
