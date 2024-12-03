#FROM node:23-slim
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build
#CMD ["npm", "run", "dev"]

# Use Node.js as the base image
FROM node:23-slim AS app-base

# Set up the working directory for the Node.js app
WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Compile TypeScript code
#RUN npm run build

# Install Tor on top of the Node.js image
FROM app-base AS final
RUN apt-get update && apt-get install -y tor && \
    mkdir -p /var/lib/tor/hidden_service && \
    chmod 700 /var/lib/tor/hidden_service && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add a custom Tor configuration
COPY torrc /etc/tor/torrc

# Combine the startup commands for both services
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose the necessary ports
EXPOSE 9050
EXPOSE 3000

# Default command to start both Tor and the app
CMD ["/start.sh"]

