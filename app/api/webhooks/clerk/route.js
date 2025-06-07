import mongoose from "mongoose";
import { Webhook } from "svix";
import connectDB from '@/config/db';
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };

  const payload = await req.json();
  const body = JSON.stringify(payload);

  try {
    const { data, type } = wh.verify(body, svixHeaders);
    console.log("Received Clerk Webhook:", type);

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      name: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    await connectDB();

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.log("Unhandled Clerk event type:", type);
        break;
    }

    return NextResponse.json({ message: "Event received" });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json({ message: "Invalid webhook" }, { status: 400 });
  }
}
