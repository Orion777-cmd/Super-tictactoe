export interface Profile {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_active?: string;
}

export interface UserProfile extends Profile {
  // Additional user-specific fields
  total_games?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  win_rate?: number;
}
