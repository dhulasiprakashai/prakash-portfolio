import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ profile: db.profile || null });
  }

  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const updatedProfile = {
      id: "default",
      name: body.name ?? "",
      headline: body.headline ?? "",
      about: body.about ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      location: body.location ?? "",
      github: body.github ?? "",
      linkedin: body.linkedin ?? "",
      avatar_url: body.avatar_url ?? null,
      hero_image_url: body.hero_image_url ?? null,
      cv_url: body.cv_url ?? null,
      availability: body.availability ?? "",
      projects_count: body.projects_count ?? 0,
      experience: body.experience ?? "",
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      const db = getMockDb();
      db.profile = updatedProfile;
      saveMockDb(db);
      return NextResponse.json({ profile: updatedProfile });
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("profile")
      .upsert(updatedProfile)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
