-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  message TEXT NOT NULL CHECK (length(message) > 0 AND length(message) <= 500),
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  type TEXT DEFAULT 'message' CHECK (type IN ('message', 'system', 'game_event')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view messages in rooms they're part of" ON chat_messages
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM rooms 
      WHERE host_id = auth.uid() OR guest_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in rooms they're part of" ON chat_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    room_id IN (
      SELECT id FROM rooms 
      WHERE host_id = auth.uid() OR guest_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own messages" ON chat_messages
  FOR DELETE USING (user_id = auth.uid());

-- Create function to automatically clean up old messages (optional)
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM chat_messages 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically clean up old messages (optional)
-- This can be run periodically or via a cron job
-- SELECT cleanup_old_chat_messages();
