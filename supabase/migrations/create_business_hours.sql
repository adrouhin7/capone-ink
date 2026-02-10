-- SQL Script to create the business_hours table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS business_hours (
  id BIGSERIAL PRIMARY KEY,
  day TEXT NOT NULL UNIQUE,
  opening_time TEXT NOT NULL DEFAULT '09:00',
  closing_time TEXT NOT NULL DEFAULT '19:00',
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to read (SELECT)
CREATE POLICY "Enable read access for all users" ON business_hours
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Enable update for authenticated users only" ON business_hours
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert
CREATE POLICY "Enable insert for authenticated users only" ON business_hours
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default schedule data (optional - you can do this through the admin panel instead)
INSERT INTO business_hours (day, opening_time, closing_time, is_closed, "order") VALUES
  ('Lundi', '09:00', '19:00', false, 0),
  ('Mardi', '09:00', '19:00', false, 1),
  ('Mercredi', '09:00', '19:00', false, 2),
  ('Jeudi', '09:00', '19:00', false, 3),
  ('Vendredi', '09:00', '19:00', false, 4),
  ('Samedi', '09:00', '19:00', false, 5),
  ('Dimanche', '09:00', '19:00', true, 6)
ON CONFLICT (day) DO NOTHING;
