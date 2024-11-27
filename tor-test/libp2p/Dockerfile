# Use the Node.js 23 image (if available)
FROM node:23-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the remaining application code
COPY . .

# Specify the command to start the application
CMD ["node", "index.js"]
