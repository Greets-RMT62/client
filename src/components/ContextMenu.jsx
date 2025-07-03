import { useState, useEffect } from "react";
import { MessageSquareQuote, Trash2 } from "lucide-react";

export default function ContextMenu({
  activeChat,
  setChats,
  setReplyingTo,
  isDarkMode,
}) {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageIndex: null,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu.visible && !e.target.closest("#messageContextMenu")) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu.visible]);

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
  if (!contextMenu.visible) return { contextMenu: null, showContextMenu };

  return {
    contextMenu: (
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
    ),
    showContextMenu,
  };
}
