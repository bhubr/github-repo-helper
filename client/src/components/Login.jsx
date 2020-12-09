import React, { useState } from 'react'
import OAuth2Login from 'react-simple-oauth2-login'
import ErrorAlert from './ErrorAlert'
import AuthContext from './contexts/auth'
import {
  authorizationUrl,
  clientId,
  redirectUri,
  serverUrl,
} from './settings-code'
import { setAuthHeader } from './api'

// eslint-disable-next-line space-before-function-paren
export default function Login() {
  const storedToken = sessionStorage.getItem('gh:token') || ''
  const [error, setError] = useState(null)
  const [auth, setAuth] = useState(storedToken)

  // You can test this with a GitHub OAuth2 app (provided test server supports GitHub and Spotify)
  const onSuccess = ({ code }) =>
    fetch(`${serverUrl}/github/token?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        setAuth(data.access_token)
        setAuthHeader(data.access_token)
        sessionStorage.setItem('gh:token', data.access_token)
      })

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <div>
        {error && <ErrorAlert error={error} />}
        <OAuth2Login
          authorizationUrl={authorizationUrl}
          clientId={clientId}
          redirectUri={redirectUri}
          responseType="code"
          buttonText="Auth code login"
          scope="admin:org"
          onSuccess={onSuccess}
          onFailure={setError}
        />
        {auth && <span>Access token: {auth}</span>}
      </div>
    </AuthContext.Provider>
  )
}
