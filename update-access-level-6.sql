ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_access_level_check;

ALTER TABLE profiles ADD CONSTRAINT profiles_access_level_check CHECK (access_level IN (1, 2, 3, 4, 5, 6));

