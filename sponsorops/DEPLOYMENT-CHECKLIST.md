# Deployment Checklist

Use this checklist to make sure everything is set up correctly!

## ☑️ Supabase Setup

- [ ] Created Supabase account
- [ ] Created new project named "sponsorops"
- [ ] Ran the entire `supabase-schema.sql` in SQL Editor
- [ ] Saw "Success. No rows returned" message
- [ ] Copied Project URL (starts with https://)
- [ ] Copied anon public API key

## ☑️ Netlify Setup  

- [ ] Created Netlify account
- [ ] Deployed site (manually or via GitHub)
- [ ] Added environment variable: `VITE_SUPABASE_URL`
- [ ] Added environment variable: `VITE_SUPABASE_ANON_KEY`
- [ ] Triggered a new deploy
- [ ] Site builds successfully (green checkmark)
- [ ] Can access site at Netlify URL

## ☑️ Testing

- [ ] Can see the dashboard
- [ ] Can see sample sponsors (ABC Manufacturing, XYZ Tech Corp)
- [ ] Can add a new sponsor
- [ ] Can edit a sponsor
- [ ] Can add an interaction
- [ ] Can create a task
- [ ] Can update team info
- [ ] All data saves and persists after refresh

## ☑️ Team Access

- [ ] Copied Netlify URL
- [ ] Shared URL with team members
- [ ] Confirmed multiple people can access
- [ ] Confirmed changes sync across devices

## ✅ All Done!

If you checked everything above, your SponsorOps CRM is fully functional!

---

## Common Issues

**Build fails:**
- Double-check environment variables have no spaces or quotes
- Verify both variables are added correctly
- Try deploying again

**Can't see data:**
- Make sure SQL schema ran successfully
- Check browser console for errors (F12)
- Verify environment variables match Supabase credentials

**Data doesn't save:**
- Check Supabase dashboard → Table Editor to see if data appears
- Verify RLS policies were created (check SQL schema ran fully)
- Try refreshing the page

---

Need more help? See README.md for detailed troubleshooting!
