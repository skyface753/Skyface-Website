ARG ARCH=
FROM ${ARCH}node
WORKDIR /usr/src/app
COPY ./build/ /usr/src/app/
RUN npm install -g serve
EXPOSE 3000
# RUN npm install
CMD ["serve", "-s", "/usr/src/app"]

FROM node as dev
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]