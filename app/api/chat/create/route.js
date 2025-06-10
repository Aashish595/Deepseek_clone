
// import connectDB from "@/config/db";
// import Chat from "@/models/Chat";
// import { auth } from "@clerk/nextjs";  // Updated import
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     try {
//         const { userId } = auth();  // Updated usage

//         if(!userId){
//             return NextResponse.json({ success: false, message: "User not authenticated", })
//         }

//         // prepare the chat data to be saved in the database
//         const chatData = {
//             userId,
//             messages: [],
//             name: "New Chat",
//         }

//         // connect to database and create a new chat
//         await connectDB();
//         await Chat.create(chatData);

//         return NextResponse.json({ success: true, message: "Chat created" });
//     } catch (error) {
//         return NextResponse.json({ success: false, message: error.message });
//     }
// }

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