import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import CustomStyles from "../components/CustomStyles";
import CreateRoomModal from "../components/CreateRoomModal";
import StartPrivateChatModal from "../components/StartPrivateChatModal";
import useSocket from "../hooks/useSocket";
import { roomsAPI, chatsAPI } from "../services/api";
import Swal from "sweetalert2";

export default function RoomChat() {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showPrivateChatModal, setShowPrivateChatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const USERNAME = localStorage.getItem("username") || "You";
  const USER_ID =
    localStorage.getItem("userId") ||
    "user_" + Math.random().toString(36).substr(2, 9);

  // Initialize Socket.IO
  const socket = useSocket();

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await roomsAPI.getAllRooms();

      // Transform API response to match our chat structure
      const transformedChats = response.data.map((userRoom) => ({
        id: userRoom.Room.id,
        name: userRoom.Room.name,
        isGroup: userRoom.Room.roomType === "group-chat",
        avatar: userRoom.Room.roomType === "group-chat" ? "👥" : "👤",
        lastSeen: "online",
        unreadCount: 0,
        isPinned: false,
        messages: [],
        roomType: userRoom.Room.roomType,
        description: userRoom.Room.description,
        owner: userRoom.Room.Owner,
      }));

      setChats(transformedChats);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load rooms",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a specific room
  const fetchMessages = async (roomId) => {
    try {
      const response = await chatsAPI.getChats(roomId);

      // Transform API response to match our message structure
      const transformedMessages = response.data.map((chat) => ({
        id: chat.id,
        text: chat.text,
        from: chat.User?.username || "Unknown",
        timestamp: new Date(chat.createdAt).toTimeString().slice(0, 5),
        avatar: "😊",
        userId: chat.UserId,
      }));

      // Update the specific chat with messages
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === roomId ? { ...chat, messages: transformedMessages } : chat
        )
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load messages",
      });
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket?.socket) return;

    // Listen for incoming messages
    socket.onReceiveMessage((messageData) => {
      console.log("Received message:", messageData);

      // Add the message to the appropriate room
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === messageData.roomId) {
            // Check if message already exists to avoid duplicates
            const messageExists = chat.messages.some(
              (msg) => msg.id === messageData.message.id
            );
            if (messageExists) {
              return chat;
            }

            return {
              ...chat,
              messages: [...chat.messages, messageData.message],
              unreadCount:
                chat.id === activeChat?.id ? 0 : chat.unreadCount + 1,
            };
          }
          return chat;
        });
      });

      // Update activeChat if user is currently viewing this room
      if (activeChat && activeChat.id === messageData.roomId) {
        console.log(
          "Updating activeChat with new message for room:",
          messageData.roomId
        );
        setActiveChat((prevActiveChat) => {
          if (!prevActiveChat || prevActiveChat.id !== messageData.roomId) {
            return prevActiveChat;
          }

          // Check if message already exists
          const messageExists = prevActiveChat.messages.some(
            (msg) => msg.id === messageData.message.id
          );
          if (messageExists) {
            console.log(
              "Message already exists in activeChat, skipping duplicate"
            );
            return prevActiveChat;
          }

          console.log("Adding new message to activeChat:", messageData.message);
          return {
            ...prevActiveChat,
            messages: [...prevActiveChat.messages, messageData.message],
          };
        });
      } else {
        console.log(
          "User not in active room or no active chat. ActiveChat ID:",
          activeChat?.id,
          "Message Room ID:",
          messageData.roomId
        );
      }
    });

    // Listen for user joined
    socket.onUserJoined((data) => {
      console.log("User joined:", data);
    });

    // Listen for user left
    socket.onUserLeft((data) => {
      console.log("User left:", data);
    });

    // Listen for typing indicators
    socket.onUserTyping((data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.userId]: data.isTyping,
      }));

      // Clear typing indicator after 3 seconds
      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => ({
            ...prev,
            [data.userId]: false,
          }));
        }, 3000);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      socket.offReceiveMessage();
      socket.offUserJoined();
      socket.offUserLeft();
      socket.offUserTyping();
    };
  }, [socket, activeChat, USER_ID]);

  // Join room when active chat changes and fetch messages
  useEffect(() => {
    if (activeChat && socket?.socket) {
      socket.joinRoom(activeChat.id, USER_ID);

      // Fetch messages for the active chat if not already loaded
      if (activeChat.messages.length === 0) {
        fetchMessages(activeChat.id);
      }
    }
  }, [activeChat, socket, USER_ID]);

  // Sync activeChat with chats state for real-time updates
  useEffect(() => {
    if (activeChat) {
      const updatedChat = chats.find((chat) => chat.id === activeChat.id);
      if (
        updatedChat &&
        updatedChat.messages.length !== activeChat.messages.length
      ) {
        setActiveChat(updatedChat);
      }
    }
  }, [chats, activeChat]);

  // Function to send message - moved from ChatArea to RoomChat
  const sendMessage = async (messageText, replyTo = null) => {
    if (!messageText.trim() || !activeChat) return;

    console.log("Sending message:", messageText, "to room:", activeChat.id);

    const now = new Date();
    const timestamp = now.toTimeString().slice(0, 5);

    // Create temporary message for immediate UI update
    const tempMessage = {
      text: messageText,
      from: USERNAME,
      timestamp,
      avatar: "😊",
      id: Date.now() + Math.random(),
      userId: USER_ID,
    };

    if (replyTo) {
      tempMessage.replyTo = replyTo;
      setReplyingTo(null); // Clear reply state after using it
    }

    console.log("New message object:", tempMessage);

    // Add message to local state immediately for better UX
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === activeChat.id) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, tempMessage],
          };
          console.log("Updated chat messages:", updatedChat.messages);
          return updatedChat;
        }
        return chat;
      });
      console.log("Updated chats state:", updatedChats);
      return updatedChats;
    });

    try {
      // Send message to API
      const response = await chatsAPI.sendMessage(
        activeChat.id,
        messageText,
        replyTo?.id || null
      );

      console.log("Message sent successfully:", response.data);

      // Update the temporary message with real data from server
      const realMessage = {
        id: response.data.id,
        text: response.data.text,
        from: USERNAME,
        timestamp: new Date(response.data.createdAt).toTimeString().slice(0, 5),
        avatar: "😊",
        userId: response.data.UserId,
      };

      // Replace temporary message with real message
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === activeChat.id) {
            const updatedMessages = chat.messages.map((msg) =>
              msg.id === tempMessage.id ? realMessage : msg
            );
            return {
              ...chat,
              messages: updatedMessages,
            };
          }
          return chat;
        });
      });

      // Send message via Socket.IO to other users
      if (socket?.socket) {
        console.log("Sending via Socket.IO to room:", activeChat.id);
        socket.sendMessage({
          roomId: activeChat.id,
          message: realMessage,
          userId: realMessage.userId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove temporary message on error
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              messages: chat.messages.filter(
                (msg) => msg.id !== tempMessage.id
              ),
            };
          }
          return chat;
        });
      });

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send message",
      });
    }
  };

  // Handle room creation
  const handleRoomCreated = (newRoom) => {
    // Add new room to chats list
    const newChat = {
      id: newRoom.id,
      name: newRoom.name,
      isGroup: newRoom.roomType === "group-chat",
      avatar: newRoom.roomType === "group-chat" ? "👥" : "👤",
      lastSeen: "online",
      unreadCount: 0,
      isPinned: false,
      messages: [],
      roomType: newRoom.roomType,
      description: newRoom.description,
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat); // Automatically select the new room
  };

  // Handle private chat creation
  const handlePrivateChatCreated = () => {
    // Refresh rooms to get the new private chat
    fetchRooms();
  };

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
        isLoading={isLoading}
        onCreateRoom={() => setShowCreateRoomModal(true)}
        onStartPrivateChat={() => setShowPrivateChatModal(true)}
      />

      <ChatArea
        activeChat={activeChat}
        chats={chats}
        setChats={setChats}
        isDarkMode={isDarkMode}
        USERNAME={USERNAME}
        USER_ID={USER_ID}
        socket={socket}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        typingUsers={typingUsers}
        sendMessage={sendMessage}
      />

      {/* Modals */}
      <CreateRoomModal
        isOpen={showCreateRoomModal}
        onClose={() => setShowCreateRoomModal(false)}
        onRoomCreated={handleRoomCreated}
      />

      <StartPrivateChatModal
        isOpen={showPrivateChatModal}
        onClose={() => setShowPrivateChatModal(false)}
        onChatCreated={handlePrivateChatCreated}
      />

      <CustomStyles />
    </div>
  );
}
