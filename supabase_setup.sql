-- User_likes table to track which users liked which posts
CREATE TABLE IF NOT EXISTS user_likes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES "Posts"(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id) -- Ensures one user can only like a post once
);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own likes
CREATE POLICY "Users can view their own likes" ON user_likes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own likes
CREATE POLICY "Users can insert their own likes" ON user_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own likes
CREATE POLICY "Users can delete their own likes" ON user_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_post_id ON user_likes(post_id);
