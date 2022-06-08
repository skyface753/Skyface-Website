var clientId = ""; // Google Oauth Client ID
var REACT_APP_CLIENT_ID = ""; // GitHub Oauth Client ID
var REACT_APP_CLIENT_SECRET = ""; //Github Oauth Client Secret
var REACT_APP_REDIRECT_URI = ""; // Github Oauth Redirect URI
function getCredentials() {
  return clientId;
}

function getClientId() {
  return REACT_APP_CLIENT_ID;
}

function getClientSecret() {
  return REACT_APP_CLIENT_SECRET;
}

function getRedirectUri() {
  return REACT_APP_REDIRECT_URI;
}

export { getCredentials, getClientId, getClientSecret, getRedirectUri };
