FROM node
WORKDIR /usr/src/app
COPY ./build/ /usr/src/app/
RUN npm install -g serve
EXPOSE 3000
# RUN npm install
CMD ["serve", "-s", "/usr/src/app"]