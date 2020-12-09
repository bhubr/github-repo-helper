export default function SettingsRepo({
  repoPrefix,
  repoName,
  template,
  teamMembers,
  handleSubmitRepo,
  methods: { handleInput, isRepoMember, toggleRepoMember, setStep },
}) {
  return (
    <form className="pure-form pure-form-stacked" onSubmit={handleSubmitRepo}>
      <fieldset>
        <legend>
          <span className="App-step">2</span>Repo settings
          <button
            type="button"
            className="App-stepBack"
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
          </div>
        </div>
      </fieldset>
    </form>
  )
}
