import { getTeam } from '../api'

export default function SettingsOrgTeam({
  auth,
  orgName,
  teamName,
  methods: {
    handleInput,
    setTeamMembers,
    setStep,
  }
}) {
  const handleSubmitTeamName = async (e) => {
    e.preventDefault()
    const teamData = await getTeam('WildCodeSchool', teamName)
    const isCurrentUserMember = !!teamData.find((u) => u.login === auth.login)
    if (!isCurrentUserMember) {
      teamData.push({ id: auth.id, login: auth.login })
    }
    setTeamMembers(teamData)
    setStep(2)
  }
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
