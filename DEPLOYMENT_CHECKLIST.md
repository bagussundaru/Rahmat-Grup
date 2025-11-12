# 🚀 Deployment Implementation Checklist

All deployment files have been **committed and pushed to GitHub**. 

Follow these steps to go live with your application at **rahmat-grup.web.id**.

---

## ✅ Step 1: DNS Configuration (15 mins)

### Update Nameservers

1. Log into your domain registrar (where you bought rahmat-grup.web.id)
2. Go to **Domain Settings** → **Nameservers**
3. Replace existing nameservers with:
   - **Nameserver 1:** satu.neodns.id
   - **Nameserver 2:** dua.neodns.id
4. Save and wait for confirmation

### Add DNS Records

1. Log into [Neodns Panel](https://neodns.id)
2. Select your domain: `rahmat-grup.web.id`
3. Create **A records:**

   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | A | @ | 103.126.116.175 | 3600 |
   | A | www | 103.126.116.175 | 3600 |

4. Save and wait for propagation (usually 15-30 minutes, up to 48 hours)

### Verify DNS

```bash
# On your computer (not the server)
dig +short rahmat-grup.web.id A
# Should return: 103.126.116.175
```

---

## ✅ Step 2: Server Setup (10-15 mins)

### Option A: Automated Setup (Recommended)

SSH to your server and run the automated deployment script:

```bash
ssh username@103.126.116.175

# Run automated setup (handles everything)
sudo curl -fsSL https://raw.githubusercontent.com/bagussundaru/Rahmat-Grup/main/scripts/deploy.sh | bash
```

This automatically:
- ✅ Installs dependencies (Node.js, Nginx, Certbot)
- ✅ Clones and builds the app
- ✅ Configures Nginx (SPA routing, caching, security)
- ✅ Sets up SSL with Let's Encrypt
- ✅ Configures firewall (UFW)
- ✅ Tests and verifies everything

**Expected output:** ✅ All steps completed successfully

### Option B: Manual Setup

If you prefer manual control, follow the detailed steps in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## ✅ Step 3: GitHub Actions Secrets (5 mins)

To enable **automatic deployments** (app updates automatically when you push to GitHub):

1. Go to your GitHub repo: https://github.com/bagussundaru/Rahmat-Grup
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these three:

### Secret 1: SERVER_HOST
```
Name: SERVER_HOST
Value: 103.126.116.175
```

### Secret 2: SERVER_USER
```
Name: SERVER_USER
Value: (your SSH username on the server)
```

### Secret 3: SERVER_SSH_KEY
```
Name: SERVER_SSH_KEY
Value: (paste your private SSH key)
```

**How to get your SSH key:**

If you already have an SSH key:
```bash
cat ~/.ssh/id_rsa
```

If you don't have one, create it:
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
cat ~/.ssh/id_rsa
```

Then add the public key to the server:
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub username@103.126.116.175
```

---

## ✅ Step 4: Verify Deployment (5 mins)

### Check Application Status

```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check DNS
dig rahmat-grup.web.id

# Test application (from your computer)
curl -I https://rahmat-grup.web.id
# Should return: HTTP/2 200
```

### Open in Browser

Visit: https://rahmat-grup.web.id

You should see your Rahmat Grup POS application loaded!

---

## 🔄 Step 5: Automated Deployments (Optional)

Once GitHub Actions secrets are configured, your app will **automatically deploy** when you push to `main`:

```bash
# Make a change locally
echo "# Updated" >> README.md
git add README.md
git commit -m "Update README"
git push origin main

# GitHub Actions will:
# 1. Build the app
# 2. Deploy to 103.126.116.175
# 3. Create a backup
# 4. Reload Nginx
# 5. Verify everything works
```

Watch progress at: https://github.com/bagussundaru/Rahmat-Grup/actions

---

## 📊 Timeline

| Step | Time | Status |
|------|------|--------|
| DNS Setup | 15 mins | ⏳ Do this first |
| Server Setup | 10-15 mins | ⏳ After DNS propagates |
| GitHub Secrets | 5 mins | ⏳ After server is ready |
| Verification | 5 mins | ⏳ Test in browser |
| **Total** | **35-40 mins** | ✅ Done! |

---

## 🆘 Troubleshooting

### DNS Not Resolving

```bash
# Wait and check again
dig rahmat-grup.web.id @satu.neodns.id
dig rahmat-grup.web.id @dua.neodns.id

# Use DNS checker: https://www.whatsmydns.net/?d=rahmat-grup.web.id
```

### Server Issues

```bash
# SSH and check logs
ssh username@103.126.116.175
sudo tail -50 /var/log/nginx/rahmat-grup-error.log
sudo systemctl status nginx
```

### SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### GitHub Actions Failing

1. Check workflow logs: https://github.com/bagussundaru/Rahmat-Grup/actions
2. Verify secrets are set correctly: Settings → Secrets
3. Ensure SSH key has access to server: `ssh -i ~/.ssh/id_rsa username@103.126.116.175`

---

## 📚 Documentation

- **Full Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **GitHub Actions Workflow:** [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- **Automated Deploy Script:** [scripts/deploy.sh](scripts/deploy.sh)
- **Main README:** [README.md](README.md)

---

## ✨ What You Get

✅ **HTTPS/SSL** - Auto-issued by Let's Encrypt, auto-renews  
✅ **SPA Routing** - Nginx configured for React Router  
✅ **Caching** - 1-year cache for static assets  
✅ **Compression** - Gzip enabled for smaller downloads  
✅ **Security** - HSTS, X-Frame-Options, Content-Type headers  
✅ **Backups** - Automatic backup before each deployment  
✅ **CI/CD** - GitHub Actions auto-deploy on push  
✅ **Firewall** - UFW configured (ports 22, 80, 443)  

---

## 🎯 Next Actions

1. ✅ **Already Done:** Deployment files committed to GitHub
2. 📋 **To Do:** Update DNS nameservers (15 mins)
3. 📋 **To Do:** Run server deployment script (10-15 mins)
4. 📋 **To Do:** Add GitHub Actions secrets (5 mins)
5. 📋 **To Do:** Visit https://rahmat-grup.web.id in browser

---

**Ready to go live? Start with Step 1 above!** 🚀

For questions or issues, refer to [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting.
