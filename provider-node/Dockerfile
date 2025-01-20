FROM node:23-slim AS app-base

WORKDIR /app

# Copy and install dependencies for the provider-node
COPY provider-node/package*.json ./provider-node/
WORKDIR /app/provider-node
RUN npm install

# Copy the rest of the provider-node files
COPY provider-node/ .

# Copy and install dependencies for the provider-node-frontend
WORKDIR /app
COPY provider-node-frontend/package.json ./provider-node-frontend/
WORKDIR /app/provider-node-frontend
RUN npm install

# Copy the rest of the provider-node-frontend files
COPY provider-node-frontend/ .
ARG DEV_API_KEY

# Generate .env file with the environment variables
RUN echo "VITE_DEV_API_KEY=${DEV_API_KEY}" >> .env
# Build the frontend
RUN npm run build

# Reset workdir to /app for runtime operations
WORKDIR /app


# Install Tor on top of the Node.js image
FROM app-base AS final
RUN apt-get update && apt-get install -y tor && \
    mkdir -p /var/lib/tor/hidden_service && \
    chmod 700 /var/lib/tor/hidden_service && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add a custom Tor configuration
COPY provider-node/torrc /etc/tor/torrc

# Combine the startup commands for both services
COPY provider-node/start.sh /provider-node/start.sh
COPY provider-node-frontend/start.sh /provider-node-frontend/start.sh
RUN chmod +x provider-node/start.sh
RUN chmod +x provider-node-frontend/start.sh


#CMD ["./provider-node/start.sh", "./provider-node-frontend/start.sh"]
CMD ["sh", "-c", "./provider-node/start.sh & ./provider-node-frontend/start.sh"]



