-- Migration: Add email_queue table for unmatched inbound emails
-- Run this in Supabase SQL Editor

-- Create the email_queue table
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Email details
    email_from TEXT,
    email_to TEXT,  -- comma-separated recipients
    email_subject TEXT,
    email_body_preview TEXT,  -- first 500 chars

    -- For manual assignment
    assigned_sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL,
    assigned_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,

    -- Status: pending, assigned, dismissed
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'dismissed')),

    -- When processed
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES auth.users(id),

    -- Raw payload for debugging
    raw_payload JSONB,

    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_created ON email_queue(created_at DESC);

-- Note: No RLS on this table - it's written by the worker (service key)
-- and read by authenticated users. We'll add RLS if multi-team support is needed.

-- For now, allow authenticated users to read/update
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_queue_read" ON email_queue
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "email_queue_update" ON email_queue
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- Add comments
COMMENT ON TABLE email_queue IS 'Queue for inbound emails that could not be auto-matched to a sponsor';
COMMENT ON COLUMN email_queue.status IS 'pending = needs review, assigned = matched to sponsor, dismissed = ignored';
