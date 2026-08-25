import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ settings: db.site_settings || null });
  }

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const updatedSettings = {
      id: "default",
      site_title: body.site_title ?? "Portfolio",
      site_description: body.site_description ?? "",
      logo_text: body.logo_text ?? "",
      footer_text: body.footer_text ?? "",
      contact_email: body.contact_email ?? "",
      social_links: typeof body.social_links === "object" ? body.social_links : {},
      availability_status: body.availability_status ?? "",
      maintenance_mode: body.maintenance_mode ?? false,
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      const db = getMockDb();
      db.site_settings = updatedSettings;
      saveMockDb(db);
      return NextResponse.json({ settings: updatedSettings });
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("site_settings")
      .upsert(updatedSettings)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
