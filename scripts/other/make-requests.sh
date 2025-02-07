#!/bin/bash

# Default values
HOST="localhost"
NUM_REQUESTS=10
INTERVAL=2
NUM_CONSUMERS=2
AUTH_TOKEN="apikey-dev"  # Replace with your actual token or use an argument

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case "$1" in
        --num-requests=*) NUM_REQUESTS="${1#*=}"; shift ;;
        --interval=*) INTERVAL="${1#*=}"; shift ;;
        --num-consumers=*) NUM_CONSUMERS="${1#*=}"; shift ;;
        --auth-token=*) AUTH_TOKEN="${1#*=}"; shift ;;  # Accept auth token as an argument
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
done

# Validate that NUM_REQUESTS and INTERVAL are positive integers
if ! [[ "$NUM_REQUESTS" =~ ^[0-9]+$ ]] || ! [[ "$INTERVAL" =~ ^[0-9]+$ ]]; then
    echo "Error: NUM_REQUESTS and INTERVAL must be positive integers."
    exit 1
fi

# Check if AUTH_TOKEN is provided
if [ -z "$AUTH_TOKEN" ]; then
    echo "Error: Authorization token is required."
    exit 1
fi

# Initialize an array to store consumer ports
CONSUMER_PORTS=()

# Fill the CONSUMER_PORTS array with ports based on NUM_CONSUMERS
for ((i=1; i<=NUM_CONSUMERS; i++)); do
    api_port=$((4900 + i))
    CONSUMER_PORTS+=($api_port)
done

echo "Consumer ports: ${CONSUMER_PORTS[@]}"

# Send NUM_REQUESTS, with INTERVAL seconds between each
for ((i=1; i<=NUM_REQUESTS; i++)); do
    # Randomly select a consumer port from the array
    RANDOM_PORT=${CONSUMER_PORTS[RANDOM % ${#CONSUMER_PORTS[@]}]}

    # Send a POST request to the randomly selected consumer port with Authorization header
    echo "Sending POST request to http://$HOST:$RANDOM_PORT/tasks"
    curl -X POST -d '{}' "http://$HOST:$RANDOM_PORT/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $AUTH_TOKEN"  # Add the Authorization header

    # Wait for the specified interval (unless this is the last request)
    if [ $i -lt $NUM_REQUESTS ]; then
        sleep $INTERVAL
    fi
done

echo "All $NUM_REQUESTS requests completed."
