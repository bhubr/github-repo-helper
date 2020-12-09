import React, { useState, useEffect, useContext } from 'react'
import Login from './components/Login'
import AuthContext from './contexts/auth'
import { getTeam } from './api'

const onFailure = (response) => console.error(response)

export default function App() {
  const [teamName, setTeamName] = useState('')
  const [teamData, setTeamData] = useState([])
  const { auth } = useContext(AuthContext)

  useEffect(() => {}, [auth])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const teamData = await getTeam('WildCodeSchool', teamName)
    setTeamData(teamData)
  }
  return (
    <div className="App">
      <Login />
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Team:
            <input
              name="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button>Submit</button>
          </label>
        </form>
        {teamData.map(member => (
          <div key={member.id}>
            {member.login}
          </div>
        ))}
      </div>
    </div>
  )
}
