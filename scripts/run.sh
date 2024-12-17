#!/bin/bash

# Validate input argument
if [[ "$1" != "true" && "$1" != "false" ]]; then
  echo "Usage: $0 [true|false]"
  exit 1
fi

# Set ANONYMOUS_MODE based on the input argument
export ANONYMOUS_MODE=$1

echo "Starting in anonymous mode: $ANONYMOUS_MODE"

# Run Docker Compose for provider-node
echo "Starting provider nodes..."
(
  cd ./provider-node || exit
  if [[ "$2" == "--build" ]]; then
    docker-compose up --build -d
  else
    docker-compose up -d
  fi
)

# Run Docker Compose for consumer-node (if needed)
echo "Starting consumer nodes..."
(
  cd ./consumer-node || exit
  if [[ "$2" == "--build" ]]; then
    docker-compose up --build -d
  else
    docker-compose up -d
  fi
)

echo "All services started."
