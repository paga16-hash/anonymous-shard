#!/bin/bash

# Start Tor in the background
tor &

# Wait for Tor to initialize
while [ ! -f /var/lib/tor/hidden_service/hostname ]; do
    sleep 1
done

# Print the Tor hidden service address
echo "Tor is running. Hidden Service Address:"
cat /var/lib/tor/hidden_service/hostname

sleep 180
# Start the Node.js application
npm run dev
