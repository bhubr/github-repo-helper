import React, { useState, useContext } from 'react'
import OAuth2Login from 'react-simple-oauth2-login'
import axios from 'axios'
import ErrorAlert from './ErrorAlert'
import AuthContext from '../contexts/auth'
import { authorizationUrl, clientId, redirectUri, serverUrl } from '../settings'
import { setAuthHeader } from '../api'

export default function AppMenu() {
  const [error, setError] = useState(null)
  const { auth, setAuth } = useContext(AuthContext)

  const onSuccess = ({ code }) =>
    axios
      .get(`${serverUrl}/github/token?code=${code}`)
      .then((res) => res.data)
      .then((data) => {
        setAuth(data)
        setAuthHeader(data.access_token)
        sessionStorage.setItem('gh:auth', JSON.stringify(data))
      })

  const clearAuth = () => {
    setAuth(null)
    setAuthHeader('')
    sessionStorage.removeItem('gh:auth')
  }

  return (
    <nav className="AppMenu home-menu pure-menu pure-menu-horizontal">
      <span className="pure-menu-heading">RepoHelper</span>
      {error && <ErrorAlert error={error} />}

      <ul className="pure-menu-list">
        {auth ? (
          <li className="pure-menu-item">
            <span className="AppMenu-signedIn">
              <img src={auth.avatar_url} alt={auth.login} />
              <button className="pure-button" type="button" onClick={clearAuth}>
                Logout
              </button>
            </span>
          </li>
        ) : (
          <li className="pure-menu-item">
            <OAuth2Login
              className="pure-button"
              authorizationUrl={authorizationUrl}
              clientId={clientId}
              redirectUri={redirectUri}
              responseType="code"
              buttonText="GitHub Login"
              scope="admin:org repo"
              onSuccess={onSuccess}
              onFailure={setError}
            />
          </li>
        )}
      </ul>
    </nav>
  )
}
