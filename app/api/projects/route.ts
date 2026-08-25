import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getAuthenticatedClient } from "../../../lib/api-auth";
import { getMockDb, saveMockDb } from "../../../lib/mock-db-helper";

export async function GET() {
  if (!supabase) {
    const db = getMockDb();
    return NextResponse.json({ projects: db.projects || [] });
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const projectData: any = {
      title: body.title,
      slug: body.slug ?? null,
      description: body.description ?? "",
      full_description: body.full_description ?? "",
      tech: Array.isArray(body.tech) ? body.tech : [],
      image_url: body.image_url ?? null,
      github_url: body.github_url ?? null,
      live_url: body.live_url ?? null,
      featured: body.featured ?? true,
      published: body.published ?? true,
      sort_order: body.sort_order ?? 99,
      problem: body.problem ?? "",
      solution: body.solution ?? "",
      features: body.features ?? "",
      architecture: body.architecture ?? "",
      screenshots: Array.isArray(body.screenshots) ? body.screenshots : [],
      challenges: body.challenges ?? "",
      results: body.results ?? "",
    };

    if (body.id && body.id.trim() !== "") {
      projectData.id = body.id;
    }

    if (!supabase) {
      const db = getMockDb();
      if (!db.projects) db.projects = [];

      if (body.id) {
        // Update existing
        db.projects = db.projects.map((p: any) =>
          p.id === body.id ? { ...p, ...projectData, updated_at: new Date().toISOString() } : p
        );
        const updatedProj = db.projects.find((p: any) => p.id === body.id);
        saveMockDb(db);
        return NextResponse.json(updatedProj);
      } else {
        // Insert new
        const newProj = {
          ...projectData,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
        };
        db.projects.push(newProj);
        saveMockDb(db);
        return NextResponse.json(newProj);
      }
    }

    const authClient = await getAuthenticatedClient(request);
    if (!authClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await authClient
      .from("projects")
      .upsert(projectData)
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
