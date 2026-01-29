-- Migration: Add notes column to tasks
-- Run this in Supabase SQL Editor

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN tasks.notes IS 'Additional notes or context for the task';
