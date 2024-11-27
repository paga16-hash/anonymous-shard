FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y tor && \
    mkdir -p /var/lib/tor/hidden_service && \
    chmod 700 /var/lib/tor/hidden_service

# Add a custom torrc file
COPY torrc /etc/tor/torrc

CMD ["tor", "-f", "/etc/tor/torrc"]