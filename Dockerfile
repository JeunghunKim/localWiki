FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# The data directory should be a volume, but we create it just in case
RUN mkdir -p data

# Expose the port
EXPOSE 3000

# Run the app
CMD [ "node", "index.js" ]
