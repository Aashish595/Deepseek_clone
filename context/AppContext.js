"use client"; // 👈 This tells Next.js it's a client component

import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ 1. Create the context
const AppContext = createContext();

// ✅ 2. Export the context hook
export const useAppContext = () => useContext(AppContext);

// ✅ 3. Export the provider
export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({ messages: [] });

  const [messages, setMessages] = useState([]); // Add this inside AppContextProvider

  const createNewChat = async () => {
    try {
      if (!user) return null;
      const token = await getToken();

      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchUserChats();
    } catch (error) {
      toast.error(error.message || "Failed to create new chat");
    }
  };

  const fetchUserChats = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        "/api/chat/get",
        // {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setChats(data.data);

        if (data.data.length > 0) {
          data.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          setSelectedChat(data.data[0]);
        } else {
          setSelectedChat({ messages: [] });
        }
      } else {
        toast.error(data.message || "Failed to fetch user chats");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch user chats");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserChats();
    }
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchUserChats,
    createNewChat,
    messages,
    setMessages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
