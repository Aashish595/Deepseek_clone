"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

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
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data?.success && Array.isArray(data?.data)) {
      const sortedChats = data.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setChats(sortedChats);
      setSelectedChat(sortedChats[0] || null);
    } else {
      toast.error(data?.message || "Failed to fetch user chats");
      setChats([]);
      setSelectedChat(null);
    }
  } catch (error) {
    toast.error(error.message || "Failed to fetch user chats");
    setChats([]);
    setSelectedChat(null);
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