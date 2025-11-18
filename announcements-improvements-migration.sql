ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;

CREATE OR REPLACE FUNCTION set_announcement_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD IS DISTINCT FROM NEW THEN
    NEW.updated_at = NOW();
    NEW.is_edited = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_announcement_update ON announcements;
CREATE TRIGGER on_announcement_update
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE PROCEDURE set_announcement_updated_at();

CREATE TABLE IF NOT EXISTS user_push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE user_push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own push subscriptions" ON user_push_subscriptions;
CREATE POLICY "Users can manage their own push subscriptions" ON user_push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

