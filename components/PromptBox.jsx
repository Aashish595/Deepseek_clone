"use client";

import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState("");
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    createNewChat,
  } = useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    const promptCopy = prompt.trim();

    if (!promptCopy) return;

    try {
      if (!user) {
        toast.error("Please login to send a message");
        return;
      }

      setIsLoading(true);
      setPrompt("");

      // Create new chat if none selected
      let activeChat = selectedChat;
      if (!selectedChat?._id) {
        await createNewChat(); // It internally calls fetchUserChats
        const latestChat = chats[0]; // Will be updated by context
        if (!latestChat?._id) {
          toast.error("Failed to create new chat");
          return;
        }
        activeChat = latestChat;
        setSelectedChat(latestChat);
      }

      const userMessage = {
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
      };

      // Optimistically update chat UI
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...(prev?.messages || []), userMessage],
      }));

      // Make API call
      const { data } = await axios.post("/api/chat/ai", {
        chatId: activeChat._id,
        prompt: promptCopy,
      });

      if (data?.success) {
        const aiResponse = data.data;

        // Typewriter effect
        const messageTokens = aiResponse.content.split(" ");
        let displayedContent = "";

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            displayedContent += (i > 0 ? " " : "") + messageTokens[i];
            setSelectedChat((prev) => {
              const updatedMessages = [...(prev.messages || [])];
              const lastUserMsgIndex = updatedMessages.findLastIndex(
                (msg) => msg.role === "user"
              );
              updatedMessages[lastUserMsgIndex + 1] = {
                role: "assistant",
                content: displayedContent,
                timestamp: Date.now(),
              };
              return { ...prev, messages: updatedMessages };
            });
          }, i * 50);
        }

        // Final save in state
        setTimeout(() => {
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat._id === activeChat._id
                ? {
                    ...chat,
                    messages: [
                      ...(chat.messages || []),
                      userMessage,
                      aiResponse,
                    ],
                  }
                : chat
            )
          );
        }, messageTokens.length * 50 + 100);
      } else {
        throw new Error(data?.message || "AI failed to respond");
      }
    } catch (error) {
      console.error("Prompt error:", error);
      toast.error(error.message || "Something went wrong");
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className="w-full max-w-2xl bg-[#404045] p-4 rounded-3xl mt-4 transition-all"
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message DeepSeek"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.deepthink_icon} alt="" />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.search_icon} alt="" />
            Search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              prompt ? "bg-primary" : "bg-[#71717a]"
            } rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 h-auto"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
