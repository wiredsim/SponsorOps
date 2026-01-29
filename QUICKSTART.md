# SponsorOps Quick Start Guide

## Get Your App Live in 15 Minutes

### Step 1: Set Up Supabase (5 minutes)

1. Go to **supabase.com** and sign up (free)
2. Click **"New Project"**
   - Name: `sponsorops`
   - Password: (make one up)
   - Region: (pick closest to you)
   - Click **"Create new project"**
3. Wait 2 minutes while it sets up
4. Click **"SQL Editor"** in the left sidebar
5. Click **"New query"**
6. Open the file `supabase-schema.sql` from the `sponsorops` folder
7. Copy ALL the text, paste into SQL Editor
8. Click **"RUN"** (or Ctrl+Enter)
9. You should see "Success"!
10. Repeat steps 5-8 for each `supabase-migration-*.sql` file in order (see README.md for the full list)

### Step 2: Get Your API Keys (2 minutes)

1. In Supabase, click **Settings** then **API** (in sidebar)
2. You'll see two things you need:
   - **Project URL** - looks like: `https://xxx.supabase.co`
   - **anon public key** - long string of letters/numbers
3. **SAVE THESE SOMEWHERE!** You'll need them in Step 3

### Step 3: Deploy to Cloudflare Pages (8 minutes)

1. Go to **dash.cloudflare.com** and sign up (free)
2. In the sidebar, click **Workers & Pages** then **Create**
3. Select the **Pages** tab
4. Connect your GitHub account and select the **SponsorOps** repository
5. Configure the build settings:
   - **Project name:** `sponsorops`
   - **Production branch:** `master`
   - **Root directory:** `sponsorops`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Click **Environment variables** and add:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: (paste your Project URL from Step 2)

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: (paste your anon public key from Step 2)

7. Click **Save and Deploy**
8. Wait 2-3 minutes
9. Click the URL at the top - **YOUR APP IS LIVE!**

### Step 4: Share with Your Team

1. Copy the Cloudflare Pages URL (looks like: `https://sponsorops.pages.dev` or your custom domain)
2. Share with all your students!
3. Everyone can access the same data

### Need Help?

**Common Issues:**

- **"Error loading data"** - Check that you entered the environment variables correctly (no spaces, no quotes)
- **Build failing** - Make sure you added BOTH environment variables and the root directory is set to `sponsorops`
- **Can't see data** - Go back to Supabase SQL Editor and re-run the schema and migrations
- **Blank page after deploy** - Ensure the build output directory is set to `dist`

**Still stuck?** Check the full README.md file for detailed troubleshooting.

---

**That's it! You now have a professional sponsor CRM for your FRC team!**
