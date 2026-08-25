import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { getAuthenticatedClient } from "../../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../../lib/mock-db-helper";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing service ID" }, { status: 400 });

    if (!supabase) {
      const db = getMockDb();
      if (!db.services) db.services = [];
      db.services = db.services.filter((s: any) => s.id !== id);
      saveMockDb(db);
      return NextResponse.json({ success: true, id });
    }

    const authClient = await getAuthenticatedClient(_request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await authClient.from("services").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete service" },
      { status: 400 }
    );
  }
}
