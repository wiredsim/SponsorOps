-- Migration: Add contact_type and organization columns to contacts table
-- This allows contacts to exist independently of sponsors (mentors, vendors, venue contacts, volunteers, etc.)

-- Add new columns
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS contact_type TEXT DEFAULT 'sponsor';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS organization TEXT;

-- Make sponsor_id nullable (contacts can exist without a sponsor)
ALTER TABLE contacts ALTER COLUMN sponsor_id DROP NOT NULL;

-- Add index for contact_type filtering
CREATE INDEX IF NOT EXISTS idx_contacts_contact_type ON contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_team_id ON contacts(team_id);

-- Update RLS policies to allow team members to manage non-sponsor contacts
-- (existing policies should already cover this since they check team_id)
