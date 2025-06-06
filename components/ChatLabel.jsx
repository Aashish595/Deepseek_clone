import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';

const ChatLabel = ({ chatName, onRename, onDelete, isActive }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRename = () => {
    setIsMenuOpen(false);
    onRename();
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete();
  };

  return (
    <div 
      className={`flex items-center justify-between p-2 rounded-lg text-sm cursor-pointer transition-colors
        ${isActive ? 'bg-white/20' : 'text-white/80 hover:bg-white/10'}`}
    >
      <p className={`truncate flex-1 ${isActive ? 'font-medium' : ''}`}>
        {chatName || 'New Chat'}
      </p>

      {/* Menu button and dropdown */}
      <div 
        ref={menuRef}
        className="relative flex items-center justify-center h-6 w-6"
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center justify-center h-full w-full rounded-lg hover:bg-black/30
            ${isMenuOpen ? 'bg-black/30' : ''}`}
          aria-label="Chat options"
          aria-expanded={isMenuOpen}
        >
          <Image 
            src={assets.three_dots} 
            alt="Menu" 
            width={16} 
            height={16} 
            className="opacity-80 hover:opacity-100"
          />
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div 
            className="absolute right-0 top-6 bg-gray-700 rounded-lg shadow-lg z-10 w-40 overflow-hidden"
            role="menu"
          >
            {/* Rename option */}
            <button
              onClick={handleRename}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/10 transition-colors text-left"
              role="menuitem"
            >
              <Image 
                src={assets.pencil_icon} 
                alt="" 
                width={16} 
                height={16} 
                className="opacity-80"
              />
              <span>Rename</span>
            </button>
            
            {/* Delete option */}
            <button
              onClick={handleDelete}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/10 transition-colors text-left text-red-400"
              role="menuitem"
            >
              <Image 
                src={assets.delete_icon} 
                alt="" 
                width={16} 
                height={16} 
                className="opacity-80"
              />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLabel;