'use client'
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm DeepSeek. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (prompt) => {
    if (!prompt.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: prompt }]);
    setIsLoading(true);
    
    try {
      // Here you would typically call your API/backend
      // This is a mock implementation - replace with actual API call
      const response = await mockApiCall(prompt);
      
      // Add assistant response
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock API call - replace with real implementation
  const mockApiCall = async (prompt) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple echo response - replace with actual AI response
    return `This is a mock response to: "${prompt}". In a real implementation, this would call the DeepSeek API.`;
  };

  return (
    <div>
      <div className="flex h-screen">
        {/* sidebar */}
        <Sidebar expand={expand} setExpand={setExpand} />
        <div className="flex-1 flex flex-col items-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image 
              onClick={() => setExpand(!expand)} 
              className="rotate-180" 
              src={assets.menu_icon} 
              alt="Menu" 
            />
            <Image className="opacity-70" src={assets.chat_icon} alt="Chat" />
          </div>

          {/* message box */}
          <div className="flex-1 w-full overflow-y-auto py-20">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="flex items-center gap-3">
                  <Image src={assets.logo_icon} alt="Logo" className="h-16" />
                  <p className="text-2xl font-medium">Hi, I'm DeepSeek</p>
                </div>
                <p className="text-sm mt-2">How can I help you today?</p>
              </div>
            ) : (
              <div className="space-y-4 w-full max-w-3xl mx-auto">
                {messages.map((message, index) => (
                  <Message 
                    key={index} 
                    role={message.role} 
                    content={message.content} 
                  />
                ))}
                {isLoading && (
                  <Message 
                    role="assistant" 
                    content={
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-150"></div>
                      </div>
                    } 
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* prompt box */}
          <div className="w-full max-w-3xl mx-auto">
            <PromptBox 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage} 
            />
            <p className="text-xs text-center mt-2 text-gray-500">
              AI-generated, for reference only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}