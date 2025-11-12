# 🚀 QUICK START - Deploy Rahmat Grup to Production

**Read this first!** → Complete guide: [IMPLEMENTATION.md](IMPLEMENTATION.md)

---

## 5 Simple Steps (Total: ~45 minutes)

### Step 1: SSH to Server & Add Public Key (5 minutes)

```bash
# From your computer - display GitHub Actions public key
cat ~/.ssh/github-actions.pub

# Then SSH to server and add it
ssh root@103.126.116.175
mkdir -p ~/.ssh
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFb5TErvOzTwvv4+FML3/2tAkYgObjCJccmU2s9FLcBz github-actions-deployment' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Step 2: Run Deployment Script on Server (15 minutes)

```bash
# Still on server, run:
sudo curl -fsSL https://raw.githubusercontent.com/bagussundaru/Rahmat-Grup/main/scripts/deploy.sh | bash

# Wait for completion (should show green ✅)
```

### Step 3: Configure DNS (15 minutes)

1. **Domain Registrar:**
   - Update nameservers to: satu.neodns.id, dua.neodns.id
   
2. **Neodns Panel:**
   - Add A record: @ → 103.126.116.175
   - Add A record: www → 103.126.116.175

3. **Verify from computer:**
   ```bash
   dig +short rahmat-grup.web.id A
   # Should return: 103.126.116.175
   ```

### Step 4: Setup GitHub Actions (5 minutes)

Go to: https://github.com/bagussundaru/Rahmat-Grup/settings/secrets/actions

Add 3 repository secrets:

```
1. SERVER_HOST = 103.126.116.175
2. SERVER_USER = root
3. SERVER_SSH_KEY = (copy content of ~/.ssh/github-actions)
```

### Step 5: Test Application (5 minutes)

```bash
# From your computer, test:
curl -I https://rahmat-grup.web.id
# Should return: HTTP/2 200

# Then open in browser:
# https://rahmat-grup.web.id
```

---

## ✅ Final Checklist

- ☐ DNS resolves: `dig +short rahmat-grup.web.id A` → 103.126.116.175
- ☐ HTTPS works: `curl -I https://rahmat-grup.web.id` → HTTP/2 200
- ☐ App loads in browser: https://rahmat-grup.web.id
- ☐ All pages work (Dashboard, POS, Inventory, Products, Transactions)
- ☐ SSL certificate valid (Let's Encrypt)
- ☐ GitHub Actions secrets configured
- ☐ Server running: `sudo systemctl status nginx` → active (running)

---

## 📖 More Details

For complete details, timeouts, troubleshooting:
- Read: [IMPLEMENTATION.md](IMPLEMENTATION.md) (Indonesian - detailed)
- Read: [DEPLOYMENT.md](DEPLOYMENT.md) (English - technical)
- Read: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) (Step-by-step)

---

## 🆘 Quick Troubleshooting

**DNS not working?**
```bash
# Wait 15-30 mins, then check again
dig rahmat-grup.web.id @satu.neodns.id
```

**SSL error?**
```bash
# SSH to server
ssh root@103.126.116.175
sudo certbot certificates
sudo tail /var/log/nginx/rahmat-grup-error.log
```

**Application not loading?**
```bash
# Check if files deployed
ssh root@103.126.116.175
ls -la /var/www/rahmat-grup/dist/
```

**GitHub Actions failing?**
```bash
# Check logs at:
# https://github.com/bagussundaru/Rahmat-Grup/actions
# Common issue: Wrong SERVER_USER or SSH_KEY
```

---

**Next Step:** Follow [IMPLEMENTATION.md](IMPLEMENTATION.md) for complete guide!
