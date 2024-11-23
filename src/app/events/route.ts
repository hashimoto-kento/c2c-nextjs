import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/prisma";

// Event validation schema
const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  allDay: z.boolean().default(false),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validatedData = eventSchema.parse(body);

  const event = await prisma.event.create({
    data: {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
    },
  });

  return NextResponse.json(event);
}

export async function GET() {
  const events = await prisma.event.findMany();
  return NextResponse.json(events);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  await prisma.event.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}