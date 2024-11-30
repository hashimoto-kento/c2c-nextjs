import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/prisma";

// Event validation schema

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  allDay: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: validatedData,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    } else {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
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

    // フィールドを適切な形式に変換
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate).toISOString();
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate).toISOString();
    }
    if (updateData.allDay !== undefined) {
      updateData.allDay = updateData.allDay === "true";
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
