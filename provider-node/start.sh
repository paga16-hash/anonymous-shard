#!/bin/bash

# Start Tor in the background and redirect its logs to a temporary file
#TEMP_LOG="/tmp/tor_bootstrap.log"
#tor > "$TEMP_LOG" 2>&1 &

# Wait for Tor to generate the hidden service hostname
#while [ ! -f /var/lib/tor/hidden_service/hostname ]; do
#    sleep 1
#done

# Print the Tor hidden service address
#echo "Tor is running. Hidden Service Address:"
#cat /var/lib/tor/hidden_service/hostname

# Wait for "Bootstrap 100%" in the logs
#echo "Waiting for Tor to complete bootstrap..."
#while ! grep -q "Bootstrapped 100% (done): Done" "$TEMP_LOG"; do
#    sleep 1
#done

# Wait 5 seconds after bootstrap
#echo "Tor bootstrap completed. Waiting 5 seconds before starting the app..."
#sleep 5

# Start the Node.js application
# TODO: to change and to use npm start, without setting some ENV variable to development
#npm run dev
# HOST=127.0.0.1 PORT=3001 ANONYMOUS_MODE=false npm run dev


# Check the ANONYMOUS_MODE environment variable
if [ "$ANONYMOUS_MODE" = "true" ]; then
    echo "Starting in anonymous mode..."

    # Start Tor in the background and redirect its logs to a temporary file
    TEMP_LOG="/tmp/tor_bootstrap.log"
    tor > "$TEMP_LOG" 2>&1 &

    # Wait for Tor to generate the hidden service hostname
    while [ ! -f /var/lib/tor/hidden_service/hostname ]; do
        sleep 1
    done

    # Print the Tor hidden service address
    echo "Tor is running. Hidden Service Address:"
    cat /var/lib/tor/hidden_service/hostname

    # Wait for "Bootstrap 100%" in the logs
    echo "Waiting for Tor to complete bootstrap..."
    while ! grep -q "Bootstrapped 100% (done): Done" "$TEMP_LOG"; do
        sleep 1
    done

    # Wait 5 seconds after bootstrap
    echo "Tor bootstrap completed. Waiting 5 seconds before starting the app..."
    sleep 5
else
    echo "Starting in non-anonymous mode. Skipping Tor setup..."
fi

# Start the Node.js application
echo "Starting the Node.js application..."
npm run dev
