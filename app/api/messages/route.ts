import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET(request: Request) {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ messages: db.contact_messages || [] });
  }

  try {
    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim() || "No Subject";
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Validation failed: Name, Email and Message are required." },
        { status: 400 }
      );
    }

    // Simple email format check
    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Validation failed: Please enter a valid email address." },
        { status: 400 }
      );
    }

    const messageData = {
      name,
      email,
      subject,
      message,
      status: "new",
      created_at: new Date().toISOString(),
    };

    if (!supabase) {
      const db = getMockDb();
      if (!db.contact_messages) db.contact_messages = [];
      const newMessage = {
        ...messageData,
        id: Math.random().toString(36).substr(2, 9),
      };
      db.contact_messages.unshift(newMessage);
      saveMockDb(db);
      return NextResponse.json({ success: true, message: newMessage });
    }

    // Public insert: anyone can submit contact messages, using the standard supabase client.
    const { error } = await supabase
      .from("contact_messages")
      .insert(messageData);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: messageData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
