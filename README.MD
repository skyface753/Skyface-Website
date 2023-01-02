# SkyBlog

## DEMO

https://www.skyface.de

## Environment Vars

### WEB:

./skyface-web/src/consts.js (From ./skyface-web/src/consts.js.example)

- Change BACKENDHOST (With "/" at the end)

./skyface-web/src/credentials.js
(Optional for Oauth, but you need to remove it from ./src/App.js and from ./src/components/GitHubLoginButton.js)

- Create the file from ./skyface-web/src/credentials.js.example

./skyface-backend/.env (optional for Google and Github Auth)

- GITHUB_CLIENT_ID=
- GITHUB_CLIENT_SECRET=
- GITHUB_REDIRECT_URI=
- GOOGLE_CLIENT_ID=

## Develop

### Run Makefile

`make`

- Installs NPM for backen, web and react
- Starts Docker-debug
- Restore from "latest.mongo"

### Ready to develop

Backend: `npm run dev`
Web: `npm start`
React: `npm start`

## RUN Prod

`make full` (Does Everything)

Default User:

- Username: admin
- Password: admin

In Progress

## INFOS

docker-compose -> backend -> frontendurl = cors & rss

## Build (My Notes :D)

make build

### Web

`cd skyface-web && npm install && npm run build && docker build -t skyface753/skyblog-web .`

### Backend

`docker build -t skyface753/skyblog-backend ./skyface-backend`

Neu 22. Juni
make
docker-compose up -d --build
OR
make full

Neu 17. Juni
cd skyface-web && npm run build && cd .. && mv skyface-web/build/\* skyface-backend/react_build
