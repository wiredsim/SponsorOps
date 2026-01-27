# SponsorOps Quick Start Guide

## 🚀 Get Your App Live in 15 Minutes

### Step 1: Set Up Supabase (5 minutes)

1. Go to **supabase.com** → Sign up (free)
2. Click **"New Project"**
   - Name: `sponsorops`
   - Password: (make one up)
   - Region: (pick closest to you)
   - Click **"Create new project"**
3. Wait 2 minutes while it sets up
4. Click **"SQL Editor"** in the left sidebar
5. Click **"New query"**
6. Open the file `supabase-schema.sql` from this folder
7. Copy ALL the text, paste into SQL Editor
8. Click **"RUN"** (or Ctrl+Enter)
9. You should see "Success"! ✅

### Step 2: Get Your API Keys (2 minutes)

1. In Supabase, click **Settings** → **API** (in sidebar)
2. You'll see two things you need:
   - **Project URL** - looks like: `https://xxx.supabase.co`
   - **anon public key** - long string of letters/numbers
3. **SAVE THESE SOMEWHERE!** You'll need them in Step 3

### Step 3: Deploy to Netlify (8 minutes)

1. Go to **netlify.com** → Sign up (free, use GitHub account)
2. Click **"Add new site"** → **"Deploy manually"**
3. On your computer:
   - Open this `sponsorops` folder
   - Select EVERYTHING in it
   - Drag and drop into the Netlify upload area
4. Wait for upload (1-2 minutes)
5. Netlify will try to build it - **it will fail first!** That's normal!
6. Click **"Site configuration"** → **"Environment variables"**
7. Click **"Add a variable"** twice to add:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: (paste your Project URL from Step 2)

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: (paste your anon public key from Step 2)

8. Click **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**
9. Wait 2-3 minutes
10. Click the URL at the top - **YOUR APP IS LIVE!** 🎉

### Step 4: Share with Your Team

1. Copy the Netlify URL (looks like: `https://your-site-name.netlify.app`)
2. Share with all your students!
3. Everyone can access the same data

### Need Help?

**Common Issues:**

- **"Error loading data"** → Check that you entered the environment variables correctly (no spaces, no quotes)
- **Build failing** → Make sure you added BOTH environment variables
- **Can't see data** → Go back to Supabase SQL Editor and re-run the schema

**Still stuck?** Check the full README.md file for detailed troubleshooting.

---

**That's it! You now have a professional sponsor CRM for your FRC team!** 🤖
