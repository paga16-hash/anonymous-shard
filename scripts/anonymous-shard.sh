#!/bin/bash

# Check the primary action
if [[ "$1" != "generate" && "$1" != "start" && "$1" != "stop" ]]; then
    echo "Usage: $0 {generate <anon_mode> <pinata_api_key> <pinata_api_secret> <dev_api_key> <bootstrap_count> <provider_count> <consumer_count> | start | stop}"
    exit 1
fi

ACTION=$1

if [[ "$ACTION" == "generate" ]]; then
    # For generate, we need exactly 8 arguments.
    if [[ $# -ne 8 ]]; then
        echo "Usage: $0 generate <anon_mode> <pinata_api_key> <pinata_api_secret> <dev_api_key> <bootstrap_count> <provider_count> <consumer_count>"
        exit 1
    fi

    # Parse arguments for generate
    ANON_MODE=$2
    PINATA_API_KEY=$3
    PINATA_API_SECRET=$4
    DEV_API_KEY=$5
    BOOTSTRAP_COUNT=$6
    PROVIDER_COUNT=$7
    CONSUMER_COUNT=$8

    if [[ "$PROVIDER_COUNT" -lt "$BOOTSTRAP_COUNT" ]]; then
        echo "Error: Provider count must be greater than or equal to bootstrap count."
        exit 1
    fi
fi

# Function to generate Docker Compose file
generate_docker_compose() {
    cat <<EOF > docker-compose.yml
version: '3.8'

services:
EOF

    if [ "$ANON_MODE" == "true" ]; then
        # Anonymous mode configuration
        local provider_api_port=4001
        local provider_frontend_port=8081

        for i in $(seq 1 $PROVIDER_COUNT); do
            if [ $i -le $BOOTSTRAP_COUNT ]; then
                bootstrap_node="true"
            else
                bootstrap_node="false"
            fi

            cat <<EOF >> docker-compose.yml
  provider-$i:
    image: pagahubbing/anonymous-shard-provider-node:latest
    container_name: tor-provider-$i
    build:
      context: ..
      dockerfile: provider-node/Dockerfile
    environment:
      - ANONYMOUS_MODE=true
      - DEV_API_KEY=$DEV_API_KEY
      - PINATA_API_KEY=$PINATA_API_KEY
      - PINATA_API_SECRET=$PINATA_API_SECRET
      - PORT=3000
      - API_PORT=$provider_api_port
      - BOOTSTRAP_NODE=$bootstrap_node
    ports:
      - "$provider_api_port:4000"
      - "$provider_frontend_port:8080"
    volumes:
      - tor$i-data:/var/lib/tor/hidden_service
      - ./bootstrap:/app/bootstrap
    networks:
      - anonymous-shard-network

EOF
            provider_api_port=$((provider_api_port + 1))
            provider_frontend_port=$((provider_frontend_port + 1))
        done

        local consumer_api_port=4901
        local consumer_frontend_port=8181

        for i in $(seq 1 $CONSUMER_COUNT); do
            cat <<EOF >> docker-compose.yml
  consumer-$i:
    image: pagahubbing/anonymous-shard-consumer-node:latest
    container_name: tor-consumer-$i
    build:
      context: ..
      dockerfile: consumer-node/Dockerfile
    environment:
      - ANONYMOUS_MODE=true
      - DEV_API_KEY=$DEV_API_KEY
      - PINATA_API_KEY=$PINATA_API_KEY
      - PINATA_API_SECRET=$PINATA_API_SECRET
      - PORT=3000
      - API_PORT=$consumer_api_port
    ports:
      - "$consumer_api_port:4000"
      - "$consumer_frontend_port:8080"
    volumes:
      - tor$i-data-consumer:/var/lib/tor/hidden_service
      - ./results:/app/consumer-node/results
      - ./bootstrap:/app/bootstrap
    networks:
      - anonymous-shard-network

EOF
            consumer_api_port=$((consumer_api_port + 1))
            consumer_frontend_port=$((consumer_frontend_port + 1))
        done

    else
        # Local mode configuration (ANON_MODE == false)
        for i in $(seq 1 $PROVIDER_COUNT); do
            # Providers: unique internal PORT starting at 3000, API_PORT starting at 4000, and frontend ports starting at 8080.
            provider_internal_port=$((3000 + i - 1))
            provider_api_port=$((4000 + i - 1))
            provider_frontend_port=$((8080 + i - 1))
            cat <<EOF >> docker-compose.yml
  provider-$i:
    image: pagahubbing/anonymous-shard-provider-node:latest
    container_name: local-provider-$i
    build:
      context: ..
      dockerfile: provider-node/Dockerfile
    environment:
      - ANONYMOUS_MODE=false
      - DEV_API_KEY=$DEV_API_KEY
      - PINATA_API_KEY=$PINATA_API_KEY
      - PINATA_API_SECRET=$PINATA_API_SECRET
      - HOST=local-provider-$i
      - PORT=$provider_internal_port
      - API_PORT=$provider_api_port
      - LOCAL_BOOTSTRAP_NODE_ADDRESS_1=local-provider-1
      - LOCAL_BOOTSTRAP_NODE_PORT_1=3000
      - LOCAL_BOOTSTRAP_NODE_ADDRESS_2=local-provider-2
      - LOCAL_BOOTSTRAP_NODE_PORT_2=3001
    ports:
      - "$provider_api_port:$provider_api_port"
      - "$provider_frontend_port:8080"
    volumes:
      - tor$i-data:/var/lib/tor/hidden_service
      - ./bootstrap:/app/bootstrap
    networks:
      - anonymous-shard-network

EOF
        done

        for i in $(seq 1 $CONSUMER_COUNT); do
            # Consumers: unique internal PORT starting at 3900, API_PORT starting at 4900, and frontend ports starting at 8085.
            consumer_internal_port=$((3900 + i - 1))
            consumer_api_port=$((4900 + i - 1))
            consumer_frontend_port=$((8085 + i - 1))
            cat <<EOF >> docker-compose.yml
  consumer-$i:
    image: pagahubbing/anonymous-shard-consumer-node:latest
    container_name: local-consumer-$i
    build:
      context: ..
      dockerfile: consumer-node/Dockerfile
    environment:
      - ANONYMOUS_MODE=false
      - DEV_API_KEY=$DEV_API_KEY
      - PINATA_API_KEY=$PINATA_API_KEY
      - PINATA_API_SECRET=$PINATA_API_SECRET
      - HOST=local-consumer-$i
      - PORT=$consumer_internal_port
      - API_PORT=$consumer_api_port
      - LOCAL_BOOTSTRAP_NODE_ADDRESS_1=local-provider-1
      - LOCAL_BOOTSTRAP_NODE_PORT_1=3000
      - LOCAL_BOOTSTRAP_NODE_ADDRESS_2=local-provider-2
      - LOCAL_BOOTSTRAP_NODE_PORT_2=3001
    ports:
      - "$consumer_api_port:$consumer_api_port"
      - "$consumer_frontend_port:8080"
    volumes:
      - tor$i-data-consumer:/var/lib/tor/hidden_service
      - ./results:/app/consumer-node/results
      - ./bootstrap:/app/bootstrap
    networks:
      - anonymous-shard-network

EOF
        done
    fi

    # Append volumes and networks definitions
    cat <<EOF >> docker-compose.yml

volumes:
EOF

    for i in $(seq 1 $PROVIDER_COUNT); do
        cat <<EOF >> docker-compose.yml
  tor$i-data:
    name: tor$i-data
EOF
    done

    for i in $(seq 1 $CONSUMER_COUNT); do
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

# Function to start containers
start_containers() {
    mkdir -p bootstrap
    touch bootstrap/nodes.txt
    docker network ls | grep -q "anonymous-shard-network" || docker network create --driver=bridge anonymous-shard-network
    docker compose up -d > /dev/null 2>&1
}

# Function to stop containers
stop_containers() {
    rm -r bootstrap/
    docker compose down --volumes --remove-orphans > /dev/null 2>&1
    docker network rm anonymous-shard-network > /dev/null 2>&1
}

# Execute command
case "$ACTION" in
    generate)
        generate_docker_compose
        ;;
    start)
        start_containers
        ;;
    stop)
        stop_containers
        ;;
    *)
        echo "Unknown command."
        ;;
esac
