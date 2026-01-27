# SponsorOps 🚀

A comprehensive FRC (FIRST Robotics Competition) Sponsor CRM built with React, Supabase, and deployed on Netlify.

## Features

- 📊 **Dashboard** - Quick overview of all sponsor activities
- 🏢 **Sponsor Management** - Complete CRM for tracking companies and contacts
- ✅ **Task & Reminder System** - Never miss a follow-up
- 💬 **Interaction History** - Log every email, call, and meeting
- 🎯 **Team Info** - Centralized messaging for sponsor outreach
- 🔍 **Search & Filter** - Find sponsors instantly
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: React 18 + Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Hosting**: Netlify

## Setup Instructions

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in your project details:
   - Name: `sponsorops`
   - Database Password: (create a strong password)
   - Region: Choose closest to you
4. Wait for project to finish setting up (~2 minutes)

5. **Create the database tables**:
   - In your Supabase dashboard, go to SQL Editor (left sidebar)
   - Click "New Query"
   - Copy the entire contents of `supabase-schema.sql` from this repo
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter
   - You should see "Success. No rows returned"

6. **Get your API credentials**:
   - Go to Settings → API (left sidebar)
   - Copy your `Project URL` - this is your `VITE_SUPABASE_URL`
   - Copy your `anon public` key - this is your `VITE_SUPABASE_ANON_KEY`

### 2. Deploy to Netlify

#### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/yourusername/sponsorops.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your `sponsorops` repository
   
3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" → "New variable" and add:
     - `VITE_SUPABASE_URL` = (your Supabase project URL)
     - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)
   
4. **Deploy**:
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete
   - Your site is live! 🎉

#### Option B: Deploy with Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and deploy**:
   ```bash
   netlify init
   # Follow prompts to create new site
   
   # Set environment variables
   netlify env:set VITE_SUPABASE_URL "your-supabase-url"
   netlify env:set VITE_SUPABASE_ANON_KEY "your-supabase-anon-key"
   
   # Deploy
   netlify deploy --prod
   ```

### 3. Local Development (Optional)

If you want to run locally for development:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/sponsorops.git
   cd sponsorops
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   
5. Open [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Adding Sponsors

1. Click "Add Sponsor" button
2. Fill in company details (name is required)
3. Select status (Research, Email Sent, Active, etc.)
4. Add contact information
5. Save!

### Logging Interactions

1. Click on any sponsor to open details
2. Go to "Interactions" tab
3. Click "Log Interaction"
4. Select type (Email, Call, Meeting, Visit)
5. Add notes about what was discussed
6. Save!

### Creating Tasks

1. Go to "Tasks" view or click a sponsor
2. Click "Add Task"
3. Select sponsor and add description
4. Set due date
5. Track progress and check off when complete

### Updating Team Info

1. Go to "Team Info" view
2. Click "Edit Team Info"
3. Fill in your season details, goals, achievements
4. This info helps you craft consistent sponsor messages!
5. Save changes

## Customization

### Branding

To customize colors and branding, edit `src/App.jsx` and `src/components.jsx`:

- Orange/Red gradients: Search for `from-orange-500 to-red-600`
- Blue tones: Search for `blue-` color classes
- Font: Change the Google Fonts import in `index.html`

### Status Options

To modify status types, edit the `statusOptions` array in `src/App.jsx`:

```javascript
const statusOptions = [
  { value: 'research', label: 'Research Phase', color: 'bg-gray-500' },
  // Add your own statuses here
];
```

## Troubleshooting

### "Error loading data"
- Check that environment variables are set correctly in Netlify
- Verify Supabase URL and API key are correct
- Make sure database tables were created successfully

### Build fails on Netlify
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Verify build command is `npm run build`
- Check build logs for specific errors

### Data not saving
- Check browser console for errors
- Verify Supabase RLS policies are set correctly
- Make sure you ran the full SQL schema

## Security Notes

⚠️ **Important**: This app uses public access policies for simplicity. For production use:

1. Implement proper authentication (Supabase Auth)
2. Update RLS policies to restrict access
3. Add team/organization isolation
4. Consider adding rate limiting

## Support

For issues or questions:
- Check the Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Check Netlify docs: [docs.netlify.com](https://docs.netlify.com)
- Open an issue on GitHub

## License

MIT

---

**Built for FRC teams by mentors who get it.** Good luck with your fundraising! 🤖🎉
