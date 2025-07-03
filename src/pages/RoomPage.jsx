import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function RoomPage() {
  const { id } = useParams();
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const response = await axios.get(
      `https://greets.tryindrahatmojo.com/chats/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    setChats(response.data);
  };
  const handleSendMessage = async (message) => {
    await axios.post(
      `https://greets.tryindrahatmojo.com/chats/${id}`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    fetchChats();
  };
  useEffect(() => {
    fetchChats();
  }, [id]);
  return (
    <>
      <div className="flex flex-col items-center justify-center  mt-20">
        <h1 className="text-2xl font-bold mb-4">Room {id}</h1>
        <button
          onClick={fetchChats}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Fetch Chats
        </button>
        <div className="mt-4">
          {chats.length > 0 ? (
            chats.map((chat, index) => (
              <div key={index} className="p-2 border-b">
                <strong>{chat.User.username}</strong>:{chat.text}
              </div>
            ))
          ) : (
            <p>No chats available</p>
          )}
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type your message"
            className="border p-2 rounded w-full"
          />
          <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
            Send
          </button>
        </div>
      </div>
    </>
  );
}
