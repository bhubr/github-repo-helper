import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import {
  NotificationManager,
} from 'react-light-notifications'
import Loader from './Loader'
import { createRepo, delay, checkRepo, setupRepo } from '../api'

export default function SettingsRepo({
  repoAdmin,
  state: { orgName, repoName, template, repoMembers, teamMembers, templates },
  methods: { handleInput, handleChangeTemplate, isRepoMember, toggleRepoMember, setStep },
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

  const handleCreateOption = async(inputValue) => {
    setLoading('Checking template', inputValue)
    try {
      const data = await checkRepo(inputValue)
      console.log(inputValue, data)
      NotificationManager.success({
        title: 'Template added',
        message: `Good news, template "${inputValue}" exists!`,
      })
      handleChangeTemplate({ label: inputValue, value: inputValue })
    } catch (err) {
      NotificationManager.error({
        title: 'Template not added',
        message: `Oops! Template "${inputValue}" does not exist!`,
      })
    } finally {
      setStatus(null)
    }
  }

  const handleSubmitRepo = async(e) => {
    e.preventDefault()

    try {
      const templateName = template.value

      // Create repo
      setLoading('Creating repo')
      await createRepo(orgName, repoName, templateName).catch(
        rethrow('repo creation')
      )

      // Wait some time (otherwise no commits exist => can't create dev branch)
      setLoading('Waiting...')
      await delay(5000)

      setLoading('Post-creation setup')
      const fullName = `${orgName}/${repoName}`
      await setupRepo(fullName, repoMembers, repoAdmin).catch(
        rethrow('repo post-setup')
      )

      NotificationManager.success({
        title: 'Repo created',
        message: `Done creating ${fullName}`,
      })
      setStatus(null)
    } catch (err) {
      NotificationManager.error({
        title: 'Something bad happened',
        message: 'Repo creation failed!',
      })
    }
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
            <label htmlFor="repoName">Repo name</label>
            <input
              id="repoName"
              name="repoName"
              value={repoName}
              onChange={handleInput}
              placeholder="name"
            />
            <label htmlFor="template" style={{ marginTop: '1.5em' }}>Repo template</label>
            <p>Select an existing template, or fill in the <code>owner/repository</code> template.</p>
            <CreatableSelect
              id="template"
              isClearable
              onCreateOption={handleCreateOption}
              onChange={handleChangeTemplate}
              options={templates}
              value={template}
            />
            <button className="pure-button pure-button-primary" disabled={!repoName || !template}>Submit</button>

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
