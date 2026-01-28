-- Migration: Add donations table for tracking sponsor contributions
-- Run this in Supabase SQL Editor

-- Create the donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,

    -- Donation type
    type TEXT NOT NULL CHECK (type IN ('monetary', 'in_kind')),

    -- For monetary donations
    amount DECIMAL(10, 2),

    -- For in-kind donations
    description TEXT,
    estimated_value DECIMAL(10, 2),

    -- Common fields
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,

    -- For tracking (e.g., check number, invoice, etc.)
    reference TEXT,

    -- Receipt/acknowledgment tracking
    receipt_sent BOOLEAN DEFAULT false,
    receipt_sent_at TIMESTAMPTZ,

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_donations_sponsor ON donations(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_donations_team ON donations(team_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(date);
CREATE INDEX IF NOT EXISTS idx_donations_type ON donations(type);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see donations from teams they belong to
CREATE POLICY "donations_team_access" ON donations
    FOR ALL TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Helper view for donation totals by sponsor
CREATE OR REPLACE VIEW sponsor_donation_totals AS
SELECT
    sponsor_id,
    team_id,
    COUNT(*) as total_donations,
    SUM(CASE WHEN type = 'monetary' THEN amount ELSE 0 END) as total_monetary,
    SUM(CASE WHEN type = 'in_kind' THEN estimated_value ELSE 0 END) as total_in_kind,
    SUM(COALESCE(amount, 0) + COALESCE(estimated_value, 0)) as total_value,
    MAX(date) as last_donation_date
FROM donations
GROUP BY sponsor_id, team_id;

-- Add comments for documentation
COMMENT ON TABLE donations IS 'Track monetary and in-kind donations from sponsors';
COMMENT ON COLUMN donations.type IS 'monetary or in_kind';
COMMENT ON COLUMN donations.amount IS 'Dollar amount for monetary donations';
COMMENT ON COLUMN donations.estimated_value IS 'Estimated dollar value for in-kind donations';
COMMENT ON COLUMN donations.reference IS 'Check number, invoice number, or other reference';
