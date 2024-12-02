import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
// import prisma from "@/app/lib/prisma";

const prisma = new PrismaClient();

// Event validation schema
const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  endDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  allDay: z
    .union([z.boolean(), z.literal("on")])
    .transform((val) => val === "on" || val === true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log("Request body:", body);

    // const validatedData = eventSchema.parse(body);
    // console.log("Validated data:", validatedData);

    await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        // allDay: body.allDay === "on" || body.allDay ===
        // ...validatedData,
        // startDate: new Date(validatedData.startDate),
        // endDate: new Date(validatedData.endDate),
      },
    });

    // return NextResponse.json(event, { status: 201 });
    const event = await getAllNotes();
    console.log("Created event:", event);
    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    } else {
      console.error("Error creating event:", error);
      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
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
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const validatedData = eventSchema.parse(updateData);

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    } else {
      console.error("Server Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

async function getAllNotes() {
  const events = await prisma.event.findMany();
  return events;
}
