FROM node:14
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm install -g nodemon
RUN npm install -g ts-node

EXPOSE 3001

CMD [ "nodemon", "./src/server.ts" ]