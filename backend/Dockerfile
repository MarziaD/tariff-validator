FROM node:20.14.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev jest
COPY . .
EXPOSE 3001
RUN npm test
CMD ["npm", "run", "dev"]
