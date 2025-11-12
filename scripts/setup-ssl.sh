#!/bin/bash

################################################################################
# SSL Certificate Setup Script for Rahmat Grup
# Run this AFTER DNS is properly configured
# Usage: sudo bash setup-ssl.sh
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="rahmat-grup.web.id"
WWW_DOMAIN="www.rahmat-grup.web.id"
EMAIL="admin@rahmat-grup.web.id"

print_header() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}======================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_header "Step 1: Verify DNS Resolution"

# Check if domain resolves
RESOLVED_IP=$(dig +short $DOMAIN A | head -1)
if [ -z "$RESOLVED_IP" ]; then
    print_error "DNS is not resolving! Please configure DNS first."
    print_info "Run: dig +short $DOMAIN A"
    exit 1
fi

if [ "$RESOLVED_IP" != "103.126.116.175" ]; then
    print_error "DNS resolves to $RESOLVED_IP but should be 103.126.116.175"
    exit 1
fi

print_success "DNS correctly resolves to 103.126.116.175"

print_header "Step 2: Setup Let's Encrypt Certificate"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    print_info "Installing certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

print_info "Requesting SSL certificate for $DOMAIN and $WWW_DOMAIN..."

# Request certificate
certbot certonly --nginx \
    --agree-tos \
    --non-interactive \
    --preferred-challenges=http \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    -m $EMAIL

print_success "SSL certificate obtained!"

print_header "Step 3: Update Nginx Configuration for HTTPS"

# Create HTTPS-enabled Nginx config
cat > /etc/nginx/sites-available/rahmat-grup << 'NGINX_CONFIG'
# Nginx configuration for Rahmat Grup POS Application
# Full HTTPS with security headers

upstream app_backend {
    server localhost:3000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name rahmat-grup.web.id www.rahmat-grup.web.id;
    
    # Allow Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all other requests to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rahmat-grup.web.id www.rahmat-grup.web.id;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/rahmat-grup.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rahmat-grup.web.id/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/rahmat-grup.web.id/chain.pem;
    
    # Root directory
    root /var/www/rahmat-grup/dist;
    index index.html;
    
    # Logging
    access_log /var/log/nginx/rahmat-grup-access.log;
    error_log /var/log/nginx/rahmat-grup-error.log;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # CSP Header
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript image/svg+xml;
    gzip_disable "msie6";
    
    # Cache Control
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }
    
    # React Router - Fallback to index.html for SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Deny access to backup files
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Deny access to version control directories
    location ~ /\.(git|svn|hg|bzr)(/|$) {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINX_CONFIG

print_success "Nginx config updated"

print_header "Step 4: Test and Reload Nginx"

# Test config
if sudo nginx -t; then
    print_success "Nginx config is valid"
else
    print_error "Nginx config has errors!"
    exit 1
fi

# Reload nginx
sudo systemctl reload nginx
print_success "Nginx reloaded"

print_header "Step 5: Setup SSL Auto-Renewal"

# Enable certbot timer
systemctl enable certbot.timer
systemctl start certbot.timer

print_success "SSL auto-renewal enabled"

print_header "Step 6: Verification"

# Check certificate
echo ""
print_info "Certificate Details:"
certbot certificates

echo ""
print_success "SSL Setup Complete!"

cat << 'EOF'

════════════════════════════════════════════════════════════════════════════
                        ✅ SSL SETUP COMPLETE ✅
════════════════════════════════════════════════════════════════════════════

Your application is now:
✓ Accessible at: https://rahmat-grup.web.id
✓ Protected with valid SSL certificate
✓ HTTP automatically redirects to HTTPS
✓ SSL auto-renews 30 days before expiry
✓ Security headers configured
✓ Gzip compression enabled
✓ Asset caching optimized

════════════════════════════════════════════════════════════════════════════

Next Steps:

1. Test in your browser:
   https://rahmat-grup.web.id

2. Setup GitHub Actions secrets (I will provide instructions)

3. Push code to trigger auto-deployment

════════════════════════════════════════════════════════════════════════════
EOF
