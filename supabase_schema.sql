-- Add new columns for quota management
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free',
ADD COLUMN IF NOT EXISTS monthly_usage int DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reset_date timestamptz DEFAULT now();

-- Verify the columns are added
SELECT * FROM profiles LIMIT 1;
