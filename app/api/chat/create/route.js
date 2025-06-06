
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);

        if(!userId){
            return NextResponse.json({ success: false, message: "User not authenticated", })
        }

        // prepare the chat data to be saved in the database
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
        }

        // connect to database and create a new chat
        await connectDB();
        await Chat.create(chatData);

        return NextResponse.json({ success: true, message: "Chat created" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}