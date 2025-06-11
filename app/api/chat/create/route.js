
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const newChat = await Chat.create({ 
      userId,
      messages: []
    });

    return NextResponse.json(
      { success: true, data: newChat },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/chat/create error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create chat" },
      { status: 500 }
    );
  }
}