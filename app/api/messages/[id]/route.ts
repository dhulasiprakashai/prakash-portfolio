import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { getAuthenticatedClient } from "../../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../../lib/mock-db-helper";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing message ID" }, { status: 400 });

    const body = await request.json();
    const status = body.status;

    if (!status || !["new", "read", "replied", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    if (!supabase) {
      const db = getMockDb();
      if (!db.contact_messages) db.contact_messages = [];
      db.contact_messages = db.contact_messages.map((m: any) =>
        m.id === id ? { ...m, status } : m
      );
      const updated = db.contact_messages.find((m: any) => m.id === id);
      saveMockDb(db);
      return NextResponse.json(updated);
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing message ID" }, { status: 400 });

    if (!supabase) {
      const db = getMockDb();
      if (!db.contact_messages) db.contact_messages = [];
      db.contact_messages = db.contact_messages.filter((m: any) => m.id !== id);
      saveMockDb(db);
      return NextResponse.json({ success: true, id });
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await authClient
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
