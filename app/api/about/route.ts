import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ about: db.about || null });
  }

  try {
    const { data, error } = await supabase
      .from("about")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ about: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const updatedAbout = {
      id: "default",
      section_label: body.section_label ?? "01 / ABOUT",
      main_heading: body.main_heading ?? "",
      short_intro: body.short_intro ?? "",
      full_description: body.full_description ?? "",
      career_focus: body.career_focus ?? "",
      published: body.published ?? true,
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      const db = getMockDb();
      db.about = updatedAbout;
      saveMockDb(db);
      return NextResponse.json({ about: updatedAbout });
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("about")
      .upsert(updatedAbout)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ about: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
