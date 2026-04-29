FROM nginx:alpine

# Install openssl for cert generation
RUN apk add --no-cache openssl bash

# Add a script to generate cert and start nginx
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy config and web files
COPY nginx.internal.conf /etc/nginx/conf.d/default.conf
COPY web_app /usr/share/nginx/html

EXPOSE 443

CMD ["/entrypoint.sh"]
