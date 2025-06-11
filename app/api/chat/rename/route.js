import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

export async function POST(req) {
  try {
    // Authenticate user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Authentication required",
          code: "UNAUTHORIZED" 
        },
        { status: 401 }
      );
    }

    // Validate request body
    const { chatId, name } = await req.json();
    
    if (!chatId || !name) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Both chatId and new name are required",
          code: "MISSING_FIELDS" 
        },
        { status: 400 }
      );
    }

    // Validate MongoDB ID format
    if (!isValidObjectId(chatId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid chat ID format",
          code: "INVALID_ID" 
        },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length > 100) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Chat name must be less than 100 characters",
          code: "NAME_TOO_LONG" 
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Update chat with user ownership check
    const updatedChat = await Chat.findOneAndUpdate(
      { 
        _id: chatId, 
        userId // Ensures user owns the chat
      },
      { 
        name,
        updatedAt: new Date() // Track when chat was renamed
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Ensure schema validations run
      }
    );

    if (!updatedChat) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Chat not found or you don't have permission",
          code: "NOT_FOUND_OR_UNAUTHORIZED" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Chat renamed successfully",
      data: {
        id: updatedChat._id,
        name: updatedChat.name,
        updatedAt: updatedChat.updatedAt
      }
    });

  } catch (error) {
    console.error("[CHAT_RENAME_ERROR]", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}