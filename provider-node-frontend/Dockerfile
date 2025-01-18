FROM node:23-slim AS app-base

WORKDIR /app

COPY /package.json ./
RUN npm install

COPY . .
ARG PROVIDER_HOST
ARG PROVIDER_PORT
ARG DEV_API_KEY
ARG ANONYMOUS_MODE
ARG SOCKS5_HOST
ARG SOCKS5_PORT

# Generate .env.development file with the environment variables
RUN echo "VITE_PROVIDER_HOST=${PROVIDER_HOST}" > .env && \
    echo "VITE_PROVIDER_PORT=${PROVIDER_PORT}" >> .env && \
    echo "VITE_DEV_API_KEY=${DEV_API_KEY}" >> .env && \
    echo "VITE_ANONYMOUS_MODE=${ANONYMOUS_MODE}" >> .env && \
    echo "VITE_SOCKS5_HOST=${SOCKS5_HOST}" >> .env && \
    echo "VITE_SOCKS5_PORT=${SOCKS5_PORT}" >> .env
RUN npm run build


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

# Expose the necessary ports, in this case only the frontend port
EXPOSE 8080
#EXPOSE 9050

# Default command to start both Tor and the app
CMD ["/start.sh"]


