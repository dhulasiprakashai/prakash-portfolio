import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ stats: db.stats || [] });
  }

  try {
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stats: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const statData: any = {
      label: body.label,
      value: body.value,
      description: body.description ?? "",
      sort_order: body.sort_order ?? 99,
      published: body.published ?? true,
    };

    if (body.id && body.id.trim() !== "") {
      statData.id = body.id;
    }

    if (!supabase) {
      const db = getMockDb();
      if (!db.stats) db.stats = [];

      if (body.id) {
        db.stats = db.stats.map((s: any) =>
          s.id === body.id ? { ...s, ...statData } : s
        );
        const updated = db.stats.find((s: any) => s.id === body.id);
        saveMockDb(db);
        return NextResponse.json(updated);
      } else {
        const newStat = {
          ...statData,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
        };
        db.stats.push(newStat);
        saveMockDb(db);
        return NextResponse.json(newStat);
      }
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("stats")
      .upsert(statData)
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
