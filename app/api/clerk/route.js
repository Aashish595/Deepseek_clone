import mongoose from "mongoose";
import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  console.log("✅ Webhook called");

  try {
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const headerPayload = headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const { data, type } = wh.verify(body, svixHeaders);
    console.log(`✅ Received Clerk Webhook: ${type}`);

    await connectDB();

    if (type === "user.created" || type === "user.updated") {
      const userData = {
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || "",
      };

      if (type === "user.created") {
        await User.create(userData);
        console.log(`👤 User created: ${userData.email}`);
      } else {
        await User.findByIdAndUpdate(data.id, userData);
        console.log(`🔄 User updated: ${userData.email}`);
      }
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
      console.log(`❌ User deleted: ${data.id}`);
    }

    return NextResponse.json({ message: "Event received" });
  } catch (error) {
    console.error("❌ Webhook verification or DB operation failed:", error);
    return NextResponse.json(
      { message: "Invalid webhook", error: error.message },
      { status: 400 }
    );
  }
};
