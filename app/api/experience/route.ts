import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ experience: db.experience || [] });
  }

  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ experience: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const expData: any = {
      job_title: body.job_title,
      company: body.company,
      location: body.location ?? "",
      description: body.description ?? "",
      start_date: body.start_date ?? "",
      end_date: body.end_date ?? "",
      current: body.current ?? false,
      sort_order: body.sort_order ?? 99,
      published: body.published ?? true,
    };

    if (body.id && body.id.trim() !== "") {
      expData.id = body.id;
    }

    if (!supabase) {
      const db = getMockDb();
      if (!db.experience) db.experience = [];

      if (body.id) {
        db.experience = db.experience.map((e: any) =>
          e.id === body.id ? { ...e, ...expData } : e
        );
        const updated = db.experience.find((e: any) => e.id === body.id);
        saveMockDb(db);
        return NextResponse.json(updated);
      } else {
        const newExp = {
          ...expData,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
        };
        db.experience.push(newExp);
        saveMockDb(db);
        return NextResponse.json(newExp);
      }
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("experience")
      .upsert(expData)
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
