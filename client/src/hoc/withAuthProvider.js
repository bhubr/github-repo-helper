import { useState } from 'react'
import AuthContext from '../contexts/auth'
const withAuthProvider = (Component) => {
  return (props) => {
    const storedAuth = sessionStorage.getItem('gh:auth')
    const initialAuth = storedAuth ? JSON.parse(storedAuth) : null
    const [auth, setAuth] = useState(initialAuth)
    return (
      <AuthContext.Provider value={{ auth, setAuth }}>
        <Component {...props} />
      </AuthContext.Provider>
    )
  }
}

export default withAuthProvider
