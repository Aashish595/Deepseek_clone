import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const PromptBox = ({ isLoading, onSendMessage }) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200 // max height in pixels
      )}px`;
    }
  }, [prompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    onSendMessage(prompt);
    setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-2xl bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="outline-none w-full resize-none overflow-y-auto break-words bg-transparent pr-10"
          rows={1}
          placeholder="Message DeepSeek..."
          required
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          value={prompt}
          disabled={isLoading}
          aria-label="Chat input"
        />
        {prompt && (
          <button
            type="button"
            onClick={() => setPrompt("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Clear input"
          >
            {assets.close_icon && (
              <Image
                src={assets.close_icon}
                alt="Clear"
                width={16}
                height={16}
              />
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-sm mt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full hover:bg-gray-500/20 transition"
            aria-label="Enable DeepThink mode"
          >
            <Image src={assets.deepthink_icon} alt="" width={20} height={20} />
            DeepThink (R1)
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full hover:bg-gray-500/20 transition"
            aria-label="Enable search mode"
          >
            <Image src={assets.search_icon} alt="" width={20} height={20} />
            Search
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Pin conversation"
          >
            <Image
              src={assets.pin_icon}
              alt="Pin"
              width={16}
              height={16}
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </button>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`rounded-full p-2 transition-colors ${
              prompt.trim()
                ? "bg-primary hover:bg-primary/90"
                : "bg-[#71717a] cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <Image
              src={prompt.trim() ? assets.arrow_icon : assets.arrow_icon_dull}
              alt="Send"
              width={14}
              height={14}
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
