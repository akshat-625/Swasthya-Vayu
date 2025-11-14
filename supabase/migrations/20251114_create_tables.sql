-- Create movement_members table for Join Movement signups
CREATE TABLE IF NOT EXISTS movement_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create users table for authentication and health profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER DEFAULT 25,
  city TEXT DEFAULT 'Not specified',
  asthma BOOLEAN DEFAULT FALSE,
  heart_disease BOOLEAN DEFAULT FALSE,
  diabetes BOOLEAN DEFAULT FALSE,
  lung_disease BOOLEAN DEFAULT FALSE,
  other_conditions BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE movement_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (for hackathon demo)
CREATE POLICY "Allow public read access on movement_members" 
  ON movement_members FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access on movement_members" 
  ON movement_members FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access on users" 
  ON users FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access on users" 
  ON users FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access on users" 
  ON users FOR UPDATE 
  USING (true);

-- Create function to get total member count
CREATE OR REPLACE FUNCTION get_member_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM movement_members;
$$ LANGUAGE SQL STABLE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_movement_members_email ON movement_members(email);
CREATE INDEX IF NOT EXISTS idx_movement_members_created_at ON movement_members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert access on contact_messages" 
  ON contact_messages FOR INSERT 
  WITH CHECK (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
