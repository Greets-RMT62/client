import axios from "axios";

const API_BASE_URL = "https://greets.tryindrahatmojo.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => api.post("/login", { username, password }),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get("/users"),
};

// Rooms API
export const roomsAPI = {
  createRoom: (name, description) => api.post("/rooms", { name, description }),

  getAllRooms: () => api.get("/rooms"),

  inviteUser: (roomId, userId) =>
    api.post(`/rooms/${roomId}/invitations`, { UserId: userId }),
};

// Chats API
export const chatsAPI = {
  getChats: (roomId) => api.get(`/chats/${roomId}`),

  sendMessage: (roomId, text, chatId = null) =>
    api.post(`/chats/${roomId}`, { text, ChatId: chatId }),

  createAIChat: (roomId, message) =>
    api.post(`/rooms/${roomId}/ai-chats`, { message }),

  summarizeChat: (roomId) => api.post(`/rooms/${roomId}/summaries`),
};

// Private Chat API
export const privateChatAPI = {
  createPrivateChat: (targetUserId, message) =>
    api.post("/rooms/private", { targetUserId, message }),
};

export default api;
