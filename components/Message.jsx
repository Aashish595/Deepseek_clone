import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'

const Message = ({ role, content }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isAssistant = role !== 'user'

  return (
    <div className={`flex w-full max-w-3xl text-sm ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex flex-col w-full mb-4 ${!isAssistant && 'items-end'}`}>
        <div className={`group relative flex max-w-2xl py-3 rounded-xl ${!isAssistant ? 'bg-[#414158] px-5' : 'gap-3'}`}>
          {/* Action buttons */}
          <div className={`absolute flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all 
            ${!isAssistant ? '-left-16 top-2.5' : 'left-9 -bottom-6'} bg-[#292a2d] px-2 py-1 rounded-md`}>
            {!isAssistant ? (
              <>
                <button 
                  onClick={handleCopy}
                  aria-label="Copy message"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image src={assets.copy_icon} alt="Copy" width={16} height={16} />
                </button>
                <button 
                  aria-label="Edit message"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image src={assets.pencil_icon} alt="Edit" width={18} height={18} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleCopy}
                  aria-label="Copy message"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image src={assets.copy_icon} alt="Copy" width={18} height={18} />
                </button>
                <button 
                  aria-label="Regenerate response"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image src={assets.regenerate_icon} alt="Regenerate" width={16} height={16} />
                </button>
                <button 
                  aria-label="Like response"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image src={assets.like_icon} alt="Like" width={16} height={16} />
                </button>
                <button 
                  aria-label="Dislike response"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image src={assets.dislike_icon} alt="Dislike" width={16} height={16} />
                </button>
              </>
            )}
          </div>

          {/* Message content */}
          {!isAssistant ? (
            <span className='text-white/90'>{content}</span>
          ) : (
            <>
              <div className="flex-shrink-0">
                <Image 
                  src={assets.logo_icon} 
                  alt="Assistant" 
                  width={36} 
                  height={36} 
                  className="p-1 border border-white/15 rounded-full" 
                />
              </div>
              <div className='flex-1 min-w-0'>
                {typeof content === 'string' ? (
                  <div className='whitespace-pre-wrap'>{content}</div>
                ) : (
                  content
                )}
              </div>
            </>
          )}

          {/* Copy confirmation */}
          {copied && (
            <div className={`absolute ${!isAssistant ? '-right-12' : '-left-12'} top-1/2 transform -translate-y-1/2 
              bg-[#414158] text-xs px-2 py-1 rounded-md`}>
              Copied!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message