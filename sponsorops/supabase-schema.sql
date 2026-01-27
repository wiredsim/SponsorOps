-- SponsorOps Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sponsors table
CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'research',
    type TEXT NOT NULL DEFAULT 'new-prospect',
    contact_name TEXT,
    contact_title TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    industry TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interactions table
CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    priority TEXT DEFAULT 'medium',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team info table
CREATE TABLE team_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_year TEXT,
    new_tech TEXT,
    team_changes TEXT,
    goals TEXT,
    last_season_achievements TEXT,
    last_season_story TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_sponsors_status ON sponsors(status);
CREATE INDEX idx_sponsors_type ON sponsors(type);
CREATE INDEX idx_interactions_sponsor_id ON interactions(sponsor_id);
CREATE INDEX idx_interactions_date ON interactions(date DESC);
CREATE INDEX idx_tasks_sponsor_id ON tasks(sponsor_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Enable Row Level Security (RLS)
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_info ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (public access)
-- Note: For production, you should implement proper authentication and authorization

CREATE POLICY "Enable all for sponsors" ON sponsors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for interactions" ON interactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for team_info" ON team_info FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data (optional - remove if you don't want sample data)
INSERT INTO sponsors (name, status, type, contact_name, contact_title, email, phone, website, industry, notes) VALUES
    ('ABC Manufacturing', 'email-sent', 'new-prospect', 'John Smith', 'Operations Manager', 'jsmith@abc.com', '(555) 123-4567', 'www.abcmanufacturing.com', 'Manufacturing', 'Local CNC shop, interested in our advanced manufacturing initiative'),
    ('XYZ Tech Corp', 'active-sponsor', 'previous-sponsor', 'Sarah Johnson', 'Community Relations', 'sjohnson@xyztech.com', '(555) 987-6543', 'www.xyztech.com', 'Technology', 'Sponsored $2,000 last year, great relationship');

-- Insert a sample task
INSERT INTO tasks (sponsor_id, description, due_date, priority, completed)
SELECT id, 'Follow up on initial email', CURRENT_DATE + INTERVAL '7 days', 'high', false
FROM sponsors WHERE name = 'ABC Manufacturing' LIMIT 1;

-- Insert sample team info
INSERT INTO team_info (season_year, new_tech, team_changes, goals, last_season_achievements, last_season_story) VALUES
    ('2025', '', '', '', '', '');
