import { useState, useEffect } from "react";
import { X, MessageCircle, Search } from "lucide-react";
import { usersAPI, privateChatAPI } from "../services/api";
import Swal from "sweetalert2";

export default function StartPrivateChatModal({
  isOpen,
  onClose,
  onChatCreated,
}) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await usersAPI.getAllUsers();
      // Filter out current user from the list
      const currentUserId = localStorage.getItem("userId");
      const filteredUsers = response.data.filter(
        (user) => user.id.toString() !== currentUserId
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load users",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) return;

    setIsLoading(true);
    try {
      const response = await privateChatAPI.createPrivateChat(
        selectedUser.id,
        message
      );

      Swal.fire({
        icon: "success",
        title: "Private Chat Started!",
        text: `Chat with ${selectedUser.username} has been created.`,
        timer: 2000,
        showConfirmButton: false,
      });

      onChatCreated(response.data);
      setMessage("");
      setSelectedUser(null);
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Error creating private chat:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to create private chat",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="text-purple-600" size={24} />
            Start Private Chat
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Users */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto mb-4 max-h-48">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <span className="animate-spin text-2xl">⏳</span>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    selectedUser?.id === user.id
                      ? "bg-purple-100 border-2 border-purple-500"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">
                      {user.username}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No users found" : "No users available"}
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedUser && (
          <form onSubmit={handleStartChat} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start conversation with {selectedUser.username}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your first message..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    Start Chat
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
