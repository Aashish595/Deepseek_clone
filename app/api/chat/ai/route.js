import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    // 🔐 Auth
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📩 Body
    const { prompt, chatId } = await req.json();
    if (!prompt || !chatId) {
      return NextResponse.json(
        { message: "prompt and chatId required" },
        { status: 400 }
      );
    }

    console.log("Groq API Key exists:", !!process.env.GROQ_API_KEY);

    // 🤖 Groq AI
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices[0].message.content;

    // 💾 Save chat
    await connectDB();
    await Chat.findByIdAndUpdate(chatId, {
      $push: {
        messages: {
          role: "assistant",
          content: text,
          timestamp: Date.now(),
        },
      },
    });

    return NextResponse.json({ success: true, text });

  } catch (error) {
    console.error("Groq error:", error);

    const status = error.status || 500;

    return NextResponse.json(
      {
        success: false,
        error:
          status === 429
            ? "AI quota exceeded. Please try again later."
            : "Internal server error",
      },
      { status }
    );
  }
}
