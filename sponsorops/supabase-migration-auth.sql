-- SponsorOps Authentication & Audit Migration
-- Run this SQL in your Supabase SQL Editor AFTER the initial schema
-- This adds: user authentication, audit logging, and soft deletes

-- ============================================
-- PART 1: AUDIT LOG TABLE (WORM - Write Once Read Many)
-- ============================================

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'ARCHIVE', 'RESTORE')),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by record
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);

-- Enable RLS on audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- WORM policies: append-only (INSERT and SELECT only, no UPDATE or DELETE)
CREATE POLICY "Audit log insert for authenticated" ON audit_log
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Audit log select for authenticated" ON audit_log
    FOR SELECT TO authenticated
    USING (true);

-- No UPDATE or DELETE policies = immutable records

-- ============================================
-- PART 2: ADD SOFT DELETE COLUMNS
-- ============================================

-- Sponsors soft delete
ALTER TABLE sponsors
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- Tasks soft delete
ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);

-- ============================================
-- PART 3: ADD USER TRACKING COLUMNS
-- ============================================

-- Sponsors user tracking
ALTER TABLE sponsors
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Interactions user tracking
ALTER TABLE interactions
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Tasks user tracking
ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Team info user tracking
ALTER TABLE team_info
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- ============================================
-- PART 4: UPDATE RLS POLICIES
-- ============================================

-- Drop old public-access policies
DROP POLICY IF EXISTS "Enable all for sponsors" ON sponsors;
DROP POLICY IF EXISTS "Enable all for interactions" ON interactions;
DROP POLICY IF EXISTS "Enable all for tasks" ON tasks;
DROP POLICY IF EXISTS "Enable all for team_info" ON team_info;

-- SPONSORS: Authenticated users can do everything (shared data)
CREATE POLICY "sponsors_select_authenticated" ON sponsors
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "sponsors_insert_authenticated" ON sponsors
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "sponsors_update_authenticated" ON sponsors
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- Note: We keep DELETE policy but app will use soft delete instead
CREATE POLICY "sponsors_delete_authenticated" ON sponsors
    FOR DELETE TO authenticated
    USING (true);

-- INTERACTIONS: Authenticated users can do everything
CREATE POLICY "interactions_select_authenticated" ON interactions
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "interactions_insert_authenticated" ON interactions
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Interactions are append-only in the app (no update/delete in UI)
CREATE POLICY "interactions_update_authenticated" ON interactions
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "interactions_delete_authenticated" ON interactions
    FOR DELETE TO authenticated
    USING (true);

-- TASKS: Authenticated users can do everything
CREATE POLICY "tasks_select_authenticated" ON tasks
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "tasks_insert_authenticated" ON tasks
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "tasks_update_authenticated" ON tasks
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "tasks_delete_authenticated" ON tasks
    FOR DELETE TO authenticated
    USING (true);

-- TEAM_INFO: Authenticated users can do everything
CREATE POLICY "team_info_select_authenticated" ON team_info
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "team_info_insert_authenticated" ON team_info
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "team_info_update_authenticated" ON team_info
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "team_info_delete_authenticated" ON team_info
    FOR DELETE TO authenticated
    USING (true);

-- ============================================
-- VERIFICATION QUERIES (run after migration)
-- ============================================

-- Check audit_log table exists
-- SELECT * FROM audit_log LIMIT 1;

-- Check new columns exist
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'sponsors' AND column_name IN ('deleted_at', 'deleted_by', 'created_by', 'updated_by');

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
