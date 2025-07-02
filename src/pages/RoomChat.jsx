import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import CustomStyles from "../components/CustomStyles";

export default function RoomChat() {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([
    {
      id: 3,
      name: "Charlie's Team",
      isGroup: true,
      avatar: "🚀",
      lastSeen: "online",
      unreadCount: 2,
      isPinned: true,
      messages: [
        {
          text: "Halo semua!",
          from: "Alice",
          timestamp: "07:50",
          avatar: "👩",
        },
        {
          text: "Siap-siap deploy hari ini ya.",
          from: "Charlie",
          timestamp: "07:55",
          avatar: "👨",
        },
        {
          text: "Noted ya, deploy jam 2.",
          from: "Alice",
          timestamp: "07:56",
          avatar: "👩",
          replyTo: { from: "Charlie", text: "Siap-siap deploy hari ini ya." },
        },
        { text: "Sip!", from: "You", timestamp: "07:58", avatar: "😊" },
      ],
    },
    {
      id: 1,
      name: "Alice",
      isGroup: false,
      avatar: "👩‍💼",
      lastSeen: "2 min ago",
      unreadCount: 0,
      isPinned: false,
      messages: [
        {
          text: "Hai, ada waktu sebentar?",
          from: "You",
          timestamp: "09:00",
          avatar: "😊",
        },
        {
          text: "Ada, kenapa?",
          from: "Alice",
          timestamp: "09:01",
          avatar: "👩‍💼",
        },
        {
          text: "Mau nanya soal project",
          from: "You",
          timestamp: "09:02",
          avatar: "😊",
        },
      ],
    },
    {
      id: 4,
      name: "Dev Squad",
      isGroup: true,
      avatar: "💻",
      lastSeen: "active now",
      unreadCount: 5,
      isPinned: true,
      messages: [
        {
          text: "Morning standup in 10 mins!",
          from: "Sarah",
          timestamp: "08:50",
          avatar: "👩‍💻",
        },
      ],
    },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const USERNAME = "You";

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 text-gray-900";

  return (
    <div
      className={`flex h-screen transition-all duration-500 ${themeClasses}`}
    >
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        setChats={setChats}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        USERNAME={USERNAME}
      />

      <ChatArea
        activeChat={activeChat}
        chats={chats}
        setChats={setChats}
        isDarkMode={isDarkMode}
        USERNAME={USERNAME}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
      />

      <CustomStyles />
    </div>
  );
}
