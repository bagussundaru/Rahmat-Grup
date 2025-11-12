# 🚀 IMPLEMENTASI DEPLOYMENT LENGKAP - RAHMAT GRUP

**Status:** Semua file siap di GitHub ✅  
**Domain:** rahmat-grup.web.id  
**Server IP:** 103.126.116.175  
**Nameserver:** satu.neodns.id, dua.neodns.id  

---

## 📋 RINGKASAN IMPLEMENTATION

Dokumentasi ini akan memandu Anda melalui 5 langkah untuk membuat aplikasi **sempurna berjalan** di production dengan auto-deploy via GitHub Actions.

| # | Langkah | Waktu | Status |
|---|---------|-------|--------|
| 1️⃣ | SSH Key Setup | 2 menit | ✅ Sudah selesai |
| 2️⃣ | Server Deployment | 15 menit | ⏳ Tinggal eksekusi |
| 3️⃣ | DNS Configuration | 15 menit | ⏳ Tinggal eksekusi |
| 4️⃣ | GitHub Actions Setup | 5 menit | ⏳ Tinggal eksekusi |
| 5️⃣ | Verification & Testing | 10 menit | ⏳ Tinggal eksekusi |
| **Total** | | **~45 menit** | |

---

## ✅ LANGKAH 1: SSH Key (SUDAH SELESAI)

SSH keys sudah di-generate:

```bash
Private Key: ~/.ssh/github-actions
Public Key:  ~/.ssh/github-actions.pub
```

Lihat di file ini untuk melihat kunci:
```bash
cat ~/.ssh/github-actions.pub
# Output: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFb5TErvOzTwvv4+FML3/2tAkYgObjCJccmU2s9FLcBz
```

---

## ⏳ LANGKAH 2: Deploy ke Server (JALANKAN SEKARANG)

### 2.1 SSH ke Server

```bash
# Ganti 'root' dengan username Anda di server
ssh root@103.126.116.175

# Jika menggunakan Ubuntu dengan sudo:
# ssh ubuntu@103.126.116.175
```

Jika pertama kali SSH, mungkin akan diminta untuk accept host key.

### 2.2 Tambahkan GitHub Actions Public Key

Jalankan command ini **di server**:

```bash
mkdir -p ~/.ssh
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFb5TErvOzTwvv4+FML3/2tAkYgObjCJccmU2s9FLcBz github-actions-deployment' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 2.3 Jalankan Automated Deployment Script

**Masih di server**, jalankan:

```bash
sudo curl -fsSL https://raw.githubusercontent.com/bagussundaru/Rahmat-Grup/main/scripts/deploy.sh | bash
```

Script ini akan secara otomatis:

✅ Update system packages  
✅ Install Node.js 20 LTS  
✅ Clone repository Rahmat Grup  
✅ Install dependencies dan build aplikasi  
✅ Configure Nginx (SPA routing, caching, security headers)  
✅ Setup SSL Let's Encrypt (auto-renew)  
✅ Configure firewall (UFW)  
✅ Run verification tests  

**Expected output:**
```
✅ All steps completed! Your application is ready to serve.
App is live at: https://rahmat-grup.web.id
```

⏱️ **Expected time: ~15 menit**

---

## ⏳ LANGKAH 3: Konfigurasi DNS (JALANKAN SETELAH STEP 2)

### 3.1 Update Nameserver di Registrar

1. Login ke registrar domain Anda (tempat beli domain rahmat-grup.web.id)
2. Cari opsi "Nameservers" atau "Domain Management"
3. Replace existing nameserver dengan:

```
Nameserver 1: satu.neodns.id
Nameserver 2: dua.neodns.id
```

4. **SAVE** dan tunggu confirmation (biasanya instant-30 menit)

### 3.2 Tambah A Records di Neodns

1. Login ke [Neodns Panel](https://neodns.id)
2. Select domain: `rahmat-grup.web.id`
3. Add A Records:

```
Hostname: @        IP: 103.126.116.175   TTL: 3600
Hostname: www      IP: 103.126.116.175   TTL: 3600
```

4. SAVE

### 3.3 Verifikasi DNS (dari computer Anda, BUKAN server)

Tunggu 5-15 menit, lalu cek:

```bash
dig +short rahmat-grup.web.id A
# Harus return: 103.126.116.175

dig +short www.rahmat-grup.web.id A
# Harus return: 103.126.116.175
```

Jika belum, tunggu dan coba lagi. Maksimal 48 jam untuk propagasi.

---

## ⏳ LANGKAH 4: Setup GitHub Actions (JALANKAN SETELAH STEP 2)

Untuk enable auto-deploy, tambahkan secrets ke GitHub:

### 4.1 Open GitHub Secrets Settings

1. Go to: https://github.com/bagussundaru/Rahmat-Grup
2. Click: **Settings** (di top right)
3. Click: **Secrets and variables** → **Actions** (di left sidebar)
4. Click: **New repository secret** (hijau, top right)

### 4.2 Tambah Secret #1: SERVER_HOST

```
Name:  SERVER_HOST
Value: 103.126.116.175
```

Click "Add secret"

### 4.3 Tambah Secret #2: SERVER_USER

```
Name:  SERVER_USER
Value: root
```

(Atau sesuaikan dengan username SSH Anda: ubuntu, admin, etc)

Click "Add secret"

### 4.4 Tambah Secret #3: SERVER_SSH_KEY

```
Name:  SERVER_SSH_KEY
Value: (copy-paste isi dari ~/.ssh/github-actions - FULL FILE!)
```

Cara copy dari computer Anda:

```bash
cat ~/.ssh/github-actions
# Copy semua output, dari -----BEGIN sampai -----END
# Paste ke GitHub secret
```

**IMPORTANT:** Copy FULL private key, including `-----BEGIN OPENSSH PRIVATE KEY-----` dan `-----END OPENSSH PRIVATE KEY-----`

Click "Add secret"

### 4.5 Verify Secrets Added

Check di Settings → Secrets & variables → Actions

Harus ada 3 secrets:
```
✅ SERVER_HOST
✅ SERVER_USER
✅ SERVER_SSH_KEY
```

---

## ⏳ LANGKAH 5: Verification & Testing (JALANKAN SETELAH STEP 3 & 4)

### 5.1 Trigger First Auto-Deploy (Optional)

Agar GitHub Actions langsung deploy, buat perubahan kecil:

```bash
cd /home/clurut/rahmat-grup-updated
echo "# Deployed at $(date)" >> DEPLOYMENT_SUCCESS.md
git add DEPLOYMENT_SUCCESS.md
git commit -m "feat: mark deployment as successful"
git push origin main
```

GitHub Actions akan otomatis:
1. Build aplikasi
2. Deploy ke server (103.126.116.175)
3. Reload Nginx
4. Create backup

Check progress di: https://github.com/bagussundaru/Rahmat-Grup/actions

### 5.2 Verify Application Running

```bash
# Dari computer Anda (bukan server)
# Tunggu DNS propagate terlebih dahulu!

# Cek DNS resolved
dig +short rahmat-grup.web.id A
# Harus return: 103.126.116.175

# Cek HTTP status
curl -I https://rahmat-grup.web.id
# Harus return: HTTP/2 200

# Cek SSL certificate
echo | openssl s_client -connect rahmat-grup.web.id:443 -servername rahmat-grup.web.id 2>/dev/null | grep -A 2 "Issuer:"
# Harus show: CN = Let's Encrypt
```

### 5.3 Test di Browser

Open: **https://rahmat-grup.web.id**

Harus melihat:
- ✅ Aplikasi Rahmat Grup POS loaded
- ✅ HTTPS lock icon di address bar (hijau)
- ✅ Let's Encrypt certificate
- ✅ Semua halaman accessible (Dashboard, POS, Inventory, Products, Transactions)

### 5.4 Server Status Check

SSH ke server dan check:

```bash
ssh root@103.126.116.175

# Check Nginx running
sudo systemctl status nginx
# Output: active (running)

# Check SSL certificate
sudo certbot certificates
# Output: https://rahmat-grup.web.id
# Renewal date seharusnya 3 bulan ke depan

# Check logs (no errors)
sudo tail -20 /var/log/nginx/rahmat-grup-error.log
# Harus kosong atau tidak ada ERROR

# Check disk space
df -h /var/www/rahmat-grup
# Harus ada space yang cukup
```

---

## 📊 RINGKASAN COMMANDS (Copy-Paste Ready)

### Di Computer Anda - LANGKAH 1 (SSH Setup)

```bash
# 1. Display public SSH key (untuk Step 2.2)
cat ~/.ssh/github-actions.pub

# 2. Display private SSH key (untuk Step 4.4)
cat ~/.ssh/github-actions
```

### Di Server - LANGKAH 2 (Server Setup)

```bash
# 1. SSH ke server
ssh root@103.126.116.175

# 2. Add GitHub Actions public key
mkdir -p ~/.ssh
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFb5TErvOzTwvv4+FML3/2tAkYgObjCJccmU2s9FLcBz github-actions-deployment' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# 3. Run deployment script
sudo curl -fsSL https://raw.githubusercontent.com/bagussundaru/Rahmat-Grup/main/scripts/deploy.sh | bash
```

### Web Browser - LANGKAH 3 (DNS) & LANGKAH 4 (GitHub)

```
LANGKAH 3:
1. Registrar domain → Update nameserver ke satu.neodns.id, dua.neodns.id
2. Neodns panel → Add A records @ dan www → 103.126.116.175

LANGKAH 4:
1. GitHub → Settings → Secrets & variables → Actions
2. Add SECRET: SERVER_HOST = 103.126.116.175
3. Add SECRET: SERVER_USER = root
4. Add SECRET: SERVER_SSH_KEY = (paste private key)
```

### Di Computer - LANGKAH 5 (Verification)

```bash
# Verify DNS
dig +short rahmat-grup.web.id A

# Verify HTTPS
curl -I https://rahmat-grup.web.id

# Verify SSL cert
echo | openssl s_client -connect rahmat-grup.web.id:443 -servername rahmat-grup.web.id 2>/dev/null | grep "Issuer:"

# Open in browser
# https://rahmat-grup.web.id
```

---

## 🎯 TIMELINE EKSEKUSI YANG DISARANKAN

**Hari 1:**
- ✅ 09:00 - LANGKAH 2: SSH ke server & run deployment script (15 menit)
- ✅ 09:20 - LANGKAH 3: Update DNS nameservers (instant, tunggu propagate 5-30 menit)
- ✅ 09:30 - LANGKAH 4: Setup GitHub Actions secrets (5 menit)

**Hari 1 (sambil DNS propagate):**
- ✅ 09:35 - Trigger test deployment (push ke GitHub)
- ✅ 09:40 - Watch GitHub Actions build & deploy

**Hari 1 (setelah DNS ready, ~30 menit setelah Step 3):**
- ✅ 10:00 - LANGKAH 5: Verify everything works

**TOTAL TIME: ~50 menit untuk production go-live!**

---

## ✨ FINAL CHECKLIST

Sebelum menganggap selesai, verifikasi ini semua:

```bash
☐ DNS resolved: dig +short rahmat-grup.web.id A → 103.126.116.175
☐ HTTP Status: curl -I https://rahmat-grup.web.id → HTTP/2 200
☐ SSL Valid: Let's Encrypt certificate installed
☐ App Loads: https://rahmat-grup.web.id opens in browser
☐ Dashboard Page: Shows sales metrics
☐ POS Page: Shows product search & shopping cart
☐ Inventory Page: Shows inventory reports
☐ Products Page: Shows product management
☐ Transactions Page: Shows transaction history
☐ Nginx Running: sudo systemctl status nginx → active (running)
☐ No Errors: sudo tail /var/log/nginx/rahmat-grup-error.log → no errors
☐ Auto-Deploy Works: Push code → GitHub Actions triggers → deployed
☐ SSL Auto-Renew: sudo certbot certificates → shows next renewal date
```

---

## 🆘 TROUBLESHOOTING

### DNS tidak resolve

```bash
# Wait dan coba lagi
dig rahmat-grup.web.id @satu.neodns.id
dig rahmat-grup.web.id @dua.neodns.id

# Check global DNS
# https://www.whatsmydns.net/?d=rahmat-grup.web.id
```

### SSL certificate error

```bash
# SSH ke server
ssh root@103.126.116.175

# Check certificate details
sudo certbot certificates

# Check Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check logs
sudo tail -50 /var/log/nginx/rahmat-grup-error.log
```

### GitHub Actions deployment fails

```bash
# Check logs di GitHub
# https://github.com/bagussundaru/Rahmat-Grup/actions

# Common issues:
# 1. Wrong SERVER_USER (check whoami on server)
# 2. Wrong SSH key (copy entire private key)
# 3. Public key not added to authorized_keys on server
```

### Application not loading

```bash
# SSH ke server
ssh root@103.126.116.175

# Check Nginx serving right directory
ls -la /var/www/rahmat-grup/dist/index.html

# Check Nginx config
sudo cat /etc/nginx/sites-enabled/rahmat-grup

# Check if index.html exists
curl http://localhost/index.html
```

---

## 📞 SUPPORT RESOURCES

- **Nginx Issues:** `/var/log/nginx/rahmat-grup-error.log`
- **Certbot Issues:** `sudo certbot certificates`
- **GitHub Actions:** https://github.com/bagussundaru/Rahmat-Grup/actions
- **Server Logs:** `sudo journalctl -u nginx -f`

---

## ✅ KESIMPULAN

Semua infrastruktur sudah siap! Tinggal execute 5 langkah di atas.

Setelah selesai:
- ✨ Aplikasi live di https://rahmat-grup.web.id
- 🔐 HTTPS dengan Let's Encrypt (auto-renew)
- 🚀 Auto-deploy setiap push ke GitHub
- 📊 Monitoring via logs
- 🔄 Automatic backups sebelum deploy
- ⚡ Optimized dengan Gzip, caching, security headers

**Selamat! Aplikasi Rahmat Grup siap untuk production!** 🎉

---

**Last Updated:** November 12, 2025  
**Status:** Ready for Implementation ✅
