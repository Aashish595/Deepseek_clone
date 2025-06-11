
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User not authenticated" },
                { status: 401 }
            );
        }

        const { prompt, chatId } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { success: false, message: "Prompt is required" },
                { status: 400 }
            );
        }

        if (!chatId) {
            return NextResponse.json(
                { success: false, message: "Chat ID is required" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);

        if (!result.response.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response format from Gemini API");
        }

        const text = result.response.candidates[0].content.parts[0].text;
        const assistantMessage = {
            role: "assistant",
            content: text,
            timestamp: Date.now(),
        };

        // Update the chat in database
        await connectDB();
        await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: assistantMessage },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            data: assistantMessage
        });

    } catch (error) {
        console.error("POST /api/chat/ai error:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to process AI request",
                error: error.message 
            },
            { status: 500 }
        );
    }
}