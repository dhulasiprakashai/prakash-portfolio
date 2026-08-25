import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase Storage is not configured. Please add valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Upload failed: No file was provided in the request form data." },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "Upload failed: No upload type specified (expected 'avatar', 'hero', 'cv', or 'project')." },
        { status: 400 }
      );
    }

    // File Validation: size limit 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Upload failed: File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum limit of 5MB.` },
        { status: 400 }
      );
    }

    // File Validation: mime-types based on type
    if (["avatar", "hero", "project"].includes(type)) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `Upload failed: Expected an image file for type '${type}', but received '${file.type}'.` },
          { status: 400 }
        );
      }
    } else if (type === "cv") {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: `Upload failed: Expected a PDF file for CV/resume upload, but received '${file.type}'.` },
          { status: 400 }
        );
      }
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique name and path in bucket
    const fileExt = file.name.split(".").pop();
    const fileName = `${type}_${Date.now()}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    // Upload to Supabase bucket 'portfolio'
    const { data, error } = await supabase.storage
      .from("portfolio")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json(
        { error: `Supabase storage upload error: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Upload failed due to server error: ${err.message}` },
      { status: 500 }
    );
  }
}
