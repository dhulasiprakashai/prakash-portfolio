import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ services: db.services || [] });
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ services: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const serviceData: any = {
      title: body.title,
      short_description: body.short_description ?? "",
      full_description: body.full_description ?? "",
      icon: body.icon ?? "",
      sort_order: body.sort_order ?? 99,
      published: body.published ?? true,
    };

    if (body.id && body.id.trim() !== "") {
      serviceData.id = body.id;
    }

    if (!supabase) {
      const db = getMockDb();
      if (!db.services) db.services = [];

      if (body.id) {
        db.services = db.services.map((s: any) =>
          s.id === body.id ? { ...s, ...serviceData } : s
        );
        const updated = db.services.find((s: any) => s.id === body.id);
        saveMockDb(db);
        return NextResponse.json(updated);
      } else {
        const newService = {
          ...serviceData,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
        };
        db.services.push(newService);
        saveMockDb(db);
        return NextResponse.json(newService);
      }
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("services")
      .upsert(serviceData)
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
