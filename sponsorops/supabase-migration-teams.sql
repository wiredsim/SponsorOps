-- ============================================
-- SponsorOps Teams Feature Migration
-- Run this migration in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Phase 1: Create Core Team Tables
-- ============================================

-- 1.1 Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    team_number TEXT,  -- FRC team number (e.g., "74")
    logo_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 1.3 Create team_invites table (for invite-only flow)
CREATE TABLE IF NOT EXISTS team_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    invited_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    accepted_at TIMESTAMPTZ,
    UNIQUE(team_id, email)
);

-- ============================================
-- Phase 2: Add team_id to Existing Tables
-- ============================================

-- 1.4 Add team_id to existing tables
ALTER TABLE sponsors ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id);
ALTER TABLE interactions ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id);
ALTER TABLE team_info ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id);

-- Create indexes for efficient team-based queries
CREATE INDEX IF NOT EXISTS idx_sponsors_team ON sponsors(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team ON tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_interactions_team ON interactions(team_id);
CREATE INDEX IF NOT EXISTS idx_team_info_team ON team_info(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON team_invites(email);

-- ============================================
-- Phase 3: Enable Row Level Security
-- ============================================

-- Enable RLS on new tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Phase 4: RLS Policies for teams table
-- ============================================

-- Users can view teams they belong to
CREATE POLICY "teams_select_member" ON teams
    FOR SELECT TO authenticated
    USING (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Team admins can update their team
CREATE POLICY "teams_update_admin" ON teams
    FOR UPDATE TO authenticated
    USING (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin'))
    WITH CHECK (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Authenticated users can create teams (they become admin)
CREATE POLICY "teams_insert_authenticated" ON teams
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- ============================================
-- Phase 5: RLS Policies for team_members table
-- ============================================

-- Users can view members of teams they belong to
CREATE POLICY "team_members_select" ON team_members
    FOR SELECT TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members AS tm WHERE tm.user_id = auth.uid()));

-- Team admins can insert new members
CREATE POLICY "team_members_insert_admin" ON team_members
    FOR INSERT TO authenticated
    WITH CHECK (
        team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin')
        OR (user_id = auth.uid()) -- Allow users to insert themselves when accepting invite
    );

-- Team admins can update member roles
CREATE POLICY "team_members_update_admin" ON team_members
    FOR UPDATE TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin'))
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Team admins can delete members (but not themselves)
CREATE POLICY "team_members_delete_admin" ON team_members
    FOR DELETE TO authenticated
    USING (
        team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin')
        AND user_id != auth.uid()
    );

-- ============================================
-- Phase 6: RLS Policies for team_invites table
-- ============================================

-- Team admins can view invites for their team
CREATE POLICY "team_invites_select_admin" ON team_invites
    FOR SELECT TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Users can view their own pending invites (by email)
CREATE POLICY "team_invites_select_user" ON team_invites
    FOR SELECT TO authenticated
    USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Team admins can create invites
CREATE POLICY "team_invites_insert_admin" ON team_invites
    FOR INSERT TO authenticated
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Team admins can delete invites (cancel)
CREATE POLICY "team_invites_delete_admin" ON team_invites
    FOR DELETE TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Users can update their own invites (to accept)
CREATE POLICY "team_invites_update_user" ON team_invites
    FOR UPDATE TO authenticated
    USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ============================================
-- Phase 7: Update RLS Policies for Existing Tables
-- ============================================

-- Drop existing policies (if they exist) and create team-scoped ones

-- Sponsors policies
DROP POLICY IF EXISTS "Enable all for authenticated users" ON sponsors;
DROP POLICY IF EXISTS "sponsors_team_access" ON sponsors;

CREATE POLICY "sponsors_team_access" ON sponsors
    FOR ALL TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Tasks policies
DROP POLICY IF EXISTS "Enable all for authenticated users" ON tasks;
DROP POLICY IF EXISTS "tasks_team_access" ON tasks;

CREATE POLICY "tasks_team_access" ON tasks
    FOR ALL TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Interactions policies
DROP POLICY IF EXISTS "Enable all for authenticated users" ON interactions;
DROP POLICY IF EXISTS "interactions_team_access" ON interactions;

CREATE POLICY "interactions_team_access" ON interactions
    FOR ALL TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Team info policies
DROP POLICY IF EXISTS "Enable all for authenticated users" ON team_info;
DROP POLICY IF EXISTS "team_info_team_access" ON team_info;

CREATE POLICY "team_info_team_access" ON team_info
    FOR ALL TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- ============================================
-- Phase 8: Storage Policy for Team Logos
-- ============================================
-- NOTE: First create the 'team-logos' bucket in Supabase Dashboard:
--   1. Go to Storage in Supabase Dashboard
--   2. Create new bucket named 'team-logos'
--   3. Set it as public
--   4. Then run these policies:

-- Only team admins can upload logos to their team folder
CREATE POLICY "team_logo_upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'team-logos' AND
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Team admins can update/replace logos
CREATE POLICY "team_logo_update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'team-logos' AND
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Team admins can delete logos
CREATE POLICY "team_logo_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'team-logos' AND
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Anyone can view team logos (public)
CREATE POLICY "team_logo_select" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'team-logos');

-- ============================================
-- Helper Functions
-- ============================================

-- Function to get user's teams
CREATE OR REPLACE FUNCTION get_user_teams(user_uuid UUID)
RETURNS TABLE (
    team_id UUID,
    team_name TEXT,
    team_number TEXT,
    logo_url TEXT,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.name, t.team_number, t.logo_url, tm.role
    FROM teams t
    JOIN team_members tm ON t.id = tm.team_id
    WHERE tm.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin of a team
CREATE OR REPLACE FUNCTION is_team_admin(user_uuid UUID, team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM team_members
        WHERE user_id = user_uuid
        AND team_id = team_uuid
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DATA MIGRATION (Run separately after schema)
-- ============================================
-- NOTE: Run this section AFTER the schema migration above
-- Replace the UUIDs with actual values from your system

/*
-- Step 1: Get the current user's ID (run this first to get the UUID)
-- SELECT id, email FROM auth.users LIMIT 10;

-- Step 2: Create the default team for Team 74 CHAOS
-- Replace 'YOUR-USER-UUID-HERE' with the actual user UUID from step 1
DO $$
DECLARE
    default_team_id UUID;
    current_user_id UUID := 'YOUR-USER-UUID-HERE'; -- Replace this!
BEGIN
    -- Insert default team
    INSERT INTO teams (name, team_number, created_by)
    VALUES ('Team 74 CHAOS', '74', current_user_id)
    RETURNING id INTO default_team_id;

    -- Make current user an admin
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (default_team_id, current_user_id, 'admin');

    -- Migrate existing data to default team
    UPDATE sponsors SET team_id = default_team_id WHERE team_id IS NULL;
    UPDATE tasks SET team_id = default_team_id WHERE team_id IS NULL;
    UPDATE interactions SET team_id = default_team_id WHERE team_id IS NULL;
    UPDATE team_info SET team_id = default_team_id WHERE team_id IS NULL;

    RAISE NOTICE 'Created team % with ID %', 'Team 74 CHAOS', default_team_id;
END $$;
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after migration to verify everything is set up correctly:

-- Check tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('teams', 'team_members', 'team_invites');

-- Check columns added
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'sponsors' AND column_name = 'team_id';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('teams', 'team_members', 'team_invites');
