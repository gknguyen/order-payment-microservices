# Image version
FROM node:14

# Description
LABEL description="order service"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm run ci:prod

# Bundle app source
COPY . .

# bind the app to port 4000
EXPOSE 4000

# comand to run the app
CMD [ "npm", "run", "prod" ]