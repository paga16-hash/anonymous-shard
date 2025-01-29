#!/bin/bash

# Function to generate the Docker Compose file for providers
generate_provider_nodes() {
    local provider_count=$1
    local bootstrap_count=$2

    # Ensure that the number of provider nodes is >= the number of bootstrap nodes
    if [ "$provider_count" -lt "$bootstrap_count" ]; then
        echo "Error: Number of provider nodes must be greater than or equal to bootstrap nodes."
        exit 1
    fi

    # Starting port numbers
    local provider_port=4001
    local frontend_port=8081

    # Generate provider nodes
    for i in $(seq 1 $provider_count); do
        cat <<EOF >> docker-compose.yml
  provider-$i:
    image: pagahubbing/anonymous-shard-provider-node:latest
    container_name: tor-provider-$i
    build:
      context: ..
      dockerfile: provider-node/Dockerfile
    environment:
      - ANONYMOUS_MODE=true
      - DEV_API_KEY=apikey-dev
      - PINATA_API_KEY=1fd0fe489d865a398820
      - PINATA_API_SECRET=cac1872634ecbf108f0a00cdff9be7ecf04e0a2ad13a8211be5b80bb974e8974
      - PORT=3000
      - API_PORT=$provider_port
      - BOOTSTRAP_NODE=$( [ $i -le $bootstrap_count ] && echo "true" || echo "false" )
    ports:
      - "$provider_port:4000"
      - "$frontend_port:8080"
    volumes:
      - tor$i-data:/var/lib/tor/hidden_service
      - ./bootstrap:/app/bootstrap
    networks:
      - anonymous-shard-network
EOF
        # Increment port numbers for next provider
        provider_port=$((provider_port + 1))
        frontend_port=$((frontend_port + 1))
    done
}

# Function to generate the Docker Compose file for consumers
generate_consumer_nodes() {
    local consumer_count=$1

    # Starting port numbers for consumers
    local consumer_port=4901
    local frontend_port=8181

    # Generate consumer nodes
    for i in $(seq 1 $consumer_count); do
        cat <<EOF >> docker-compose.yml
  consumer-$i:
    image: pagahubbing/anonymous-shard-consumer-node:latest
    container_name: tor-consumer-$i
    build:
      context: ..
      dockerfile: consumer-node/Dockerfile
    environment:
      - ANONYMOUS_MODE=true
      - DEV_API_KEY=apikey-dev
      - PORT=3000
      - API_PORT=$consumer_port
    ports:
      - "$consumer_port:4000"
      - "$frontend_port:8080"
    volumes:
      - tor$i-data-consumer:/var/lib/tor/hidden_service
      - ./results:/app/consumer-node/results
      - ./bootstrap:/app/bootstrap
    networks:
      - anonymous-shard-network
EOF
        # Increment port numbers for next consumer
        consumer_port=$((consumer_port + 1))
        frontend_port=$((frontend_port + 1))
    done
}

# Function to generate the Docker Compose file
generate_docker_compose() {
    local bootstrap_count=$1
    local provider_count=$2
    local consumer_count=$3

    # Start Docker Compose file content
    cat <<EOF > docker-compose.yml
version: '3.8'

services:
EOF

    # Generate provider and consumer nodes
    generate_provider_nodes $provider_count $bootstrap_count
    generate_consumer_nodes $consumer_count

    # Docker volumes and network
    cat <<EOF >> docker-compose.yml

volumes:
EOF

    # Generate provider volumes
    for i in $(seq 1 $provider_count); do
        cat <<EOF >> docker-compose.yml
  tor$i-data:
    name: tor$i-data
EOF
    done

    # Generate consumer volumes
    for i in $(seq 1 $consumer_count); do
        cat <<EOF >> docker-compose.yml
  tor$i-data-consumer:
    name: tor$i-data-consumer
EOF
    done

    cat <<EOF >> docker-compose.yml

networks:
  anonymous-shard-network:
    name: anonymous-shard-network
    driver: bridge
    external: true
EOF
}

# Function to start the containers (without showing output)
start_containers() {
    # Overwrite nodes.txt in bootstrap folder
    mkdir -p bootstrap
    touch bootstrap/nodes.txt

    # Ensure the network is created before starting the containers
    docker network ls | grep -q "anonymous-shard-network" || docker network create --driver=bridge anonymous-shard-network

    # Start the containers
    docker compose up -d > /dev/null 2>&1
}

# Function to stop the containers, network, and volumes
stop_containers() {
    rm -r bootstrap/
    docker compose down --volumes --remove-orphans > /dev/null 2>&1
    docker network rm anonymous-shard-network > /dev/null 2>&1
}

# Main execution
if [[ $1 == "generate" ]]; then
    generate_docker_compose $2 $3 $4
elif [[ $1 == "start" ]]; then
    start_containers
elif [[ $1 == "stop" ]]; then
    stop_containers
else
    echo "Usage: $0 {generate <bootstrap_count> <provider_count> <consumer_count> | start | stop}"
fi
