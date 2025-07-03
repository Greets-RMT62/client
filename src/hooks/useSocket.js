import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (serverUrl = "https://greets.tryindrahatmojo.com/") => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(serverUrl, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    // Connect to server
    socketRef.current.connect();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [serverUrl]);

  // Join a room
  const joinRoom = (roomId, userId) => {
    if (socketRef.current) {
      socketRef.current.emit("join-room", roomId, userId);
    }
  };

  // Leave a room
  const leaveRoom = (roomId) => {
    if (socketRef.current) {
      socketRef.current.emit("leave-room", roomId);
    }
  };

  // Send a message
  const sendMessage = (messageData) => {
    if (socketRef.current) {
      socketRef.current.emit("send-message", messageData);
    }
  };

  // Send typing indicator
  const sendTyping = (roomId, userId, isTyping) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { roomId, userId, isTyping });
    }
  };

  // Listen for events
  const onReceiveMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("receive-message", callback);
    }
  };

  const onUserJoined = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("user-joined", callback);
    }
  };

  const onUserLeft = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("user-left", callback);
    }
  };

  const onUserTyping = (callback) => {
    if (socketRef.current) {
      socketRef.current.on("user-typing", callback);
    }
  };

  // Remove event listeners
  const offReceiveMessage = () => {
    if (socketRef.current) {
      socketRef.current.off("receive-message");
    }
  };

  const offUserJoined = () => {
    if (socketRef.current) {
      socketRef.current.off("user-joined");
    }
  };

  const offUserLeft = () => {
    if (socketRef.current) {
      socketRef.current.off("user-left");
    }
  };

  const offUserTyping = () => {
    if (socketRef.current) {
      socketRef.current.off("user-typing");
    }
  };

  return {
    socket: socketRef.current,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    onReceiveMessage,
    onUserJoined,
    onUserLeft,
    onUserTyping,
    offReceiveMessage,
    offUserJoined,
    offUserLeft,
    offUserTyping,
  };
};

export default useSocket;
