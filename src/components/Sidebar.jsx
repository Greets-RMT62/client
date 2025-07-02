import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Menu,
  X,
  Users,
  Search,
  Settings,
  Bell,
  Moon,
  Sun,
  Zap,
  Crown,
  Shield,
  CheckCircle2,
} from "lucide-react";

export default function Sidebar({
  chats,
  activeChat,
  setActiveChat,
  setChats,
  isDarkMode,
  setIsDarkMode,
  USERNAME,
  isLoading = false,
  onCreateRoom,
  onStartPrivateChat,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownState, setDropdownState] = useState({
    createDropdown: false,
    menuDropdown: false,
    attachDropdown: false,
    chatMenu: false,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-trigger")) {
        setDropdownState({
          createDropdown: false,
          menuDropdown: false,
          attachDropdown: false,
          chatMenu: false,
        });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  const openChat = (id) => {
    const chat = chats.find((c) => c.id === id);
    setActiveChat(chat);

    // Mark as read
    setChats((prevChats) =>
      prevChats.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const deleteChat = (id) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    if (activeChat && activeChat.id === id) {
      setActiveChat(null);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
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
            <img src="/G-logo.png" alt="" />
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
                  onClick={() => {
                    onStartPrivateChat();
                    setDropdownState((prev) => ({
                      ...prev,
                      createDropdown: false,
                    }));
                  }}
                  className={`block w-full text-left px-6 py-3 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                  } transition-all duration-200 flex items-center gap-3`}
                >
                  <Users size={16} className="text-blue-500" />
                  <span>Private Chat</span>
                </button>
                <button
                  onClick={() => {
                    onCreateRoom();
                    setDropdownState((prev) => ({
                      ...prev,
                      createDropdown: false,
                    }));
                  }}
                  className={`block w-full text-left px-6 py-3 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                  } transition-all duration-200 flex items-center gap-3`}
                >
                  <Crown size={16} className="text-yellow-500" />
                  <span>Group Chat</span>
                </button>
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
  );
}
