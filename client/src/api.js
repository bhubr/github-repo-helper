import axios from 'axios'

const storedToken = sessionStorage.getItem('gh:token')

const github = axios.create({
  baseURL: 'https://api.github.com'
})

if (storedToken) {
  github.defaults.headers.authorization = `Bearer ${storedToken}`
}

export const getTeam = async (org, teamName) => github.get(`/orgs/${org}/teams/${teamName}/members`)
  .then(res => res.data)

export const setAuthHeader = (token) => {
  github.defaults.headers.authorization = `Bearer ${token}`
}
