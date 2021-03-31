// Note: I should whip myself for using such a lousy name!!
import { useEffect, useReducer } from 'react'
import baseTemplates from '../data/templates.json'

const mapTemplates = arr => arr.map(({ fullname: value, description: label, icon }) => ({ value, label, icon }))

const reducer = (state, action) => {
  switch (action.type) {
    case 'INPUT': {
      const { name, value } = action
      return { ...state, [name]: value }
    }
    case 'TEMPLATE': {
      const { template } = action
      return { ...state, template }
    }
    case 'STORE_MEMBERS': {
      const { members } = action
      return { ...state, teamMembers: members }
    }
    case 'TOGGLE_MEMBER': {
      const { login } = action
      const repoMembers = state.repoMembers.includes(login)
        ? state.repoMembers.filter((l) => l !== login)
        : [...state.repoMembers, login]
      return { ...state, repoMembers }
    }
    case 'SET_STEP': {
      const { step } = action
      return { ...state, step }
    }
    case 'ADD_TEMPLATE': {
      const { label, value } = action
      const newTemplate = { label, value }
      const templates = [...state.templates, newTemplate]
      return { ...state, templates }
    }
    default:
      throw new Error(`Unknown action ${action.type}`)
  }
}

const getStoredState = () => {
  const defaultState = {
    step: 1,
    orgName: '',
    teamName: '',
    repoPrefix: '',
    repoName: '',
    template: null,
    repoMembers: [],
    teamMembers: [],
    templates: mapTemplates(baseTemplates),
  }
  const storedJson = sessionStorage.getItem('gh:projdata')
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
  sessionStorage.setItem('gh:projdata', stateJson)
}

const useFatReducer = () => {
  const initialState = getStoredState()
  const [state, dispatch] = useReducer(reducer, initialState)

  const dispatchAndStore = async(...args) => {
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

  const handleChangeTemplate = (selectValue) => {
    if (selectValue === null) {
      dispatchAndStore({
        type: 'TEMPLATE',
        template: null,
      })
      return
    }
    const { label, value } = selectValue
    if (label === value && !state.templates.find(t => t.value === value)) {
      dispatchAndStore({
        type: 'ADD_TEMPLATE',
        label,
        value,
      })
    }
    dispatchAndStore({
      type: 'TEMPLATE',
      template: selectValue,
    })
  }

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

  const setStep = (step) => dispatchAndStore({ type: 'SET_STEP', step })

  const isRepoMember = (login) => state?.repoMembers?.includes(login)

  return [
    state,
    {
      handleInput,
      handleChangeTemplate,
      setTeamMembers,
      isRepoMember,
      toggleRepoMember,
      setStep,
    },
  ]
}

export default useFatReducer
