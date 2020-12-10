import { useState } from 'react'
import Loader from './Loader'
import { createRepo, delay, setupRepo } from '../api'

export default function SettingsRepo({
  repoAdmin,
  state: { orgName, repoPrefix, repoName, template, repoMembers, teamMembers },
  methods: { handleInput, isRepoMember, toggleRepoMember, setStep },
}) {
  const [status, setStatus] = useState(null)

  const rethrow = (label) => (err) => {
    setStatus({
      loading: false,
      level: 'error',
      text: `Error during ${label}: ${err.message}`,
    })
    throw err
  }

  const setLoading = (text) =>
    setStatus({
      loading: true,
      level: 'loading',
      text,
    })

  const handleSubmitRepo = async (e) => {
    e.preventDefault()

    // Create repo
    setLoading('Creating repo')
    const fullRepoName = `${repoPrefix}${repoName}`
    const repo = await createRepo(orgName, fullRepoName, template).catch(
      rethrow('repo creation')
    )

    // Wait some time (otherwise no commits exist => can't create dev branch)
    setLoading('Waiting...')
    await delay(5000)

    setLoading('Post-creation setup')
    const { full_name: fullName } = repo
    await setupRepo(fullName, repoMembers, repoAdmin).catch(
      rethrow('repo post-setup')
    )

    setStatus({
      loading: false,
      level: 'success',
      text: `Done creating ${fullName}`,
    })
  }
  return (
    <form className="pure-form pure-form-stacked" onSubmit={handleSubmitRepo}>
      <fieldset>
        <legend>
          <span className="App-step">2</span>Repo settings
          <button
            type="button"
            className="App-stepBack btn-transparent"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        </legend>

        <div className="pure-g">
          <div className="pure-u-3-5">
            <div className="SettingsRepo-team">
              {teamMembers.map((member) => (
                <label className="SettingsRepo-member" key={member.id}>
                  <input
                    htmlFor={`cb-${member.login}`}
                    type="checkbox"
                    checked={isRepoMember(member.login)}
                    onChange={() => toggleRepoMember(member.login)}
                  />{' '}
                  <img src={member.avatar_url} alt={member.login} />
                  {member.login}
                </label>
              ))}
            </div>
          </div>

          <div className="pure-u-2-5">
            <label htmlFor="repoPrefix">Repo name prefix</label>
            <input
              id="repoPrefix"
              name="repoPrefix"
              value={repoPrefix}
              onChange={handleInput}
              placeholder="common-repo-name-"
            />
            <label htmlFor="repoName">Repo name</label>
            <input
              id="repoName"
              name="repoName"
              value={repoName}
              onChange={handleInput}
              placeholder="name"
            />
            <label htmlFor="template">Repo template</label>
            <input
              id="template"
              name="template"
              value={template}
              onChange={handleInput}
              placeholder="login/repo"
            />
            <button className="pure-button pure-button-primary">Submit</button>

            {status && (
              <div className="SettingsRepo-status">
                {status.loading ? (
                  <Loader />
                ) : (
                  <button
                    className="btn-transparent"
                    type="button"
                    onClick={() => setStatus(null)}
                  >
                    &times;
                  </button>
                )}
                <span className={`SettingsRepo-${status.level}Status`}>
                  {status.text}
                </span>
              </div>
            )}
          </div>
        </div>
      </fieldset>
    </form>
  )
}
