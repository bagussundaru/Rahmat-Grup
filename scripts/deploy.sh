#!/bin/bash

################################################################################
# Automated Deployment Script for Rahmat Grup App
# This script handles: dependencies, build, Nginx config, SSL, and initial setup
# Run on: Ubuntu/Debian server (as root or with sudo)
################################################################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="rahmat-grup.web.id"
WWW_DOMAIN="www.rahmat-grup.web.id"
DEPLOY_DIR="/var/www/rahmat-grup"
SOURCE_DIR="$DEPLOY_DIR/source"
WEB_USER="www-data"
WEB_GROUP="www-data"
GITHUB_REPO="https://github.com/bagussundaru/Rahmat-Grup.git"
NODE_VERSION="20"

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "${BLUE}===================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root or with sudo"
        exit 1
    fi
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        return 1
    fi
    return 0
}

################################################################################
# Step 1: System Update and Prerequisites
################################################################################

setup_prerequisites() {
    print_header "Step 1: System Update & Prerequisites"
    
    print_info "Updating system packages..."
    apt update
    apt upgrade -y
    
    print_info "Installing essential packages..."
    apt install -y \
        curl \
        wget \
        git \
        build-essential \
        nginx \
        certbot \
        python3-certbot-nginx \
        htop \
        nano \
        unzip
    
    print_success "System packages installed"
}

################################################################################
# Step 2: Node.js Installation
################################################################################

setup_nodejs() {
    print_header "Step 2: Node.js Installation"
    
    if check_command node; then
        CURRENT_VERSION=$(node -v)
        print_info "Node.js is already installed: $CURRENT_VERSION"
        return 0
    fi
    
    print_info "Installing Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
    
    print_success "Node.js installed: $(node -v)"
    print_success "NPM installed: $(npm -v)"
}

################################################################################
# Step 3: Repository and Build
################################################################################

setup_repository() {
    print_header "Step 3: Clone Repository & Build Application"
    
    print_info "Creating deployment directory: $DEPLOY_DIR"
    mkdir -p "$DEPLOY_DIR"
    chown root:root "$DEPLOY_DIR"
    
    if [ -d "$SOURCE_DIR" ]; then
        print_info "Repository already exists, updating..."
        cd "$SOURCE_DIR"
        git fetch origin
        git reset --hard origin/main
    else
        print_info "Cloning repository..."
        git clone "$GITHUB_REPO" "$SOURCE_DIR"
    fi
    
    print_success "Repository ready at: $SOURCE_DIR"
    
    print_info "Installing npm dependencies..."
    cd "$SOURCE_DIR"
    npm ci
    
    print_info "Building application..."
    npm run build
    
    print_success "Application built successfully"
    
    # Copy dist to web root
    print_info "Preparing web files..."
    rm -rf "$DEPLOY_DIR/dist"
    cp -r "$SOURCE_DIR/dist" "$DEPLOY_DIR/dist"
    chown -R "$WEB_USER:$WEB_GROUP" "$DEPLOY_DIR/dist"
    chmod -R 755 "$DEPLOY_DIR/dist"
    
    print_success "Web files ready at: $DEPLOY_DIR/dist"
}

################################################################################
# Step 4: Nginx Configuration
################################################################################

configure_nginx() {
    print_header "Step 4: Nginx Configuration"
    
    # Disable default site
    if [ -L /etc/nginx/sites-enabled/default ]; then
        rm /etc/nginx/sites-enabled/default
        print_info "Removed default Nginx site"
    fi
    
    # Create site configuration
    cat > /etc/nginx/sites-available/rahmat-grup << 'NGINX_CONFIG'
# HTTP server block for Let's Encrypt validation and redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name rahmat-grup.web.id www.rahmat-grup.web.id;

    # Allow Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server block (will be updated by Certbot)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rahmat-grup.web.id www.rahmat-grup.web.id;

    # Root directory for static files
    root /var/www/rahmat-grup/dist;
    index index.html;

    # SSL certificates (Certbot will update these paths)
    ssl_certificate /etc/letsencrypt/live/rahmat-grup.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rahmat-grup.web.id/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
    gzip_min_length 256;
    gzip_vary on;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        try_files $uri =404;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Single Page Application: route all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Log files
    access_log /var/log/nginx/rahmat-grup-access.log;
    error_log /var/log/nginx/rahmat-grup-error.log warn;
}
NGINX_CONFIG

    # Create symlink to enable site
    if [ ! -L /etc/nginx/sites-enabled/rahmat-grup ]; then
        ln -s /etc/nginx/sites-available/rahmat-grup /etc/nginx/sites-enabled/rahmat-grup
    fi
    
    # Test Nginx configuration
    if nginx -t; then
        print_success "Nginx configuration is valid"
    else
        print_error "Nginx configuration test failed"
        return 1
    fi
    
    # Reload Nginx
    systemctl reload nginx
    print_success "Nginx reloaded"
}

################################################################################
# Step 5: Firewall Configuration
################################################################################

configure_firewall() {
    print_header "Step 5: Firewall Configuration"
    
    if ! check_command ufw; then
        print_warning "UFW not installed, skipping firewall configuration"
        return 0
    fi
    
    # Check if UFW is active
    if ufw status | grep -q "inactive"; then
        print_info "UFW is inactive, enabling..."
        echo "y" | ufw enable
    fi
    
    # Allow required ports
    print_info "Configuring firewall rules..."
    ufw allow 22/tcp comment "SSH"
    ufw allow 80/tcp comment "HTTP"
    ufw allow 443/tcp comment "HTTPS"
    
    print_success "Firewall configured"
    ufw status numbered
}

################################################################################
# Step 6: SSL Certificate Setup
################################################################################

setup_ssl() {
    print_header "Step 6: SSL Certificate Setup (Let's Encrypt)"
    
    # Check if certificate already exists
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        print_info "SSL certificate already exists for $DOMAIN"
        print_info "Certificate location: /etc/letsencrypt/live/$DOMAIN"
        return 0
    fi
    
    # Ensure www-data can access .well-known directory
    mkdir -p /var/www/certbot
    chown www-data:www-data /var/www/certbot
    
    print_info "Obtaining SSL certificate from Let's Encrypt..."
    certbot certonly --webroot \
        -w /var/www/certbot \
        -d "$DOMAIN" \
        -d "$WWW_DOMAIN" \
        --agree-tos \
        --no-eff-email \
        -m admin@${DOMAIN} \
        --non-interactive
    
    if [ $? -eq 0 ]; then
        print_success "SSL certificate obtained successfully"
        print_info "Certificate path: /etc/letsencrypt/live/$DOMAIN"
        
        # Reload Nginx with SSL
        nginx -t && systemctl reload nginx
        print_success "Nginx reloaded with SSL configuration"
    else
        print_error "Failed to obtain SSL certificate"
        print_warning "Please ensure your domain DNS is correctly configured"
        return 1
    fi
}

################################################################################
# Step 7: SSL Auto-Renewal
################################################################################

setup_ssl_renewal() {
    print_header "Step 7: SSL Auto-Renewal Configuration"
    
    print_info "Testing certificate renewal..."
    certbot renew --dry-run
    
    if [ $? -eq 0 ]; then
        print_success "Auto-renewal test passed"
        print_info "Certbot will automatically renew certificates 30 days before expiry"
    else
        print_warning "Auto-renewal test failed, but this may be normal for new certificates"
    fi
}

################################################################################
# Step 8: Verification
################################################################################

verify_deployment() {
    print_header "Step 8: Verification"
    
    print_info "Checking Nginx status..."
    systemctl is-active --quiet nginx && print_success "Nginx is running" || print_error "Nginx is not running"
    
    print_info "Checking file permissions..."
    if [ -d "$DEPLOY_DIR/dist" ]; then
        print_success "Web files directory exists"
        ls -la "$DEPLOY_DIR/dist" | head -5
    else
        print_error "Web files directory not found"
        return 1
    fi
    
    print_info "Checking DNS resolution..."
    if host "$DOMAIN" >/dev/null 2>&1; then
        print_success "Domain resolves: $(host -t A "$DOMAIN" | grep -oE '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')"
    else
        print_warning "Domain does not resolve yet (DNS may need time to propagate)"
    fi
    
    print_info "Checking SSL certificate..."
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        print_success "SSL certificate installed"
        certbot certificates
    else
        print_warning "SSL certificate not found"
    fi
}

################################################################################
# Step 9: Summary and Next Steps
################################################################################

print_summary() {
    print_header "Deployment Summary"
    
    cat << EOF

✅ Deployment completed successfully!

📌 Domain Information:
   - Primary: $DOMAIN
   - WWW: $WWW_DOMAIN
   - IP: $(curl -s https://ifconfig.me || echo "Unable to detect")

📁 Directory Structure:
   - Deploy root: $DEPLOY_DIR
   - Source code: $SOURCE_DIR
   - Web files: $DEPLOY_DIR/dist
   - Nginx config: /etc/nginx/sites-available/rahmat-grup

🔐 SSL Certificate:
   - Location: /etc/letsencrypt/live/$DOMAIN
   - Auto-renewal: Enabled via Certbot

🌐 Access Your Application:
   - HTTPS: https://$DOMAIN
   - HTTPS: https://$WWW_DOMAIN
   - HTTP will redirect to HTTPS

📋 Useful Commands:

   Check Nginx status:
   $ sudo systemctl status nginx

   View Nginx logs:
   $ sudo tail -f /var/log/nginx/rahmat-grup-error.log
   $ sudo tail -f /var/log/nginx/rahmat-grup-access.log

   Rebuild application:
   $ cd $SOURCE_DIR && npm run build && cp -r dist $DEPLOY_DIR/

   Check SSL certificate:
   $ sudo certbot certificates

   Renew SSL certificate (manual):
   $ sudo certbot renew

   Reload Nginx:
   $ sudo systemctl reload nginx

🔄 Automated Updates:
   This deployment uses GitHub Actions for automatic builds and deploys.
   Every push to 'main' branch will trigger a new deployment.

   GitHub Actions Setup:
   1. Go to: https://github.com/bagussundaru/Rahmat-Grup/settings/secrets/actions
   2. Add these repository secrets:
      - SERVER_HOST: 103.126.116.175
      - SERVER_USER: (your SSH username)
      - SERVER_SSH_KEY: (private SSH key content)

⚠️  Important Notes:
   - DNS may take 24-48 hours to fully propagate
   - Check DNS with: dig +short $DOMAIN
   - Monitor logs for any issues during first deployment

📞 Support:
   For issues or questions, check Nginx error logs and ensure:
   - Domain DNS points to server IP (103.126.116.175)
   - Firewall allows ports 80 and 443
   - SSL certificate is valid (check with: sudo certbot certificates)

EOF
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header "Rahmat Grup App - Automated Deployment Script"
    
    check_root
    
    # Execute setup steps
    setup_prerequisites
    setup_nodejs
    setup_repository
    configure_nginx
    configure_firewall
    setup_ssl
    setup_ssl_renewal
    verify_deployment
    print_summary
    
    print_success "All steps completed! Your application is ready to serve."
}

# Run main function
main "$@"
