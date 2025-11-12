╔═══════════════════════════════════════════════════════════════════════════╗
║                   📋 DNS CONFIGURATION INSTRUCTIONS 📋                      ║
║                  For: rahmat-grup.web.id GO LIVE                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

🎯 WHAT YOU NEED TO DO:

Update your domain registrar nameservers to point to the correct servers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STEP 1: Update Nameservers at Domain Registrar

Go to your domain registrar (where you bought rahmat-grup.web.id) and change
the nameservers to:

   PRIMARY NAMESERVER:   satu.neodns.id
   SECONDARY NAMESERVER: dua.neodns.id

This tells the internet to use Neodns as your DNS provider.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STEP 2: Add A Record in Neodns Panel

After updating nameservers, login to your Neodns panel and add:

   HOST:     @  (or rahmat-grup.web.id)
   TYPE:     A
   IP:       103.126.116.175
   TTL:      300 (or default)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STEP 3: Verify DNS is Working

Once you've done steps 1 & 2, wait 5-15 minutes then run this command:

   dig +short rahmat-grup.web.id A

It should show:  103.126.116.175

If it still shows nothing, wait a bit longer (up to 30 minutes) and try again.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STEP 4: Tell Me When DNS is Ready!

Once DNS is resolving to 103.126.116.175, please run this on your terminal:

   dig +short rahmat-grup.web.id A

Then tell me it's working. I will then:
   1. Setup Let's Encrypt SSL certificate
   2. Configure GitHub Actions secrets
   3. Complete the final setup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ QUICK REFERENCE:

Domain:           rahmat-grup.web.id
Server IP:        103.126.116.175
Nameserver 1:     satu.neodns.id
Nameserver 2:     dua.neodns.id
A Record Type:    A
A Record Value:   103.126.116.175
TTL:              300

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ CURRENT STATUS:

Server: ✓ Setup complete
Nginx: ✓ Running
Firewall: ✓ Configured
Application: ✓ Deployed at /var/www/rahmat-grup/dist
DNS: ⏳ WAITING FOR YOU TO CONFIGURE
SSL: ⏳ Will be setup once DNS is ready
GitHub Actions: ⏳ Will be setup after SSL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 IMPORTANT NOTES:

• Do NOT proceed until nameservers are updated
• DNS can take up to 30 minutes to propagate
• Make sure you're in Neodns panel to add A record (not your registrar)
• The IP 103.126.116.175 must be exactly correct
• Nameservers are case-insensitive (satu.neodns.id = SATU.NEODNS.ID)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
