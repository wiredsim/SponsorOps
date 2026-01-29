-- Migration: Add annual_tasks column to team_info
-- Run this in Supabase SQL Editor

-- Add column to store default annual task templates
ALTER TABLE team_info
ADD COLUMN IF NOT EXISTS annual_tasks JSONB DEFAULT '[]';

-- Add comment
COMMENT ON COLUMN team_info.annual_tasks IS 'Array of default task templates that are generated annually for each sponsor. Each entry: {description, category, month, priority}';
