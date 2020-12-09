import React, { useEffect, useContext } from 'react'
import Login from './components/Login'
import withAuthProvider from './hoc/withAuthProvider'
import AuthContext from './contexts/auth'
import useFatReducer from './hooks/useFatReducer'
import { getTeam, createFullRepo } from './api'

function App() {
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
    console.log(auth)
    const teamData = await getTeam('WildCodeSchool', teamName)
    const isCurrentUserMember = !!teamData.find((u) => u.login === auth.login)
    if (!isCurrentUserMember) {
      teamData.push({ id: auth.id, login: auth.login })
    }
    setTeamMembers(teamData)
  }

  const handleSubmitRepo = async (e) => {
    e.preventDefault()
    const fullRepoName = `${repoPrefix}${repoName}`
    const newRepo = await createFullRepo(
      orgName,
      fullRepoName,
      template,
      repoMembers
    )
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

export default withAuthProvider(App)
