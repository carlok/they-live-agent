#!/bin/bash
if [ "$USE_EXTERNAL_CERT" = "true" ]; then
    echo "Using external certificate from Let's Encrypt..."
    # In production, ensure nginx is configured to point to /etc/letsencrypt/live/...
    # For this script we assume nginx.conf has been updated for production.
else
    mkdir -p /etc/nginx/ssl
    if [ ! -f /etc/nginx/ssl/nginx.key ]; then
        echo "Generating self-signed certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/nginx/ssl/nginx.key \
            -out /etc/nginx/ssl/nginx.crt \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    fi
fi

exec nginx -g "daemon off;"
