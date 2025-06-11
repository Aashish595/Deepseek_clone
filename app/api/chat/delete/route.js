import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server"; // Updated for App Router
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req); // Use this for Clerk in server env

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 }
      );
    }

    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        {
          success: false,
          message: "Chat ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Chat.deleteOne({ _id: chatId, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Chat not found or not owned by user",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
