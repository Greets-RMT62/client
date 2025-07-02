import { useRef, useEffect, useState } from "react";
import {
  Send,
  Paperclip,
  X,
  File,
  Image,
  Users,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Mic,
  Bell,
  CheckCircle2,
} from "lucide-react";
import ContextMenu from "./ContextMenu";

export default function ChatArea({
  activeChat,
  chats,
  setChats,
  isDarkMode,
  USERNAME,
  replyingTo,
  setReplyingTo,
}) {
  const messageContainerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dropdownState, setDropdownState] = useState({
    createDropdown: false,
    menuDropdown: false,
    attachDropdown: false,
    chatMenu: false,
  });

  const { contextMenu, showContextMenu } = ContextMenu({
    activeChat,
    setChats,
    setReplyingTo,
    isDarkMode,
  });

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

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

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
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
                          activeChat.messages.filter((m) => m.from !== "System")
                            .length
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
              onClick={() => alert("Feature coming soon!")}
              className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                isDarkMode
                  ? "hover:bg-gray-700 text-green-400"
                  : "hover:bg-green-50 text-green-600"
              }`}
            >
              <Phone size={20} />
            </button>
            <button
              onClick={() => alert("Feature coming soon!")}
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
                    Select a chat from the sidebar to start messaging, or create
                    a new chat to connect with your team.
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

      {/* Context Menu */}
      {contextMenu}
    </main>
  );
}
