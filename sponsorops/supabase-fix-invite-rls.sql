-- Fix team_invites RLS to be case-insensitive and more permissive for new users
-- Run this in Supabase SQL Editor

-- Drop existing user policies
DROP POLICY IF EXISTS "team_invites_select_user" ON team_invites;
DROP POLICY IF EXISTS "team_invites_update_user" ON team_invites;

-- Recreate with case-insensitive email matching
CREATE POLICY "team_invites_select_user" ON team_invites
    FOR SELECT TO authenticated
    USING (lower(email) = lower(auth.jwt() ->> 'email'));

CREATE POLICY "team_invites_update_user" ON team_invites
    FOR UPDATE TO authenticated
    USING (lower(email) = lower(auth.jwt() ->> 'email'))
    WITH CHECK (lower(email) = lower(auth.jwt() ->> 'email'));

-- Also ensure user_profiles allows new users to insert
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;
CREATE POLICY "user_profiles_insert_own" ON user_profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

-- Allow users to update their own profile (needed for upsert)
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
CREATE POLICY "user_profiles_update_own" ON user_profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Allow users to select their own profile and teammates
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
CREATE POLICY "user_profiles_select_own" ON user_profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR id IN (
        SELECT tm.user_id FROM team_members tm
        WHERE tm.team_id IN (SELECT get_my_team_ids())
    ));

-- Verify the policies
-- SELECT * FROM pg_policies WHERE tablename = 'team_invites';
-- SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
