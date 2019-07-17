FROM node:10

WORKDIR /usr/src/app

COPY package.json .

# install dependencies
RUN npm install

COPY . .

ENV PORT=8080
EXPOSE $PORT

CMD [ "npm", "start" ]
