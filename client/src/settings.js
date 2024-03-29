// Ideally you should take these vars from process.env.REACT_APP_*
// and define them in e.g. .env.local (if you're using Create React App)

// Authorization screen base URL
// e.g. https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
export const authorizationUrl = process.env.REACT_APP_OAUTH_SCREEN_URL

// To get a client ID, create an app, e.g.
// GitHub (authorization code grant only): https://github.com/settings/developers
// Spotify (implicit grant & auth code): https://developer.spotify.com/dashboard/applications
export const clientId = process.env.REACT_APP_OAUTH_CLIENT_ID

// You get to configure this in your OAuth settings
// If you use React Router, the relative path (empty here) can match
// that of a route which displays nothing
export const redirectUri = process.env.REACT_APP_OAUTH_REDIRECT_URI

// Authorization code flow only: base URL for your server
// The one provided below is that of the sample Express server provided
export const serverUrl = process.env.REACT_APP_SERVER_URL
