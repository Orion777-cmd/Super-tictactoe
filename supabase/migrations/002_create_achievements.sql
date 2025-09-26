-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wins', 'streaks', 'games', 'special', 'social', 'time')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  points INTEGER NOT NULL DEFAULT 0,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER NOT NULL DEFAULT 0,
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(is_unlocked);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);

-- Insert default achievements
INSERT INTO achievements (id, name, description, icon, category, rarity, points, requirements) VALUES
-- Win-based achievements
('first_win', 'First Victory', 'Win your first game', '🏆', 'wins', 'common', 10, '[{"type": "total_wins", "value": 1, "description": "Win 1 game"}]'),
('win_streak_5', 'Hot Streak', 'Win 5 games in a row', '🔥', 'streaks', 'uncommon', 50, '[{"type": "win_streak", "value": 5, "description": "Win 5 games in a row"}]'),
('win_streak_10', 'Unstoppable', 'Win 10 games in a row', '⚡', 'streaks', 'rare', 100, '[{"type": "win_streak", "value": 10, "description": "Win 10 games in a row"}]'),
('win_100', 'Centurion', 'Win 100 games', '💯', 'wins', 'epic', 500, '[{"type": "total_wins", "value": 100, "description": "Win 100 games"}]'),
('win_500', 'Legend', 'Win 500 games', '👑', 'wins', 'legendary', 1000, '[{"type": "total_wins", "value": 500, "description": "Win 500 games"}]'),

-- Game count achievements
('play_10', 'Getting Started', 'Play 10 games', '🎮', 'games', 'common', 5, '[{"type": "total_games", "value": 10, "description": "Play 10 games"}]'),
('play_50', 'Regular Player', 'Play 50 games', '🎯', 'games', 'uncommon', 25, '[{"type": "total_games", "value": 50, "description": "Play 50 games"}]'),
('play_200', 'Dedicated', 'Play 200 games', '🎲', 'games', 'rare', 100, '[{"type": "total_games", "value": 200, "description": "Play 200 games"}]'),

-- Special achievements
('perfect_game', 'Perfect Game', 'Win a game without losing any small boards', '✨', 'special', 'rare', 75, '[{"type": "perfect_win", "value": 1, "description": "Win a game perfectly"}]'),
('comeback_king', 'Comeback King', 'Win a game after being behind 3-0', '🔄', 'special', 'epic', 150, '[{"type": "comeback_win", "value": 1, "description": "Win after being down 3-0"}]'),
('quick_win', 'Lightning Fast', 'Win a game in under 5 minutes', '⚡', 'time', 'uncommon', 30, '[{"type": "quick_win", "value": 1, "description": "Win a game in under 5 minutes"}]'),
('marathon', 'Marathon Player', 'Play a game that lasts over 30 minutes', '🏃', 'time', 'rare', 50, '[{"type": "long_game", "value": 1, "description": "Play a game over 30 minutes"}]'),

-- Social achievements
('first_opponent', 'Social Butterfly', 'Play against 5 different opponents', '👥', 'social', 'uncommon', 25, '[{"type": "unique_opponents", "value": 5, "description": "Play against 5 different players"}]'),
('chatty', 'Chatty', 'Send 100 messages in game chat', '💬', 'social', 'common', 15, '[{"type": "messages_sent", "value": 100, "description": "Send 100 chat messages"}]'),

-- Win rate achievements
('high_winrate', 'Skilled Player', 'Maintain a 70% win rate over 20 games', '🎯', 'wins', 'rare', 100, '[{"type": "win_rate", "value": 70, "description": "Maintain 70% win rate over 20 games"}]'),
('master', 'Master', 'Maintain an 80% win rate over 50 games', '🧙', 'wins', 'epic', 200, '[{"type": "win_rate", "value": 80, "description": "Maintain 80% win rate over 50 games"}]');

-- Enable Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements (public read access)
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

-- Create policies for user_achievements (users can only see their own)
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own achievements" ON user_achievements
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
