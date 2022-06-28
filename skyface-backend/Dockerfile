FROM node
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]

FROM node as dev
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
EXPOSE 5000
CMD ["npm", "run", "dev"]