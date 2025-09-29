export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
  message_type: "text" | "system" | "game_event";
}

export interface ChatMessageWithUser extends ChatMessage {
  user?: {
    username: string;
    avatar_url?: string;
  };
}
