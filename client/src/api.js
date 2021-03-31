import axios from 'axios'

const github = axios.create({
  baseURL: 'https://api.github.com',
})

const storedAuth = sessionStorage.getItem('gh:auth')
const initialAuth = storedAuth ? JSON.parse(storedAuth) : null
if (initialAuth) {
  github.defaults.headers.authorization = `Bearer ${initialAuth.access_token}`
}

export const getTeam = async(org, teamName) =>
  github.get(`/orgs/${org}/teams/${teamName}/members`).then((res) => res.data)

export const createRepo = async(orgName, repoName, template) => {
  const [templateOwner, templateRepo] = template.split('/')
  const { data: repo } = await github.post(
    `/repos/${templateOwner}/${templateRepo}/generate`,
    {
      owner: orgName,
      name: repoName,
      private: false,
    },
    { headers: { accept: 'application/vnd.github.baptiste-preview+json' } },
  )
  return repo
}

const getMainBranch = async(repoName) => {
  const { data: branches } = await github.get(`/repos/${repoName}/branches`)
  return branches.pop()
}

export const checkRepo = async(repoName) => {
  const { data } = await github.get(`/repos/${repoName}`)
  return data
}

const getFirstCommit = async(repoName) => {
  const { data: commits } = await github.get(`/repos/${repoName}/commits`)
  return commits.pop()
}

const createBranch = async(fullName, branchName, sha) =>
  github.post(`/repos/${fullName}/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha,
  })

const setDefaultBranch = async(fullName, branchName) =>
  await github.patch(`/repos/${fullName}`, {
    default_branch: branchName,
  })

const setBranchProtection = async(fullName, branchName) =>
  await github.put(
    `/repos/${fullName}/branches/${branchName}/protection`,
    {
      required_pull_request_reviews: {
        // dismissal_restrictions: {
        //   users: [],
        //   teams: [],
        // },
        dismiss_stale_reviews: false,
        require_code_owner_reviews: false,
        required_approving_review_count: 1,
      },
      enforce_admins: false,
      required_status_checks: null,
      restrictions: null,
      // TODO: restrict who can push to matching branches
    },
    { headers: { accept: 'application/vnd.github.luke-cage-preview+json' } },
  )

const addMember = async(fullName, login, isAdmin) =>
  github.put(`/repos/${fullName}/collaborators/${login}`, {
    permission: isAdmin ? 'admin' : 'push',
  })

export const delay = async(ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const setupRepo = async(fullName, members, admin) => {
  // Get its full name, and first commit's sha
  const { sha } = await getFirstCommit(fullName)

  // Create dev branch and set it as the default branch
  await createBranch(fullName, 'dev', sha)
  await setDefaultBranch(fullName, 'dev')

  // Create branch protections
  // This shouldn't break if GH sets main as default branch in the future
  const { name: mainBranch } = await getMainBranch(fullName)
  await setBranchProtection(fullName, mainBranch)
  await setBranchProtection(fullName, 'dev')

  // Add members
  await Promise.all(members.map((m) => addMember(fullName, m, m === admin)))
}

export const setAuthHeader = (token) => {
  if (token) {
    github.defaults.headers.authorization = `Bearer ${token}`
  } else {
    delete github.defaults.headers.authorization
  }
}
