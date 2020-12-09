import axios from 'axios'


const github = axios.create({
  baseURL: 'https://api.github.com',
})

const storedAuth = sessionStorage.getItem('gh:auth')
const initialAuth = storedAuth ? JSON.parse(storedAuth) : null
if (initialAuth) {
  github.defaults.headers.authorization = `Bearer ${initialAuth.access_token}`
}

export const getTeam = async (org, teamName) =>
  github.get(`/orgs/${org}/teams/${teamName}/members`).then((res) => res.data)

const createRepo = async (orgName, repoName, template) => {
  const [templateOwner, templateRepo] = template.split('/')
  const { data: repo } = await github.post(
    `/repos/${templateOwner}/${templateRepo}/generate`,
    {
      owner: orgName,
      name: repoName,
      private: false,
    },
    { headers: { accept: 'application/vnd.github.baptiste-preview+json' } }
  )
  return repo
}

const getFirstCommit = async (repoName) => {
  const { data: commits } = await github.get(`/repos/${repoName}/commits`)
  return commits.pop()
}

const createBranch = async (fullName, branchName, sha) =>
  github.post(`/repos/${fullName}/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha,
  })

const setDefaultBranch = async (fullName, branchName) =>
  await github.patch(`/repos/${fullName}`, {
    default_branch: branchName,
  })

const setBranchProtection = async (fullName, branchName) =>
  await github.patch(
    `/repos/${fullName}/branches/${branchName}/protection`,
    {
      required_pull_request_reviews: {
        dismissal_restrictions: {
          users: [],
          teams: [],
        },
        dismiss_stale_reviews: false,
        require_code_owner_reviews: true,
        required_approving_review_count: 1,
      },
    },
    { headers: { accept: 'application/vnd.github.luke-cage-preview+json' } }
  )

const addMember = async (fullName, login) =>
  github.put(`/repos/${fullName}/collaborators/${login}`, {
    permission: 'push',
  })

export const createFullRepo = async (orgName, repoName, template, members) => {
  // Create the repo
  // const repo = await createRepo(orgName, repoName, template)

  // // Get its full name, and first commit's sha
  // const { full_name: fullName } = repo

  const fullName = orgName + '/' + repoName

  // const { sha } = await getFirstCommit(fullName)
  // // Create dev branch and set it as the default branch
  // await createBranch(fullName, 'dev', sha)
  // await setDefaultBranch(fullName, 'dev')

  // Create branch protections TODO: get list of branches before doing it
  // WIP
  // await setBranchProtection(fullName, 'master')

  // Add members
  await Promise.all(members.map((m) => addMember(fullName, m)))
}

export const setAuthHeader = (token) => {
  if (token) {
    github.defaults.headers.authorization = `Bearer ${token}`
  } else {
    delete github.defaults.headers.authorization
  }
}
