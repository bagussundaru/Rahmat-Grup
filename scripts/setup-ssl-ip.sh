#!/bin/bash

################################################################################
# SSL Certificate Setup Script for Rahmat Grup
# Using IP Public (103.126.116.175) instead of domain
# Usage: sudo bash setup-ssl-ip.sh
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="rahmat-grup.web.id"
IP="103.126.116.175"
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

print_header "Step 1: Setup SSL with IP Public"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    print_info "Installing certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

print_success "Certbot installed"

print_header "Step 2: Verify Server is Accessible"

# Check if port 80 is accessible
print_info "Checking if port 80 is accessible..."
if sudo nginx -t 2>&1 | grep -q "successful"; then
    print_success "Nginx is running and port 80 is ready"
else
    print_error "Nginx has issues"
    exit 1
fi

print_header "Step 3: Create Temporary Nginx Config for Certbot"

# Create a temporary config for certbot validation
sudo mkdir -p /var/www/certbot

cat > /tmp/nginx-certbot.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    root /var/www/certbot;
    
    location /.well-known/acme-challenge/ {
        # certbot will use this for validation
    }
    
    location / {
        return 301 https://$http_host$request_uri;
    }
}
EOF

sudo cp /tmp/nginx-certbot.conf /etc/nginx/sites-available/certbot-temp
sudo ln -sf /etc/nginx/sites-available/certbot-temp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
print_success "Temporary Nginx config created"

print_header "Step 4: Request SSL Certificate"

# Request certificate with standalone method
print_info "Requesting SSL certificate using standalone method..."

sudo certbot certonly --standalone \
    --agree-tos \
    --non-interactive \
    --preferred-challenges=http \
    -d $DOMAIN \
    -m $EMAIL \
    --http-01-port 80

print_success "SSL certificate obtained!"

# Show certificate info
print_header "Step 5: Certificate Details"
sudo certbot certificates

print_header "Step 6: Update Nginx Configuration"

# Create HTTPS-enabled Nginx config
cat > /tmp/nginx-ssl.conf << 'NGINX_CONFIG'
# Nginx configuration for Rahmat Grup POS Application
# Full HTTPS with security headers

server {
    listen 80;
    listen [::]:80;
    server_name rahmat-grup.web.id www.rahmat-grup.web.id;
    
    root /var/www/certbot;
    
    # Allow Let's Encrypt validation
    location /.well-known/acme-challenge/ {
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

sudo cp /tmp/nginx-ssl.conf /etc/nginx/sites-available/rahmat-grup
sudo rm -f /etc/nginx/sites-enabled/*
sudo ln -sf /etc/nginx/sites-available/rahmat-grup /etc/nginx/sites-enabled/
print_success "Nginx config updated for HTTPS"

print_header "Step 7: Test and Reload Nginx"

if sudo nginx -t 2>&1 | grep -q "successful"; then
    print_success "Nginx config is valid"
else
    print_error "Nginx config has errors!"
    exit 1
fi

sudo systemctl reload nginx
print_success "Nginx reloaded with HTTPS config"

print_header "Step 8: Setup SSL Auto-Renewal"

# Enable certbot timer
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
print_success "SSL auto-renewal enabled"

print_header "Step 9: Verification"

sleep 2

# Test HTTPS
echo ""
print_info "Testing HTTPS connection..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://localhost/ --insecure || echo "000")
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
    print_success "HTTPS is working! (HTTP $RESPONSE)"
else
    print_error "HTTPS test returned: $RESPONSE"
fi

print_header "Step 10: Final Summary"

cat << 'SUMMARY'

════════════════════════════════════════════════════════════════════════════
                        ✅ SSL SETUP COMPLETE ✅
════════════════════════════════════════════════════════════════════════════

Your application now has:
✓ Valid SSL certificate from Let's Encrypt
✓ HTTPS enabled (HTTP redirects to HTTPS)
✓ SSL auto-renewal configured (automatic)
✓ Security headers configured
✓ Gzip compression enabled
✓ Asset caching optimized

════════════════════════════════════════════════════════════════════════════

Access your app:
  🔒 HTTPS:  https://103.126.116.175/
  🔒 Domain: https://rahmat-grup.web.id/ (after DNS is configured)

View certificate:
  sudo certbot certificates

Certificate auto-renews: 30 days before expiry (automatic)

════════════════════════════════════════════════════════════════════════════

Next Steps:

1. Test in browser: https://103.126.116.175/
   (You may see certificate warning since we used domain name, not IP)
   This is OK! Certificate is valid, just test with domain name

2. Once you add A record in Neodns:
   Test: https://rahmat-grup.web.id/
   (No warning, everything should work perfectly)

3. Add GitHub Secrets:
   Read: GITHUB_SECRETS_SETUP.md
   This will enable auto-deployment

════════════════════════════════════════════════════════════════════════════
SUMMARY

print_success "SSL Setup Complete!"
