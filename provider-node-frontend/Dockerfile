FROM node:23-slim AS app-base

WORKDIR /app

COPY /package.json ./
RUN npm install

COPY . .
#RUN echo 'Creating .env file '
#RUN echo "VITE_PROVIDER_HOST=${PROVIDER_HOST}"
#RUN echo "VITE_PROVIDER_HOST=${PROVIDER_HOST}" > .env
#RUN echo "VITE_PROVIDER_PORT=${PROVIDER_PORT}" >> .env
#RUN echo "VITE_DEV_API_KEY=${DEV_API_KEY}" >> .env
#RUN echo "VITE_ANONYMOUS_MODE=${ANONYMOUS_MODE}" >> .env
RUN PROVIDER_HOST=127.0.0.1 PROVIDER_PORT=3002 ANONYMOUS_MODE=false DEV_API_KEY=apikey-dev npm run build


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

# Default command to start both Tor and the app
CMD ["/start.sh"]


