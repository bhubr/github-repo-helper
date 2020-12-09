import { useEffect, useReducer } from 'react'

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
    orgName: '',
    teamName: '',
    repoPrefix: '',
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

export default useFatReducer
