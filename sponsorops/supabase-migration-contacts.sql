-- Migration: Add contacts table for multiple contacts per sponsor
-- Run this in Supabase SQL Editor

-- Create the contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,

    -- Contact info
    name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone TEXT,
    role TEXT,  -- e.g., 'Decision Maker', 'Technical Contact', 'Day-to-day'

    -- Flags
    is_primary BOOLEAN DEFAULT false,

    -- Notes
    notes TEXT,

    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_sponsor ON contacts(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_contacts_team ON contacts(team_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_primary ON contacts(sponsor_id, is_primary) WHERE is_primary = true;

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see contacts from teams they belong to
CREATE POLICY "contacts_team_access" ON contacts
    FOR ALL TO authenticated
    USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))
    WITH CHECK (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

-- Function to ensure only one primary contact per sponsor
CREATE OR REPLACE FUNCTION ensure_single_primary_contact()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this contact as primary, unset others
    IF NEW.is_primary = true THEN
        UPDATE contacts
        SET is_primary = false
        WHERE sponsor_id = NEW.sponsor_id
          AND id != NEW.id
          AND is_primary = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single primary contact
DROP TRIGGER IF EXISTS trigger_single_primary_contact ON contacts;
CREATE TRIGGER trigger_single_primary_contact
    BEFORE INSERT OR UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_primary_contact();

-- Migrate existing sponsor contacts to contacts table
-- This creates a contact record for each sponsor that has contact info
INSERT INTO contacts (sponsor_id, team_id, name, title, email, phone, is_primary, created_at)
SELECT
    id as sponsor_id,
    team_id,
    contact_name as name,
    contact_title as title,
    email,
    phone,
    true as is_primary,
    created_at
FROM sponsors
WHERE contact_name IS NOT NULL
  AND contact_name != ''
  AND team_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE contacts IS 'Multiple contacts per sponsor with primary flag';
COMMENT ON COLUMN contacts.role IS 'Contact role: Decision Maker, Technical Contact, Day-to-day, etc.';
COMMENT ON COLUMN contacts.is_primary IS 'Primary contact for this sponsor (only one per sponsor)';
