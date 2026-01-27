-- ============================================
-- SponsorOps Task Enhancements Migration
-- Run this migration in your Supabase SQL Editor
-- ============================================

-- Add new columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'blocked'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' CHECK (category IN ('follow-up', 'meeting', 'research', 'call', 'email', 'visit', 'general'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- Create index for assigned_to queries
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Migrate existing completed tasks to have proper status
UPDATE tasks SET status = 'completed' WHERE completed = true AND status = 'todo';
UPDATE tasks SET status = 'todo' WHERE completed = false AND status IS NULL;

-- ============================================
-- Create a user_profiles table to store displayable user info
-- (Since we can't directly query auth.users from the client)
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Everyone on the team can see profiles of team members
CREATE POLICY "user_profiles_select" ON user_profiles
    FOR SELECT TO authenticated
    USING (
        id IN (
            SELECT tm.user_id FROM team_members tm
            WHERE tm.team_id IN (SELECT get_my_team_ids())
        )
    );

-- Users can update their own profile
CREATE POLICY "user_profiles_update_own" ON user_profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "user_profiles_insert_own" ON user_profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

-- ============================================
-- Function to auto-create user profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, display_name)
    VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1))
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Backfill existing users into user_profiles
-- ============================================

INSERT INTO user_profiles (id, email, display_name)
SELECT id, email, split_part(email, '@', 1)
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tasks';
-- SELECT * FROM user_profiles;
