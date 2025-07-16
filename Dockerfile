# Edwards Group Holdings Website - Production Container
FROM nginx:alpine

# Set maintainer
LABEL maintainer="Edwards Group Holdings"
LABEL description="Static website for Edwards Group Holdings media company"

# Copy website files to nginx html directory
COPY . /usr/share/nginx/html/

# Copy custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for logs
RUN mkdir -p /var/log/nginx

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Remove unnecessary files from container
RUN rm -f /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/README.md \
    /usr/share/nginx/html/CLAUDE.md \
    /usr/share/nginx/html/.DS_Store \
    /usr/share/nginx/html/email_config.php \
    /usr/share/nginx/html/email_functions.php \
    /usr/share/nginx/html/load_env.php \
    /usr/share/nginx/html/simple_email.php

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]