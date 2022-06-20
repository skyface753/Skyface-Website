# DEMO

https://www.skyface.de

# Environment Vars

## WEB:

./skyface-web/src/consts.js

- Change BACKENDHOST (With "/" at the end)

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

make build

## Web

`cd skyface-web && npm install && npm run build && docker build -t skyface753/skyblog-web .`

## Backend

`docker build -t skyface753/skyblog-backend ./skyface-backend`

Neu 17. Juni
cd skyface-web && npm run build && cd .. && mv skyface-web/build/\* skyface-backend/react_build
