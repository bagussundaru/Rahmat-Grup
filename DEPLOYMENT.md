# Rahmat Grup - Deployment Guide

Complete guide for deploying the Rahmat Grup application to production.

## Quick Start

### Option 1: Automated Deployment (Recommended)

Run the automated deployment script on your server:

```bash
# SSH into your server
ssh username@103.126.116.175

# Download and run the deployment script
sudo curl -fsSL https://raw.githubusercontent.com/bagussundaru/Rahmat-Grup/main/scripts/deploy.sh | bash
```

This script handles everything:
- ✅ System updates and dependencies
- ✅ Node.js installation
- ✅ Repository cloning and app build
- ✅ Nginx configuration
- ✅ Firewall setup (UFW)
- ✅ SSL certificate (Let's Encrypt)
- ✅ Auto-renewal configuration
- ✅ Verification and testing

### Option 2: Manual Deployment

Follow the steps below if you prefer manual control.

---

## Prerequisites

- Server: Ubuntu 20.04 LTS or Debian 11+
- Domain: rahmat-grup.web.id (with nameservers configured)
- Server IP: 103.126.116.175
- SSH access with sudo privileges

---

## Step 1: DNS Configuration

### 1.1 Update Nameservers at Your Registrar

1. Log into your domain registrar (where you purchased rahmat-grup.web.id)
2. Navigate to "Domain Management" or "Nameservers" settings
3. Update nameservers to:
   - **Nameserver 1:** satu.neodns.id
   - **Nameserver 2:** dua.neodns.id
4. Save changes and wait for propagation (usually 15-30 minutes)

### 1.2 Add DNS Records in Neodns Panel

1. Log into [Neodns control panel](https://neodns.id)
2. Select your domain: `rahmat-grup.web.id`
3. Create these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 103.126.116.175 | 3600 |
| A | www | 103.126.116.175 | 3600 |

### 1.3 Verify DNS Resolution

```bash
# On your computer (not server), check if DNS is working
dig +short rahmat-grup.web.id A
# Should return: 103.126.116.175

dig +short www.rahmat-grup.web.id A
# Should return: 103.126.116.175
```

**Note:** DNS propagation can take up to 24-48 hours globally, but usually faster.

---

## Step 2: SSH Access and Initial Setup

### 2.1 Connect to Server

```bash
ssh username@103.126.116.175
```

### 2.2 Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2.3 Install Essential Packages

```bash
sudo apt install -y \
  curl \
  git \
  build-essential \
  nginx \
  certbot \
  python3-certbot-nginx \
  ufw
```

---

## Step 3: Node.js Installation

### 3.1 Install Node.js 20 LTS

```bash
# Add Node.js repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x
```

---

## Step 4: Clone and Build Application

### 4.1 Prepare Deployment Directory

```bash
# Create deployment directory
sudo mkdir -p /var/www/rahmat-grup
sudo chown $USER:$USER /var/www/rahmat-grup

cd /var/www/rahmat-grup
```

### 4.2 Clone Repository

```bash
git clone https://github.com/bagussundaru/Rahmat-Grup.git source
cd source
```

### 4.3 Build Application

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Verify build output
ls -la dist/
```

### 4.4 Copy Built Files to Web Root

```bash
# Copy dist folder to web root
cp -r dist /var/www/rahmat-grup/dist

# Set proper permissions
sudo chown -R www-data:www-data /var/www/rahmat-grup/dist
sudo chmod -R 755 /var/www/rahmat-grup/dist
```

---

## Step 5: Configure Nginx

### 5.1 Create Nginx Server Block

Create `/etc/nginx/sites-available/rahmat-grup`:

```bash
sudo nano /etc/nginx/sites-available/rahmat-grup
```

Paste the following configuration:

```nginx
# HTTP server - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name rahmat-grup.web.id www.rahmat-grup.web.id;

    # Allow Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rahmat-grup.web.id www.rahmat-grup.web.id;

    root /var/www/rahmat-grup/dist;
    index index.html;

    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/rahmat-grup.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rahmat-grup.web.id/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript;
    gzip_min_length 256;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA routing - send all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Logs
    access_log /var/log/nginx/rahmat-grup-access.log;
    error_log /var/log/nginx/rahmat-grup-error.log warn;
}
```

### 5.2 Enable Site and Test

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/rahmat-grup /etc/nginx/sites-enabled/rahmat-grup

# Remove default site if present
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5.3 Start Nginx

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx  # Enable on boot
sudo systemctl status nginx  # Check status
```

---

## Step 6: Firewall Configuration

### 6.1 Configure UFW (if not already configured)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status numbered
```

---

## Step 7: SSL Certificate Setup (Let's Encrypt)

### 7.1 Obtain Certificate with Certbot

```bash
# Create directory for Let's Encrypt validation
sudo mkdir -p /var/www/certbot
sudo chown www-data:www-data /var/www/certbot

# Request certificate
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d rahmat-grup.web.id \
  -d www.rahmat-grup.web.id \
  --agree-tos \
  --no-eff-email \
  -m admin@rahmat-grup.web.id \
  --non-interactive
```

### 7.2 Verify Certificate

```bash
# List certificates
sudo certbot certificates

# Expected output should show:
# - Certificate Name: rahmat-grup.web.id
# - Domains: rahmat-grup.web.id, www.rahmat-grup.web.id
# - Path: /etc/letsencrypt/live/rahmat-grup.web.id/fullchain.pem
```

### 7.3 Reload Nginx with SSL

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 7.4 Test SSL/TLS

```bash
# Test certificate validity
curl -I https://rahmat-grup.web.id

# Expected: HTTP/2 200
```

---

## Step 8: Auto-Renewal Configuration

### 8.1 Test Auto-Renewal (Dry Run)

```bash
sudo certbot renew --dry-run
```

### 8.2 Enable Auto-Renewal

```bash
# Enable Certbot timer for automatic renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check timer status
sudo systemctl status certbot.timer
```

---

## Step 9: Verification and Testing

### 9.1 Test Application Access

```bash
# Check from your computer
curl -I https://rahmat-grup.web.id
curl -I https://www.rahmat-grup.web.id

# Expected: HTTP/2 200
```

### 9.2 Check Logs

```bash
# View Nginx error logs
sudo tail -f /var/log/nginx/rahmat-grup-error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/rahmat-grup-access.log

# View system logs
sudo journalctl -u nginx -f
```

### 9.3 Performance Check

```bash
# Check SSL rating
curl -I --silent https://rahmat-grup.web.id | head -20

# Check certificate expiry
echo | openssl s_client -servername rahmat-grup.web.id -connect rahmat-grup.web.id:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Step 10: Set Up GitHub Actions for Auto-Deploy

### 10.1 Generate SSH Key (on your computer)

```bash
# Generate SSH key for GitHub Actions (no passphrase!)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github-actions -N ""

# Display private key (needed for GitHub secret)
cat ~/.ssh/github-actions
```

### 10.2 Add SSH Key to Server

```bash
# On server, add public key to authorized_keys
echo "$(cat ~/.ssh/github-actions.pub)" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 10.3 Add GitHub Secrets

1. Go to: https://github.com/bagussundaru/Rahmat-Grup/settings/secrets/actions
2. Click "New repository secret" and add:

| Name | Value |
|------|-------|
| `SERVER_HOST` | `103.126.116.175` |
| `SERVER_USER` | Your SSH username |
| `SERVER_SSH_KEY` | Content of `~/.ssh/github-actions` (private key) |

### 10.4 Verify Workflow

The workflow file is already in `.github/workflows/deploy.yml`. It will:
- Trigger on every push to `main` branch
- Build the application
- Deploy to your server via SSH
- Create backups before deployment

To test:
```bash
# Make a small change and push to main
git add .
git commit -m "test deployment"
git push origin main

# Check workflow status at:
# https://github.com/bagussundaru/Rahmat-Grup/actions
```

---

## Useful Commands

### Daily Operations

```bash
# View Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -100 /var/log/nginx/rahmat-grup-error.log

# View access logs
sudo tail -100 /var/log/nginx/rahmat-grup-access.log

# Reload Nginx (after config changes)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check SSL certificate status
sudo certbot certificates

# Check upcoming renewal
sudo certbot renew --dry-run

# Manually renew certificate
sudo certbot renew --force-renewal
```

### Updating Application (Manual)

```bash
cd /var/www/rahmat-grup/source
git fetch origin
git reset --hard origin/main
npm ci
npm run build

# Backup current version
cp -r /var/www/rahmat-grup/dist /var/www/rahmat-grup/dist.bak.$(date +%s)

# Deploy new version
cp -r dist /var/www/rahmat-grup/dist
sudo chown -R www-data:www-data /var/www/rahmat-grup/dist
sudo systemctl reload nginx
```

### Monitor Server

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Monitor processes
htop

# Check open ports
sudo ss -tulpn | grep LISTEN
```

---

## Troubleshooting

### DNS not resolving

```bash
# Check DNS from your computer
dig rahmat-grup.web.id @satu.neodns.id
dig rahmat-grup.web.id @dua.neodns.id

# Wait for propagation (can take 24-48 hours)
# Check with: https://www.whatsmydns.net/?d=rahmat-grup.web.id
```

### SSL Certificate Issues

```bash
# Check certificate validity
sudo certbot certificates

# View certificate details
echo | openssl s_client -servername rahmat-grup.web.id -connect rahmat-grup.web.id:443 2>/dev/null | openssl x509 -text -noout

# Force renewal
sudo certbot renew --force-renewal
```

### Nginx Configuration Issues

```bash
# Test configuration
sudo nginx -t

# View error logs
sudo tail -50 /var/log/nginx/rahmat-grup-error.log

# Check if port 80/443 are in use
sudo lsof -i :80
sudo lsof -i :443
```

### Application Not Loading

```bash
# Check if dist folder exists
ls -la /var/www/rahmat-grup/dist

# Check Nginx is serving the right path
curl -v https://rahmat-grup.web.id 2>&1 | grep -i "root\|location"

# Check file permissions
sudo ls -la /var/www/rahmat-grup/dist/
```

---

## Security Best Practices

1. ✅ **Keep system updated**: `sudo apt update && sudo apt upgrade -y`
2. ✅ **Use strong SSH key**: 4096-bit RSA or Ed25519
3. ✅ **Firewall enabled**: Only allow necessary ports (22, 80, 443)
4. ✅ **SSL/TLS enabled**: Force HTTPS everywhere
5. ✅ **Regular backups**: Backup database and config files
6. ✅ **Monitor logs**: Check for suspicious activity
7. ✅ **Keep dependencies updated**: Regular npm/Node.js updates

---

## Support

For issues or questions:

1. Check Nginx error logs: `sudo tail -f /var/log/nginx/rahmat-grup-error.log`
2. Verify DNS: `dig rahmat-grup.web.id`
3. Test SSL: `curl -I https://rahmat-grup.web.id`
4. Check GitHub Actions: https://github.com/bagussundaru/Rahmat-Grup/actions

---

**Last Updated:** November 12, 2025  
**Application:** Rahmat Grup POS System  
**Version:** 0.1.0
