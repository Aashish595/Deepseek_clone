
import { Webhook } from "svix";
import connectDB from '@/config/db';
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    const wh = new Webhook(process.env.SIGNIN_SECRET);
    const headerPayload = await headers();
    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-signature": headerPayload.get("svix-signature"),
    };

    // get the payload and verify it
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const { data, type } = wh.verify(body, svixHeaders);

    // prepare the user data to be saved in the database
    const userData = {
        _id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
    };

    await connectDB();

    // switch case for each event type of user
    switch (type) {
        case 'user.created':
            await User.create(userData)
            break;

        case 'user.updated':
            await User.findByIdAndUpdate(data.id, userData)
            break;

        case 'user.deleted':
            await User.findByIdAndDelete(data.id)
            break;
    
        default:
            break;
    }

    return NextResponse.json({ message: 'Event received'});
}