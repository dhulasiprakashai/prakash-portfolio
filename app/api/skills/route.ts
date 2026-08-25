import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ skills: db.skills || [] });
  }

  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ skills: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const skillData: any = {
      name: body.name,
      category: body.category,
      icon: body.icon ?? "",
      sort_order: body.sort_order ?? 99,
      published: body.published ?? true,
    };

    if (body.id && body.id.trim() !== "") {
      skillData.id = body.id;
    }

    if (!supabase) {
      const db = getMockDb();
      if (!db.skills) db.skills = [];

      if (body.id) {
        db.skills = db.skills.map((s: any) =>
          s.id === body.id ? { ...s, ...skillData } : s
        );
        const updated = db.skills.find((s: any) => s.id === body.id);
        saveMockDb(db);
        return NextResponse.json(updated);
      } else {
        const newSkill = {
          ...skillData,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
        };
        db.skills.push(newSkill);
        saveMockDb(db);
        return NextResponse.json(newSkill);
      }
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("skills")
      .upsert(skillData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
