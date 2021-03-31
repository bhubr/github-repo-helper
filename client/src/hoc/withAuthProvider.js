import React, { useState } from 'react'
import AuthContext from '../contexts/auth'
const withAuthProvider = (Component) => {
  const WrappedComponent = (props) => {
    const storedAuth = sessionStorage.getItem('gh:auth')
    const initialAuth = storedAuth ? JSON.parse(storedAuth) : null
    const [auth, setAuth] = useState(initialAuth)
    return (
      <AuthContext.Provider value={{ auth, setAuth }}>
        <Component {...props} />
      </AuthContext.Provider>
    )
  }
  WrappedComponent.displayName = 'withAuthProvider'
  return WrappedComponent
}

export default withAuthProvider
