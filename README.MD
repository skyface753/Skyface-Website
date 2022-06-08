# BACKUP

docker-compose -f docker-compose-debug.yml exec -T mongo sh -c 'mongodump --archive' > compose-backup

docker-compose -f docker-compose-debug.yml exec -T mongo sh -c 'mongorestore --archive' <

./credentials.js
var clientId = "";

export default function getCredentials(){
return clientId;
}

CHANGE RSS FRONTEND URL

# Environment Vars

## WEB:

./skyface-web/src/consts.js

- Change BACKENDHOST

./skyface-web/src/credentials.js
(Optional for Oauth, but you need to remove it from ./src/App.js and from ./src/components/GitHubLoginButton.js)

- Create the file from ./skyface-web/src/credentials-template.js

./skyface-backend/.env (optional for Google and Github Auth)

- GITHUB_CLIENT_ID=
- GITHUB_CLIENT_SECRET=
- GITHUB_REDIRECT_URI=
- GOOGLE_CLIENT_ID=

# Develop

## Run Makefile

`make`

- Installs NPM for backen, web and react
- Starts Docker-debug
- Restore from "latest.mongo"

## Ready to develop

Backend: `npm run dev`
Web: `npm start`
React: `npm start`

# RUN Prod

In Progress

# INFOS

docker-compose -> backend -> frontendurl = cors & rss

# Build (My Notes :D)

## Web

`cd skyface-web && npm build && docker build -t skyface753/skyblog-web .`

## Backend

`docker build -t skyface753/skyblog-backend ./skyface-backend`
