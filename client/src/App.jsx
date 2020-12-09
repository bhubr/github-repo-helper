import React, { useState, useEffect, useContext } from 'react'
import AppMenu from './components/AppMenu'
import SettingsOrgTeam from './components/SettingsOrgTeam'
import SettingsRepo from './components/SettingsRepo'
import withAuthProvider from './hoc/withAuthProvider'
import AuthContext from './contexts/auth'
import useFatReducer from './hooks/useFatReducer'
import { getTeam, createFullRepo } from './api'
import './App.css'

const Layout = ({ children }) => (
  <div className="App">
    <AppMenu />
    <main className="App-inner">{children}</main>
  </div>
)

const Splash = () => <div className="Splash">Please login!</div>

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
    setStep,
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
    setStep(2)
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

  if (!auth) {
    return (
      <Layout>
        <Splash />
      </Layout>
    )
  }

  switch (state.step) {
    case 1:
      return (
        <Layout>
          <SettingsOrgTeam
            orgName={orgName}
            teamName={teamName}
            handleInput={handleInput}
            handleSubmitTeamName={handleSubmitTeamName}
          />
        </Layout>
      )
    case 2:
      return (
        <Layout>
          <SettingsRepo
            repoPrefix={repoPrefix}
            repoName={repoName}
            template={template}
            teamMembers={teamMembers}
            handleSubmitRepo={handleSubmitRepo}
            methods={methods}
          />
        </Layout>
      )
    default:
      return <h1>Error</h1>
  }
}

export default withAuthProvider(App)
