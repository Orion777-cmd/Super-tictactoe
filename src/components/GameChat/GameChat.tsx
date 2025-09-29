import React, { useState, useRef, useEffect } from "react";
import { useChat, ChatMessage } from "../../hooks/useChat";
import { useAuth } from "../../state/authContext";
import "./GameChat.styles.css";

interface GameChatProps {
  roomId: string;
  className?: string;
}

const GameChat: React.FC<GameChatProps> = ({ roomId, className = "" }) => {
  const { user } = useAuth();
  const { messages, loading, error, sendMessage, isConnected } =
    useChat(roomId);
  const [newMessage, setNewMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat is expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageTypeClass = (message: ChatMessage) => {
    if (message.type === "system") return "system-message";
    if (message.type === "game_event") return "game-event-message";
    if (message.userId === user?.userId) return "own-message";
    return "other-message";
  };

  const getMessageIcon = (message: ChatMessage) => {
    if (message.type === "system") return "🔧";
    if (message.type === "game_event") return "🎮";
    return "💬";
  };

  return (
    <div
      className={`game-chat ${className} ${
        isExpanded ? "expanded" : "collapsed"
      }`}
    >
      {/* Chat Header */}
      <div className="chat-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="chat-title">
          <span className="chat-icon">💬</span>
          {isExpanded && <span>Chat</span>}
        </div>
        {isExpanded && (
          <div className="chat-toggle">{isExpanded ? "−" : "+"}</div>
        )}
      </div>

      {/* Chat Content */}
      {isExpanded && (
        <div className="chat-content">
          {/* Messages */}
          <div className="chat-messages">
            {loading && (
              <div className="loading-message">
                <span>Loading chat...</span>
              </div>
            )}

            {error && (
              <div className="error-message">
                <span>⚠️ {error}</span>
              </div>
            )}

            {messages.length === 0 && !loading && (
              <div className="empty-chat">
                <span>No messages yet. Start the conversation!</span>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${getMessageTypeClass(message)}`}
              >
                <div className="message-header">
                  <span className="message-icon">
                    {getMessageIcon(message)}
                  </span>
                  <span className="message-username">
                    {message.type === "system" ? "System" : message.username}
                  </span>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="message-content">{message.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <div className="chat-input-container">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="chat-input"
                maxLength={200}
                disabled={!isConnected}
              />
              <button
                type="submit"
                className="send-button"
                disabled={!newMessage.trim() || !isConnected}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GameChat;
