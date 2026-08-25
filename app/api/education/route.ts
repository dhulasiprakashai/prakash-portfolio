import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ education: db.education || [] });
  }

  try {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ education: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const eduData: any = {
      degree: body.degree,
      institution: body.institution,
      field_of_study: body.field_of_study ?? "",
      location: body.location ?? "",
      description: body.description ?? "",
      start_year: body.start_year ?? "",
      end_year: body.end_year ?? "",
      current: body.current ?? false,
      sort_order: body.sort_order ?? 99,
      published: body.published ?? true,
    };

    if (body.id && body.id.trim() !== "") {
      eduData.id = body.id;
    }

    if (!supabase) {
      const db = getMockDb();
      if (!db.education) db.education = [];

      if (body.id) {
        db.education = db.education.map((e: any) =>
          e.id === body.id ? { ...e, ...eduData } : e
        );
        const updated = db.education.find((e: any) => e.id === body.id);
        saveMockDb(db);
        return NextResponse.json(updated);
      } else {
        const newEdu = {
          ...eduData,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
        };
        db.education.push(newEdu);
        saveMockDb(db);
        return NextResponse.json(newEdu);
      }
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("education")
      .upsert(eduData)
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
