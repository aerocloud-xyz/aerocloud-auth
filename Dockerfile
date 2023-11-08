FROM node:14
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm install -g nodemon

EXPOSE 3001

CMD [ "nodemon", "./src/server.ts" ]