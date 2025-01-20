FROM node:23-slim AS app-base

WORKDIR /app

COPY /package.json ./
RUN npm install

COPY . .
ARG PROVIDER_HOST
ARG PROVIDER_PORT
ARG DEV_API_KEY

# Generate .env.development file with the environment variables
RUN echo "VITE_PROVIDER_HOST=${PROVIDER_HOST}" > .env && \
    echo "VITE_PROVIDER_PORT=${PROVIDER_PORT}" >> .env && \
    echo "VITE_DEV_API_KEY=${DEV_API_KEY}" >> .env
RUN npm run build


# Install Tor on top of the Node.js image
FROM app-base AS final
RUN apt-get update && apt-get install -y tor && \
    mkdir -p /var/lib/tor/hidden_service && \
    chmod 700 /var/lib/tor/hidden_service && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add a custom Tor configuration
COPY torrc /etc/tor/torrc

COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose the frontend port
EXPOSE 8080

CMD ["/start.sh"]


