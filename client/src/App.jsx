import React, { useState, useEffect, useContext } from 'react'
import AppMenu from './components/AppMenu'
import SettingsOrgTeam from './components/SettingsOrgTeam'
import SettingsRepo from './components/SettingsRepo'
import withAuthProvider from './hoc/withAuthProvider'
import AuthContext from './contexts/auth'
import useFatReducer from './hooks/useFatReducer'
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
  } = state

  useEffect(() => {}, [auth])

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
            auth={auth}
            orgName={orgName}
            teamName={teamName}
            methods={methods}
          />
        </Layout>
      )
    case 2:
      return (
        <Layout>
          <SettingsRepo
            repoAdmin={auth.login}
            state={state}
            methods={methods}
          />
        </Layout>
      )
    default:
      return <h1>Error</h1>
  }
}

export default withAuthProvider(App)
