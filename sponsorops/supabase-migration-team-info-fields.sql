-- Migration: Add new team_info fields for email templates
-- Run this in Supabase SQL Editor

-- Add the new columns
ALTER TABLE team_info
ADD COLUMN IF NOT EXISTS team_size TEXT,
ADD COLUMN IF NOT EXISTS team_location TEXT,
ADD COLUMN IF NOT EXISTS achievement_1 TEXT,
ADD COLUMN IF NOT EXISTS achievement_2 TEXT,
ADD COLUMN IF NOT EXISTS achievement_3 TEXT;

-- Add comments for documentation
COMMENT ON COLUMN team_info.team_size IS 'Number of students on team (e.g., "35")';
COMMENT ON COLUMN team_info.team_location IS 'City/town location (e.g., "Holland, Michigan")';
COMMENT ON COLUMN team_info.achievement_1 IS 'Achievement for email template - competition';
COMMENT ON COLUMN team_info.achievement_2 IS 'Achievement for email template - student impact';
COMMENT ON COLUMN team_info.achievement_3 IS 'Achievement for email template - technical';
