
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { auth } from "@clerk/nextjs";  // Updated import
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { userId } = auth();  // Updated usage

        if(!userId){
            return NextResponse.json({ success: false, message: "User not authenticated", })
        }

        // connect to database and fetch all chats for the user
        await connectDB();
        const userChatData = await Chat.find({ userId });

        return NextResponse.json({ success: true, userChatData });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}