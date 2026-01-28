-- Migration: Add research/detective worksheet fields to sponsors
-- Run this in Supabase SQL Editor

-- Add research data columns to sponsors table
ALTER TABLE sponsors
ADD COLUMN IF NOT EXISTS research_data JSONB,
ADD COLUMN IF NOT EXISTS lead_score INTEGER,
ADD COLUMN IF NOT EXISTS lead_temperature TEXT CHECK (lead_temperature IN ('hot', 'warm', 'cold'));

-- Add index for filtering by lead temperature
CREATE INDEX IF NOT EXISTS idx_sponsors_lead_temperature ON sponsors(lead_temperature);

-- Comment for documentation
COMMENT ON COLUMN sponsors.research_data IS 'JSON data from Detective Worksheet research';
COMMENT ON COLUMN sponsors.lead_score IS 'Lead score 0-100 from research';
COMMENT ON COLUMN sponsors.lead_temperature IS 'Lead temperature: hot (70+), warm (40-69), cold (<40)';
