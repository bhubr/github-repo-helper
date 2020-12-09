import React, { useState, useContext } from 'react'
import OAuth2Login from 'react-simple-oauth2-login'
import ErrorAlert from './ErrorAlert'
import AuthContext from '../contexts/auth'
import {
  authorizationUrl,
  clientId,
  redirectUri,
  serverUrl,
} from '../settings-code'
import { setAuthHeader } from '../api'


// eslint-disable-next-line space-before-function-paren
export default function Login() {
  const [error, setError] = useState(null)
  const { auth, setAuth } = useContext(AuthContext)

  // You can test this with a GitHub OAuth2 app (provided test server supports GitHub and Spotify)
  const onSuccess = ({ code }) =>
    fetch(`${serverUrl}/github/token?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        setAuth(data.access_token)
        setAuthHeader(data.access_token)
        sessionStorage.setItem('gh:auth', JSON.stringify(data))
      })

  const clearAuth = () => {
    setAuth(null)
    setAuthHeader('')
    sessionStorage.removeItem('gh:auth')
  }

  return (

      <div>
        {error && <ErrorAlert error={error} />}

        {auth ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img style={{ maxWidth: 24}} src={auth.avatar_url} alt={auth.login} />
            <button type="button" onClick={clearAuth}>
              Logout
            </button>
          </div>
        ) : (
          <OAuth2Login
            authorizationUrl={authorizationUrl}
            clientId={clientId}
            redirectUri={redirectUri}
            responseType="code"
            buttonText="Auth code login"
            scope="admin:org repo"
            onSuccess={onSuccess}
            onFailure={setError}
          />
        )}
      </div>

  )
}
