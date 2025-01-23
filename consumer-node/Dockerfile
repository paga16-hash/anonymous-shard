FROM node:23-slim AS app-base

WORKDIR /app

# Copy and install dependencies for the consumer-node
COPY consumer-node/package*.json ./consumer-node/
WORKDIR /app/consumer-node
RUN npm install

# Copy the rest of the consumer-node files
COPY consumer-node/ .

# Copy and install dependencies for the consumer-node-frontend
WORKDIR /app
COPY consumer-node-frontend/package.json ./consumer-node-frontend/
WORKDIR /app/consumer-node-frontend
RUN npm install

# Copy the rest of the consumer-node-frontend files
COPY consumer-node-frontend/ .

# Reset workdir to /app for runtime operations
WORKDIR /app

# Install Tor on top of the Node.js image
FROM app-base AS final
RUN apt-get update && apt-get install -y tor && \
    mkdir -p /var/lib/tor/hidden_service && \
    chmod 700 /var/lib/tor/hidden_service && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add a custom Tor configuration
COPY consumer-node/torrc /etc/tor/torrc

# Combine the startup commands for both services
COPY consumer-node/start.sh /consumer-node/start.sh
COPY consumer-node-frontend/start.sh /consumer-node-frontend/start.sh
RUN chmod +x consumer-node/start.sh
RUN chmod +x consumer-node-frontend/start.sh

CMD ["sh", "-c", "./consumer-node/start.sh & ./consumer-node-frontend/start.sh > /tmp/frontend.log 2>&1"]



