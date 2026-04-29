import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { promises as fs } from "node:fs";

const IMAGES_DIR = path.join(process.cwd(), "content", "LessonsMD", ".images");

const MIME: Record<string, string> = {
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".webp": "image/webp",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);

  // Block path traversal
  if (name.includes("/") || name.includes("\\") || name.includes("..")) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const ext = path.extname(name).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return new NextResponse("Unsupported", { status: 415 });

  const filePath = path.join(IMAGES_DIR, name);
  // Defense in depth: resolved path must still be inside IMAGES_DIR
  if (!filePath.startsWith(IMAGES_DIR + path.sep)) {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}