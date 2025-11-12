#!/bin/bash

################################################################################
# RAHMAT GRUP - COMPLETE DEPLOYMENT GUIDE
# Run this guide to complete the full deployment
################################################################################

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║          RAHMAT GRUP - COMPLETE DEPLOYMENT IMPLEMENTATION                 ║"
echo "║                      Domain: rahmat-grup.web.id                           ║"
echo "║                      Server IP: 103.126.116.175                           ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
DOMAIN="rahmat-grup.web.id"
SERVER_IP="103.126.116.175"
SSH_KEY_PATH="$HOME/.ssh/github-actions"
SSH_PUB_KEY_PATH="$HOME/.ssh/github-actions.pub"

echo "📋 DEPLOYMENT CHECKLIST"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""

# Step 1: Verify SSH keys exist
echo "✓ STEP 1: SSH Key Generation"
echo "  Status: SSH keys already generated"
echo "  Location: $SSH_KEY_PATH"
if [ -f "$SSH_KEY_PATH" ]; then
    echo "  ✅ Private key exists"
else
    echo "  ❌ Private key missing"
fi

if [ -f "$SSH_PUB_KEY_PATH" ]; then
    echo "  ✅ Public key exists"
else
    echo "  ❌ Public key missing"
fi
echo ""

# Step 2: Display important information
echo "✓ STEP 2: Important Information"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📌 GitHub Actions Secrets to Add:"
echo "   Location: https://github.com/bagussundaru/Rahmat-Grup/settings/secrets/actions"
echo ""
echo "   1️⃣  SECRET NAME: SERVER_HOST"
echo "      VALUE: $SERVER_IP"
echo ""
echo "   2️⃣  SECRET NAME: SERVER_USER"
echo "      VALUE: (your SSH username on server, e.g., 'root' or 'ubuntu')"
echo ""
echo "   3️⃣  SECRET NAME: SERVER_SSH_KEY"
echo "      VALUE: (copy content below)"
echo "      ┌────────────────────────────────────────────────────────────────┐"

cat "$SSH_KEY_PATH" | sed 's/^/      │ /'

echo "      │                                                                │"
echo "      └────────────────────────────────────────────────────────────────┘"
echo ""

# Step 3: SSH connection instructions
echo "✓ STEP 3: Connect to Server & Add Public Key"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "Run these commands on your server:"
echo ""
echo "  1. SSH to your server:"
echo "     ssh username@$SERVER_IP"
echo ""
echo "  2. Add GitHub Actions public key to authorized_keys:"
echo "     echo '$(cat $SSH_PUB_KEY_PATH)' >> ~/.ssh/authorized_keys"
echo ""
echo "  3. Verify permissions:"
echo "     chmod 600 ~/.ssh/authorized_keys"
echo "     chmod 700 ~/.ssh"
echo ""

# Step 4: Run deployment script
echo "✓ STEP 4: Run Automated Deployment Script"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "On the server, run:"
echo ""
echo "  sudo curl -fsSL https://raw.githubusercontent.com/bagussundaru/Rahmat-Grup/main/scripts/deploy.sh | bash"
echo ""
echo "This will:"
echo "  ✅ Update system packages"
echo "  ✅ Install Node.js 20 LTS"
echo "  ✅ Clone and build Rahmat Grup app"
echo "  ✅ Configure Nginx (SPA routing, caching, security)"
echo "  ✅ Setup Let's Encrypt SSL certificate"
echo "  ✅ Configure firewall (UFW)"
echo "  ✅ Setup auto-renewal for SSL"
echo "  ✅ Verify everything works"
echo ""

# Step 5: DNS configuration
echo "✓ STEP 5: Configure DNS"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "In your domain registrar and Neodns panel:"
echo ""
echo "  1. Update nameservers to:"
echo "     - satu.neodns.id"
echo "     - dua.neodns.id"
echo ""
echo "  2. In Neodns, create A records:"
echo "     - Host: @    → Value: $SERVER_IP"
echo "     - Host: www  → Value: $SERVER_IP"
echo ""
echo "  3. Verify DNS (from your computer):"
echo "     dig +short $DOMAIN A"
echo ""

# Step 6: Summary
echo "✓ STEP 6: What Happens Next"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "After adding GitHub Actions secrets and pushing code:"
echo ""
echo "  1. GitHub Actions automatically triggers a build"
echo "  2. App is built in production mode"
echo "  3. Code is deployed to your server via SSH"
echo "  4. Nginx is restarted to serve new version"
echo "  5. Application goes live at https://$DOMAIN"
echo ""

# Step 7: Verification
echo "✓ STEP 7: Verify Deployment"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "After everything is deployed, verify:"
echo ""
echo "  1. Check application:"
echo "     curl -I https://$DOMAIN"
echo "     (Should return HTTP/2 200)"
echo ""
echo "  2. Check SSL certificate:"
echo "     openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null | grep -A 2 'Issuer:'"
echo "     (Should show Let's Encrypt)"
echo ""
echo "  3. Visit in browser:"
echo "     https://$DOMAIN"
echo ""

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                        📋 NEXT ACTIONS                                     ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                            ║"
echo "║  1️⃣  SSH to server and add GitHub Actions public key                      ║"
echo "║  2️⃣  Run deployment script on server                                      ║"
echo "║  3️⃣  Add GitHub Actions secrets                                           ║"
echo "║  4️⃣  Configure DNS (nameservers + A records)                              ║"
echo "║  5️⃣  Verify application at https://$DOMAIN                  ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "For detailed help, see:"
echo "  - DEPLOYMENT_CHECKLIST.md"
echo "  - DEPLOYMENT.md"
echo ""
