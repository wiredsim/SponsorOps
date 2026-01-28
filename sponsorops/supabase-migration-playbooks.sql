-- Migration: Create playbooks table for custom email/phone templates
-- Run this in Supabase SQL Editor

-- Create the playbooks table
CREATE TABLE IF NOT EXISTS playbooks (
    id TEXT PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'meeting', 'tip')),
    title TEXT NOT NULL,
    subject TEXT,  -- For email templates
    content TEXT NOT NULL,
    tips TEXT[],  -- Array of tip strings
    stages TEXT[],  -- Array of stage identifiers
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_playbooks_team ON playbooks(team_id);
CREATE INDEX IF NOT EXISTS idx_playbooks_type ON playbooks(type);

-- Enable RLS
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see playbooks from teams they belong to
CREATE POLICY "playbooks_team_access" ON playbooks
    FOR ALL TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Add comments for documentation
COMMENT ON TABLE playbooks IS 'Custom email templates, phone scripts, meeting guides, and tips per team';
COMMENT ON COLUMN playbooks.type IS 'Type of playbook: email, phone, meeting, or tip';
COMMENT ON COLUMN playbooks.subject IS 'Email subject line template (for email type only)';
COMMENT ON COLUMN playbooks.content IS 'Main template content with {{merge_fields}}';
COMMENT ON COLUMN playbooks.tips IS 'Array of coaching tips to display with template';
COMMENT ON COLUMN playbooks.stages IS 'Sponsor stages where this playbook is relevant';
