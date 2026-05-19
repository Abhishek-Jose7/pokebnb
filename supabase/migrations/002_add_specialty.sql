-- Add specialty column to profiles for judge filtering
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty TEXT;

-- Common specialties: webdev, blockchain, aiml
-- This allows admin to filter judges by their expertise area
