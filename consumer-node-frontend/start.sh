#!/bin/bash

# Check the ANONYMOUS_MODE environment variable
if [ "$ANONYMOUS_MODE" = "true" ]; then
    TEMP_LOG="/tmp/tor_bootstrap.log"
    tor > "$TEMP_LOG" 2>&1 &

    while ! grep -q "Bootstrapped 100% (done): Done" "$TEMP_LOG"; do
        sleep 1
    done

else
    echo "Starting in non-anonymous mode. Variable value: $ANONYMOUS_MODE. Skipping Tor setup..."
fi

echo "Starting the frontend application asynchronously..."
cd consumer-node-frontend && npm run serve
