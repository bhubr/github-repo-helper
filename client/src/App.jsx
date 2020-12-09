import React, { useState, useEffect, useContext, useReducer } from 'react'
import Login from './components/Login'
import AuthContext from './contexts/auth'
import { getTeam, createFullRepo, getCommits } from './api'
// import './App.css'

const onFailure = (response) => console.error(response)

const reducer = (state, action) => {
  switch (action.type) {
    case 'INPUT':
      const { name, value } = action
      return { ...state, [name]: value }
    case 'STORE_MEMBERS':
      const { members } = action
      return { ...state, teamMembers: members }
    case 'TOGGLE_MEMBER':
      const { login } = action
      const repoMembers = state.repoMembers.includes(login)
        ? state.repoMembers.filter((l) => l !== login)
        : [...state.repoMembers, login]
      return { ...state, repoMembers }
    default:
      throw new Error()
  }
}

const getStoredState = () => {
  const defaultState = {
    orgName: 'a',
    teamName: 'b',
    repoPrefix: 'c',
    repoName: '',
    template: '',
    repoMembers: [],
    teamMembers: [],
  }
  const storedJson = sessionStorage.getItem('wcs:projdata')
  if (!storedJson) return defaultState
  try {
    const parsedState = JSON.parse(storedJson)
    return { ...defaultState, ...parsedState }
  } catch (err) {
    return defaultState
  }
}

const setStoredState = (state) => {
  const stateJson = JSON.stringify(state)
  sessionStorage.setItem('wcs:projdata', stateJson)
}

const useFatReducer = () => {
  const initialState = getStoredState()
  const [state, dispatch] = useReducer(reducer, initialState)

  const dispatchAndStore = async (...args) => {
    await dispatch(...args)
  }

  useEffect(() => {
    setStoredState(state)
  }, [state])

  const handleInput = ({ target: { name, value } }) =>
    dispatchAndStore({
      type: 'INPUT',
      name,
      value,
    })

  const setTeamMembers = (members) =>
    dispatchAndStore({
      type: 'STORE_MEMBERS',
      members,
    })

  const toggleRepoMember = (login) =>
    dispatchAndStore({
      type: 'TOGGLE_MEMBER',
      login,
    })

  const isRepoMember = (login) => state?.repoMembers?.includes(login)

  return [
    state,
    {
      handleInput,
      setTeamMembers,
      isRepoMember,
      toggleRepoMember,
    },
  ]
}

export default function App() {
  // const [teamName, setTeamName] = useState('')
  // const [teamData, setTeamData] = useState([])
  const [state, methods] = useFatReducer()
  const { auth } = useContext(AuthContext)

  const {
    orgName,
    teamName,
    repoPrefix,
    repoName,
    template,
    teamMembers,
    repoMembers,
  } = state
  const {
    handleInput,
    setTeamMembers,
    toggleRepoMember,
    isRepoMember,
  } = methods

  useEffect(() => {}, [auth])

  const handleSubmitTeamName = async (e) => {
    e.preventDefault()
    const teamData = await getTeam('WildCodeSchool', teamName)
    setTeamMembers(teamData)
  }

  const handleSubmitRepo = async (e) => {
    e.preventDefault()
    const fullRepoName = `${repoPrefix}${repoName}`
    const newRepo = await createFullRepo(orgName, fullRepoName, template, repoMembers)
    // await getCommits(template)
  }

  return (
    <div className="App">
      <Login />
      <div>
        <form onSubmit={handleSubmitTeamName}>
          <label>
            Org:
            <input
              name="orgName"
              value={orgName}
              onChange={handleInput}
              placeholder="YourOrg"
            />
          </label>
          <label>
            Team:
            <input
              name="teamName"
              value={teamName}
              onChange={handleInput}
              placeholder="this-awesome-team"
            />
          </label>
          <label>
            Repo name prefix:
            <input
              name="repoPrefix"
              value={repoPrefix}
              onChange={handleInput}
              placeholder="common-repo-name-"
            />
          </label>
          <button>Submit</button>
        </form>
        <form onSubmit={handleSubmitRepo}>
          <label>
            Repo name:
            <input
              name="repoName"
              value={repoName}
              onChange={handleInput}
              placeholder="name"
            />
          </label>
          <label>
            Repo template:
            <input
              name="template"
              value={template}
              onChange={handleInput}
              placeholder="login/repo"
            />
          </label>
          <button>Submit</button>
        </form>
        {teamMembers.map((member) => (
          <div key={member.id}>
            <label>
              <input
                htmlFor={`cb-${member.login}`}
                type="checkbox"
                checked={isRepoMember(member.login)}
                onChange={() => toggleRepoMember(member.login)}
              />{' '}
              {member.login}
            </label>
          </div>
        ))}
        <label>
          <input
            htmlFor={`cb-WWWilder`}
            type="checkbox"
            checked={isRepoMember('WWWilder')}
            onChange={() => toggleRepoMember('WWWilder')}
          />{' '}
          WWWilder
        </label>
      </div>
    </div>
  )
}
