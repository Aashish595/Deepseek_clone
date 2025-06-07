import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB(); // this should trigger the console log
  return NextResponse.json({ success: true, message: "DB connection tested" });
}
