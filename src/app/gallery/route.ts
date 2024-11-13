import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "../lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: "public",
  });

  // Save to database
  // const image = await prisma.image.create({
  //   data: {
  //     url: blob.url,
  //     filename: file.name,
  //     size: file.size,
  //     contentType: file.type,
  //   },
  // });

  // return NextResponse.json(image);
}

// export async function GET() {
//   const images = await prisma.image.findMany({
//     orderBy: { createdAt: "desc" },
//   });

//   return NextResponse.json(images);
// }

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Image ID is required" },
      { status: 400 }
    );
  }

  // await prisma.image.delete({
  //   where: { id },
  // });

  // return NextResponse.json({ success: true });
}
