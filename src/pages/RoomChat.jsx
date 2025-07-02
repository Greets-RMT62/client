import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  MessageSquareQuote,
  Send,
  Paperclip,
  Plus,
  Menu,
  X,
  File,
  Image,
  Users,
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Mic,
  Settings,
  Bell,
  Moon,
  Sun,
  Zap,
  Crown,
  Shield,
  CheckCircle2,
} from "lucide-react";

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
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageIndex: null,
  });
  const [dropdownState, setDropdownState] = useState({
    createDropdown: false,
    menuDropdown: false,
    attachDropdown: false,
    chatMenu: false,
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", avatar: "👩‍💼", status: "online" },
    { id: 2, name: "Bob", avatar: "👨‍💼", status: "away" },
    { id: 3, name: "Charlie", avatar: "👨‍💻", status: "online" },
    { id: 4, name: "Diana", avatar: "👩‍🎨", status: "offline" },
    { id: 5, name: "Sarah", avatar: "👩‍💻", status: "online" },
  ]);

  const messageContainerRef = useRef(null);
  const USERNAME = "You";

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }

    const handleClickOutside = (e) => {
      if (contextMenu.visible && !e.target.closest("#messageContextMenu")) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }

      if (!e.target.closest(".dropdown-trigger")) {
        setDropdownState({
          createDropdown: false,
          menuDropdown: false,
          attachDropdown: false,
          chatMenu: false,
        });
        setShowUserList(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [chats, contextMenu.visible]);

  const toggleDropdown = (dropdown) => {
    setDropdownState((prev) => {
      const newState = {
        createDropdown: false,
        menuDropdown: false,
        attachDropdown: false,
        chatMenu: false,
      };
      newState[dropdown] = !prev[dropdown];
      return newState;
    });
  };

  const showContextMenu = (e, messageIndex) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      messageIndex,
    });
  };

  const replyToMessage = () => {
    if (contextMenu.messageIndex !== null && activeChat) {
      const message = activeChat.messages[contextMenu.messageIndex];
      setReplyingTo({
        from: message.from,
        text: message.text,
      });
    }
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const deleteMessage = () => {
    if (contextMenu.messageIndex !== null && activeChat) {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === activeChat.id) {
            const updatedMessages = [...chat.messages];
            updatedMessages.splice(contextMenu.messageIndex, 1);
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        });
      });
    }
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const openChat = (id) => {
    const chat = chats.find((c) => c.id === id);
    setActiveChat(chat);
    setReplyingTo(null);

    // Mark as read
    setChats((prevChats) =>
      prevChats.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const now = new Date();
    const timestamp = now.toTimeString().slice(0, 5);

    const newMessage = {
      text: message,
      from: USERNAME,
      timestamp,
      avatar: "😊",
    };

    if (replyingTo) {
      newMessage.replyTo = replyingTo;
      setReplyingTo(null);
    }

    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      });
    });

    setMessage("");
    setIsTyping(false);
  };

  const deleteChat = (id) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    if (activeChat && activeChat.id === id) {
      setActiveChat(null);
    }
  };

  const createChat = (isGroup) => {
    if (isGroup) {
      const name = prompt(`Enter Group Chat Name:`);
      if (!name) return;

      const now = new Date();
      const timestamp = now.toTimeString().slice(0, 5);

      const newChat = {
        id: Date.now(),
        name,
        isGroup,
        avatar: "🎯",
        lastSeen: "just created",
        unreadCount: 0,
        isPinned: false,
        messages: [
          {
            text: "New chat created.",
            from: "System",
            timestamp,
            avatar: "⚡",
          },
        ],
      };

      setChats((prev) => [...prev, newChat]);
    } else {
      setShowUserList((prev) => !prev);
    }
  };

  const startPrivateChat = (user) => {
    const existingChat = chats.find(
      (chat) => !chat.isGroup && chat.name === user.name
    );

    if (existingChat) {
      openChat(existingChat.id);
    } else {
      const now = new Date();
      const timestamp = now.toTimeString().slice(0, 5);

      const newChat = {
        id: Date.now(),
        name: user.name,
        isGroup: false,
        avatar: user.avatar,
        lastSeen: user.status,
        unreadCount: 0,
        isPinned: false,
        messages: [
          { text: "Chat started.", from: "System", timestamp, avatar: "⚡" },
        ],
      };

      setChats((prev) => [...prev, newChat]);
      setActiveChat(newChat);
    }

    setShowUserList(false);
    setDropdownState((prev) => ({ ...prev, createDropdown: false }));
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "away":
        return "bg-yellow-400";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-green-400";
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 text-gray-900";

  return (
    <div
      className={`flex h-screen transition-all duration-500 ${themeClasses}`}
    >
      {/* Sidebar */}
      <aside
        className={`w-full sm:w-1/3 lg:w-1/4 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white/80 backdrop-blur-xl border-white/20"
        } border-r flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-opacity-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Chats
              </h1>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Stay connected
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                isDarkMode
                  ? "hover:bg-gray-700 text-yellow-400"
                  : "hover:bg-purple-100 text-purple-600"
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative dropdown-trigger">
              <button
                onClick={() => toggleDropdown("createDropdown")}
                className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Plus size={18} />
              </button>
              {dropdownState.createDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-48 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white/90 backdrop-blur-xl border-white/20"
                  } border rounded-2xl shadow-2xl z-10 overflow-hidden`}
                >
                  <button
                    onClick={() => createChat(false)}
                    className={`block w-full text-left px-6 py-3 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                    } transition-all duration-200 flex items-center gap-3`}
                  >
                    <Users size={16} className="text-blue-500" />
                    <span>Private Chat</span>
                  </button>
                  <button
                    onClick={() => createChat(true)}
                    className={`block w-full text-left px-6 py-3 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                    } transition-all duration-200 flex items-center gap-3`}
                  >
                    <Crown size={16} className="text-yellow-500" />
                    <span>Group Chat</span>
                  </button>
                </div>
              )}

              {showUserList && (
                <div
                  className={`absolute right-0 mt-2 w-64 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white/90 backdrop-blur-xl border-white/20"
                  } border rounded-2xl shadow-2xl z-20 overflow-hidden`}
                >
                  <div
                    className={`p-4 text-sm ${
                      isDarkMode
                        ? "text-gray-300 border-gray-700"
                        : "text-gray-600 border-gray-100"
                    } border-b font-medium`}
                  >
                    Select User to Chat
                  </div>
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => startPrivateChat(user)}
                      className={`block w-full text-left px-6 py-3 ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <div className="relative">
                        <span className="text-2xl">{user.avatar}</span>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                            user.status
                          )} rounded-full border-2 ${
                            isDarkMode ? "border-gray-800" : "border-white"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } capitalize`}
                        >
                          {user.status}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative dropdown-trigger">
              <button
                onClick={() => toggleDropdown("menuDropdown")}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Settings size={18} />
              </button>
              {dropdownState.menuDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-48 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white/90 backdrop-blur-xl border-white/20"
                  } border rounded-2xl shadow-2xl z-10 overflow-hidden`}
                >
                  <button
                    className={`block w-full text-left px-6 py-3 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                    } transition-all duration-200 flex items-center gap-3`}
                  >
                    <Bell size={16} className="text-blue-500" />
                    <span>Notifications</span>
                  </button>
                  <button
                    onClick={() => alert("Logout successful!")}
                    className={`block w-full text-left px-6 py-3 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-red-50"
                    } transition-all duration-200 flex items-center gap-3 text-red-500`}
                  >
                    <Shield size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-gray-400" : "text-gray-400"
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-100 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-1 px-2">
          {filteredChats.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            return (
              <div
                key={chat.id}
                className={`mx-2 mb-2 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  activeChat?.id === chat.id
                    ? isDarkMode
                      ? "bg-gray-700 shadow-lg"
                      : "bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg"
                    : isDarkMode
                    ? "hover:bg-gray-700/50"
                    : "hover:bg-white/50"
                } cursor-pointer group`}
              >
                <div className="px-4 py-4 flex justify-between items-center">
                  <div
                    className="cursor-pointer flex-1 flex items-center gap-3"
                    onClick={() => openChat(chat.id)}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-xl shadow-lg">
                        {chat.avatar}
                      </div>
                      {chat.lastSeen === "online" && (
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 ${
                            isDarkMode ? "border-gray-800" : "border-white"
                          }`}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{chat.name}</h3>
                        {chat.isPinned && (
                          <Zap size={14} className="text-yellow-500" />
                        )}
                        {chat.isGroup && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode
                                ? "bg-purple-900 text-purple-300"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            Group
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-sm truncate flex items-center gap-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {lastMessage && (
                          <>
                            {lastMessage.from === USERNAME && (
                              <CheckCircle2
                                size={12}
                                className="text-green-500"
                              />
                            )}
                            <span>
                              {lastMessage.from === USERNAME
                                ? "You: "
                                : `${lastMessage.from}: `}
                              {lastMessage.text}
                            </span>
                          </>
                        )}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {chat.lastSeen}
                      </div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-xl ${
                      isDarkMode
                        ? "hover:bg-gray-600 text-gray-400 hover:text-red-400"
                        : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header
          className={`p-6 ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white/50 backdrop-blur-xl border-white/20"
          } border-b flex justify-between items-center shadow-sm`}
        >
          <div className="flex items-center gap-4">
            {activeChat && (
              <>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    {activeChat.avatar}
                  </div>
                  {activeChat.lastSeen === "online" && (
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 ${
                        isDarkMode ? "border-gray-800" : "border-white"
                      }`}
                    ></div>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-xl">{activeChat.name}</h2>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } flex items-center gap-2`}
                  >
                    {activeChat.isGroup ? (
                      <>
                        <Users size={14} />
                        <span>
                          {
                            activeChat.messages.filter(
                              (m) => m.from !== "System"
                            ).length
                          }{" "}
                          members
                        </span>
                      </>
                    ) : (
                      <span>{activeChat.lastSeen}</span>
                    )}
                    {isTyping && (
                      <span className="text-green-500 animate-pulse">
                        • typing...
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}
            {!activeChat && (
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome to Chat
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Select a chat to start messaging
                </p>
              </div>
            )}
          </div>

          {activeChat && (
            <div className="flex items-center gap-2">
              <button
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-green-400"
                    : "hover:bg-green-50 text-green-600"
                }`}
              >
                <Phone size={20} />
              </button>
              <button
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-blue-400"
                    : "hover:bg-blue-50 text-blue-600"
                }`}
              >
                <Video size={20} />
              </button>
              <div className="relative dropdown-trigger">
                <button
                  onClick={() => toggleDropdown("chatMenu")}
                  className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <MoreVertical size={20} />
                </button>
                {dropdownState.chatMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-48 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white/90 backdrop-blur-xl border-white/20"
                    } border rounded-2xl shadow-2xl z-10 overflow-hidden`}
                  >
                    <button
                      className={`block w-full text-left px-6 py-3 ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <Users size={16} className="text-purple-500" />
                      <span>View Members</span>
                    </button>
                    <button
                      className={`block w-full text-left px-6 py-3 ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <Bell size={16} className="text-blue-500" />
                      <span>Mute Chat</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <div
          ref={messageContainerRef}
          className={`flex-1 overflow-y-auto p-6 space-y-4 ${
            isDarkMode
              ? "bg-gray-900"
              : "bg-gradient-to-b from-purple-50/30 to-pink-50/30"
          }`}
        >
          {activeChat && activeChat.messages.length > 0 ? (
            activeChat.messages.map((msg, index) => {
              const isMe = msg.from === USERNAME;
              const isSystem = msg.from === "System";

              if (isSystem) {
                return (
                  <div key={index} className="flex justify-center">
                    <div
                      className={`px-4 py-2 rounded-full text-xs ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-white/70 text-gray-500"
                      } backdrop-blur-sm`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  } group`}
                  onContextMenu={(e) => showContextMenu(e, index)}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg ${
                      isMe ? "order-2" : "order-1"
                    }`}
                  >
                    {activeChat.isGroup && !isMe && (
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <span className="text-lg">{msg.avatar}</span>
                        <span
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {msg.from}
                        </span>
                      </div>
                    )}

                    {msg.replyTo && (
                      <div
                        className={`mb-2 p-3 rounded-2xl text-sm ${
                          isDarkMode
                            ? "bg-gray-700/50 border-l-4 border-purple-500"
                            : "bg-white/50 border-l-4 border-purple-400"
                        } backdrop-blur-sm`}
                      >
                        <div
                          className={`font-medium text-xs mb-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Replying to {msg.replyTo.from}
                        </div>
                        <div
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } truncate`}
                        >
                          {msg.replyTo.text}
                        </div>
                      </div>
                    )}

                    <div
                      className={`px-6 py-4 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-sm ${
                        isMe
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white ml-4"
                          : isDarkMode
                          ? "bg-gray-700/80 text-white mr-4"
                          : "bg-white/80 text-gray-900 mr-4"
                      }`}
                    >
                      <div className="break-words">{msg.text}</div>
                    </div>

                    <div
                      className={`flex items-center gap-2 mt-2 px-2 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                      {isMe && (
                        <CheckCircle2 size={12} className="text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                {activeChat ? (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto shadow-2xl">
                      💬
                    </div>
                    <p
                      className={`text-lg font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      No messages yet
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Start the conversation with {activeChat.name}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto shadow-2xl animate-pulse">
                      🚀
                    </div>
                    <h3
                      className={`text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}
                    >
                      Welcome to Modern Chat
                    </h3>
                    <p
                      className={`text-lg ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } max-w-md mx-auto`}
                    >
                      Select a chat from the sidebar to start messaging, or
                      create a new chat to connect with your team.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {activeChat && (
          <div
            className={`p-6 ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/50 backdrop-blur-xl border-white/20"
            } border-t`}
          >
            {/* Reply indicator */}
            {replyingTo && (
              <div
                className={`mb-4 p-4 rounded-2xl ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600"
                    : "bg-purple-50 border border-purple-200"
                } backdrop-blur-sm transition-all duration-300`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      Replying to {replyingTo.from}
                    </div>
                    <div
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      } text-sm`}
                    >
                      {replyingTo.text}
                    </div>
                  </div>
                  <button
                    onClick={cancelReply}
                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                      isDarkMode
                        ? "hover:bg-gray-600 text-gray-400"
                        : "hover:bg-red-100 text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Input bar */}
            <div
              className={`flex items-center gap-3 p-4 rounded-3xl ${
                isDarkMode ? "bg-gray-700/50" : "bg-white/70"
              } backdrop-blur-xl shadow-2xl border ${
                isDarkMode ? "border-gray-600" : "border-white/30"
              }`}
            >
              <div className="relative dropdown-trigger">
                <button
                  onClick={() => toggleDropdown("attachDropdown")}
                  className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                    isDarkMode
                      ? "hover:bg-gray-600 text-gray-300"
                      : "hover:bg-purple-100 text-purple-600"
                  }`}
                >
                  <Paperclip size={20} />
                </button>
                {dropdownState.attachDropdown && (
                  <div
                    className={`absolute bottom-full mb-2 w-48 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white/90 backdrop-blur-xl border-white/20"
                    } border rounded-2xl shadow-2xl z-10 overflow-hidden`}
                  >
                    <button
                      className={`block w-full text-left px-6 py-3 ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <File size={16} className="text-blue-500" />
                      <span>Send File</span>
                    </button>
                    <button
                      className={`block w-full text-left px-6 py-3 ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <Image size={16} className="text-green-500" />
                      <span>Send Image</span>
                    </button>
                    <button
                      className={`block w-full text-left px-6 py-3 ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                      } transition-all duration-200 flex items-center gap-3`}
                    >
                      <Mic size={16} className="text-red-500" />
                      <span>Voice Message</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? "hover:bg-gray-600 text-gray-300"
                    : "hover:bg-yellow-100 text-yellow-600"
                }`}
              >
                <Smile size={20} />
              </button>

              <input
                type="text"
                className={`flex-1 bg-transparent border-0 focus:outline-none text-lg placeholder-opacity-70 ${
                  isDarkMode
                    ? "text-white placeholder-gray-400"
                    : "text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Type your message..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                  message.trim()
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                    : isDarkMode
                    ? "bg-gray-600 text-gray-400"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          id="messageContextMenu"
          className={`absolute ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white/90 backdrop-blur-xl border-white/20"
          } border rounded-2xl shadow-2xl z-30 w-48 overflow-hidden`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={replyToMessage}
            className={`block w-full text-left px-6 py-3 ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
            } transition-all duration-200 flex items-center gap-3`}
          >
            <MessageSquareQuote size={16} className="text-blue-500" />
            <span>Reply</span>
          </button>
          <button
            onClick={deleteMessage}
            className={`block w-full text-left px-6 py-3 ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-red-50"
            } transition-all duration-200 flex items-center gap-3 text-red-500`}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .message-bubble {
          animation: fadeInUp 0.4s ease-out;
        }

        .chat-item:hover {
          transform: translateX(4px);
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}
