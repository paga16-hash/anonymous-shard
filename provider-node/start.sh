#!/bin/bash

# Start Tor in the background
#tor &

# Wait for Tor to initialize
#while [ ! -f /var/lib/tor/hidden_service/hostname ]; do
#    sleep 1
#done

# Print the Tor hidden service address
#echo "Tor is running. Hidden Service Address:"
#cat /var/lib/tor/hidden_service/hostname

# Wait for Tor to write in the console Bootstrap 100%

#sleep 240
# Start the Node.js application
#npm run dev

#!/bin/bash

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

# Start the Node.js application
npm run dev

