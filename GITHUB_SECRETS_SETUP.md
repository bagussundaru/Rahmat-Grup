╔═══════════════════════════════════════════════════════════════════════════╗
║               🔐 GITHUB ACTIONS SECRETS SETUP GUIDE 🔐                      ║
║                For: Automatic Deployment on Push to Main                   ║
╚═══════════════════════════════════════════════════════════════════════════╝

🎯 WHAT THIS DOES:

These secrets allow GitHub Actions to automatically deploy your app every time
you push code to the main branch.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 STEP 1: Go to GitHub Repository Settings

1. Go to: https://github.com/bagussundaru/Rahmat-Grup
2. Click: "Settings" (top right area)
3. Click: "Secrets and variables" → "Actions" (left sidebar)
4. Click: "New repository secret" button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 SECRET 1: SERVER_HOST

Name:  SERVER_HOST
Value: 103.126.116.175

(This is your server's IP address)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 SECRET 2: SERVER_USER

Name:  SERVER_USER
Value: deploy

(This is the deploy user on your server)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 SECRET 3: SERVER_SSH_KEY

This is your PRIVATE SSH key. COPY THE ENTIRE KEY from below (including
the "ssh-ed25519" part at the beginning and the "github-actions-deployment"
part at the end).

Name:  SERVER_SSH_KEY
Value: (Paste the contents of ~/.ssh/github-actions file)

To get this on your local machine, run:

   cat ~/.ssh/github-actions

Then COPY the entire output and paste it as the SECRET 3 value.

⚠️  IMPORTANT:
   • This is a PRIVATE key - keep it secret
   • Never share this with anyone
   • GitHub hides it after you save
   • If compromised, delete and regenerate keys

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 STEP 2: How to Get Your Private SSH Key

On your LOCAL machine (not the server), run:

   cat ~/.ssh/github-actions

This will output something like:

   -----BEGIN OPENSSH PRIVATE KEY-----
   b3BlbnNzaC1rZXktdjEAAAAABG5vbmUtY29udHJhc3RlZAAAAAByGpwKAAAAywAAAA
   ... (many lines of characters) ...
   -----END OPENSSH PRIVATE KEY-----

COPY THE ENTIRE OUTPUT (from BEGIN to END, including those lines).

Paste it in GitHub secrets as "SERVER_SSH_KEY" value.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ STEP 3: Verify Secrets Are Added

After adding all 3 secrets:

1. Go back to: Settings → Secrets and variables → Actions
2. You should see 3 secrets listed:
   ✓ SERVER_HOST
   ✓ SERVER_USER
   ✓ SERVER_SSH_KEY  (content is hidden with asterisks)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 STEP 4: Test the Deployment

After adding secrets, make a test deployment:

1. Make a small change to your code (e.g., edit a comment)
2. Commit: git add . && git commit -m "test deployment"
3. Push: git push origin main

GitHub Actions will automatically:
   → Build your React app
   → Deploy to your server
   → Reload Nginx
   → App is live in 2-5 minutes!

Check status at: https://github.com/bagussundaru/Rahmat-Grup/actions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ QUICK REFERENCE:

Secret Name          | Value
─────────────────────┼──────────────────────────────────────────
SERVER_HOST          | 103.126.116.175
SERVER_USER          | deploy
SERVER_SSH_KEY       | (contents of ~/.ssh/github-actions file)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 SECURITY BEST PRACTICES:

✓ Keep SERVER_SSH_KEY SECRET
✓ Never commit private keys to git
✓ Never share secrets with others
✓ GitHub hides secrets after saving
✓ If leaked, delete key and regenerate immediately
✓ Review GitHub Actions logs (they don't show secrets)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ TROUBLESHOOTING:

Q: GitHub Actions fails with "permission denied"
A: Check if SERVER_SSH_KEY is the full PRIVATE key (includes BEGIN/END)

Q: It says "Could not resolve hostname"
A: Check SERVER_HOST is exactly: 103.126.116.175

Q: Deployment hangs or times out
A: Check Nginx logs on server: tail -f /var/log/nginx/rahmat-grup-error.log

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
