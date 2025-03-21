#!/bin/bash

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

    export HOST=""; HOST=$(sed 's/\.onion.*//' /var/lib/tor/hidden_service/hostname)
    echo "HOST is set to: $HOST"
    if [ "$BOOTSTRAP_NODE" = "true" ]; then
        echo "Registering the hidden service as a bootstrap node..."
        echo "$HOST:$PORT" >> /app/bootstrap/nodes.txt
    fi

    # Wait for "Bootstrap 100%" in the logs
    echo "Waiting for Tor to complete bootstrap..."
    while ! grep -q "Bootstrapped 100% (done): Done" "$TEMP_LOG"; do
        sleep 1
    done

    # Wait 5 seconds after bootstrap
    echo "Tor bootstrap completed. Waiting 5 seconds before starting the app..."
    sleep 5

    # Export the bootstrap node addresses and ports
    i=1
    while IFS=":" read -r node_address node_port; do
        export "BOOTSTRAP_NODE_ADDRESS_$i=$node_address"
        export "BOOTSTRAP_NODE_PORT_$i=$node_port"
        echo "BOOTSTRAP_NODE_ADDRESS_$i=$node_address"
        echo "BOOTSTRAP_NODE_PORT_$i=$node_port"
        ((i++))
    done < /app/bootstrap/nodes.txt

else
    echo "Starting in non-anonymous mode. Skipping Tor setup..."
fi

# Serve the Node.js backend application
echo "Serving the Node.js application..."
(cd provider-node && npm run build && npm run serve) || npm run build && npm run serve

