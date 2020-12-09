export default function SettingsOrgTeam({
  orgName,
  teamName,
  handleInput,
  handleSubmitTeamName,
}) {
  return (
    <form
      className="pure-form pure-form-stacked"
      onSubmit={handleSubmitTeamName}
    >
      <fieldset>
        <legend>
          <span className="App-step">1</span>Choose org&amp;team
        </legend>
        <label htmlFor="orgName">Org</label>
        <input
          id="orgName"
          name="orgName"
          value={orgName}
          onChange={handleInput}
          placeholder="YourOrg"
        />
        <label htmlFor="teamName">Team</label>
        <input
          id="teamName"
          name="teamName"
          value={teamName}
          onChange={handleInput}
          placeholder="this-awesome-team"
        />
        <button className="pure-button pure-button-primary">Submit</button>
      </fieldset>
    </form>
  )
}
