import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../state/authContext";

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  type: "message" | "system" | "game_event";
}

interface ChatHook {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  isConnected: boolean;
}

export const useChat = (roomId: string): ChatHook => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscriptionRef = useRef<any>(null);

  // Subscribe to chat messages
  useEffect(() => {
    if (!roomId || !user) return;

    setLoading(true);

    // Subscribe to real-time chat messages
    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
        setLoading(false);
      });

    subscriptionRef.current = channel;

    // Fetch existing messages
    fetchMessages();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [roomId, user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("timestamp", { ascending: true })
        .limit(100);

      if (error) throw error;

      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      setError("Failed to load chat messages");
    }
  };

  const sendMessage = useCallback(async (message: string) => {
    if (!user || !roomId || !message.trim()) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        room_id: roomId,
        user_id: user.userId,
        username: user.username || "Anonymous",
        message: message.trim(),
        timestamp: new Date().toISOString(),
        type: "message",
      });

      if (error) throw error;
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  }, [user, roomId]);

  const clearChat = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("room_id", roomId);

      if (error) throw error;

      setMessages([]);
    } catch (err) {
      console.error("Error clearing chat:", err);
      setError("Failed to clear chat");
    }
  }, [roomId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    isConnected,
  };
};
