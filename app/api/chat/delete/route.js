import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { auth } from "@clerk/nextjs";  // Updated import
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = auth();  // Updated usage
        const { chatId } = await req.json();

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: "User not authenticated" 
            }, { status: 401 });
        }

        await connectDB();
        const result = await Chat.deleteOne({ _id: chatId, userId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Chat not found or not owned by user" 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Chat deleted successfully" 
        });

    } catch (error) {
        console.error("Error deleting chat:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        }, { status: 500 });
    }
}