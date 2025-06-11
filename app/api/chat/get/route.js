
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User not authenticated" },
                { status: 401 }
            );
        }

        await connectDB();
        
        // Add sorting by updatedAt and proper error handling
        const userChatData = await Chat.find({ userId })
            .sort({ updatedAt: -1 }) // Sort by newest first
            .lean(); // Convert to plain JS objects

        if (!userChatData) {
            return NextResponse.json(
                { success: false, message: "No chats found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: userChatData // Changed from userChatData to data for consistency
        });

    } catch (error) {
        console.error("GET /api/chat/get error:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Internal server error",
                error: error.message 
            },
            { status: 500 }
        );
    }
}