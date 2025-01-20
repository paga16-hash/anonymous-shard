#!/bin/bash

# Check the ANONYMOUS_MODE environment variable
if [ "$ANONYMOUS_MODE" = "true" ]; then
    echo "Starting in anonymous mode..."

    # Start Tor in the background and redirect its logs to a temporary file
    TEMP_LOG="/tmp/tor_bootstrap.log"
    tor > "$TEMP_LOG" 2>&1 &

    # Wait for "Bootstrap 100%" in the logs
    echo "Waiting for Tor to complete bootstrap before starting the frontend..."
    while ! grep -q "Bootstrapped 100% (done): Done" "$TEMP_LOG"; do
        sleep 1
    done

else
    echo "Starting in non-anonymous mode. Variable value: $ANONYMOUS_MODE. Skipping Tor setup..."
fi

# Start the Node.js application
echo "Starting the Node.js application..."
cd provider-node-frontend && npm run serve
