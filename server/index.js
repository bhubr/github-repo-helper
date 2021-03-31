const express = require('express')
const cors = require('cors')
const axios = require('axios')
const qs = require('qs')
require('dotenv').config()
const { port, oauth, clientAppUrl } = require('./settings')

const app = express()
app.use(cors({
  origin: clientAppUrl
}))

app.get('/github/token', async (req, res) => {
  const { code } = req.query
  const { tokenUrl, clientId, clientSecret, redirectUri } = oauth
  // GitHub wants everything in an url-encoded body
  const payload = qs.stringify({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  })
  const clientSecretLen = clientSecret.length - 4
  const dbgPayload = payload.replace(clientSecret.substr(2, clientSecretLen), '*'.repeat(clientSecretLen))
  console.log('payload', dbgPayload)
  try {
    const { data } = await axios.post(tokenUrl, payload, { headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' } })
    console.log('got access token')
    // GitHub sends back the response as an url-encoded string
    const parsed = qs.parse(data)
    const { access_token: accessToken } = parsed
    const { data: profile } = await axios.get('https://api.github.com/user', {
      headers: { authorization: `Bearer ${accessToken}` }
    })
    console.log('got profile', profile)
    const { id, login, avatar_url: avatarUrl } = profile
    res.json({ id, login, avatar_url: avatarUrl, access_token: accessToken })
  } catch (err) {
    console.error('Error while requesting a token', err.response && err.response.data)
    res.status(500).json({
      error: err.message
    })
  }
})

app.listen(port, (err) => {
  if (err) {
    console.error('Something wrong happened', err)
  } else {
    console.log('server listening')
  }
})
