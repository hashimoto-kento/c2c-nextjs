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

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const body = text ? JSON.parse(text) : null;

    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }
    console.log("1st", JSON.stringify(body, null, 2));

    // フィールドを適切な形式に変換
    if (body.startDate) {
      body.startDate = new Date(body.startDate).toISOString();
    }
    if (body.endDate) {
      body.endDate = new Date(body.endDate).toISOString();
    }
    if (body.allDay !== undefined) {
      body.allDay = body.allDay === "true" || body.allDay === "on";
    }

    const validatedData = eventSchema.parse(body);

    console.log("2nd", JSON.stringify(validatedData, null, 2));

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
      },
    });

    console.log("3rd", JSON.stringify(event, null, 2));

    return new NextResponse(JSON.stringify(event), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (prismaError) {
    console.error("Prisma Error:", prismaError);
    return NextResponse.json({ error: "Database Error" }, { status: 500 });
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
