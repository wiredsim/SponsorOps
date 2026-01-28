-- Migration: Add hidden_playbooks column to team_info
-- Run this in Supabase SQL Editor

-- Add column to store IDs of hidden default playbooks
ALTER TABLE team_info
ADD COLUMN IF NOT EXISTS hidden_playbooks TEXT[] DEFAULT '{}';

-- Add comment
COMMENT ON COLUMN team_info.hidden_playbooks IS 'Array of default playbook IDs that have been hidden by the team';
