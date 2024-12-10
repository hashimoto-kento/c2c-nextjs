import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { type NextApiRequest, type NextApiResponse } from "next";

interface PutContext {
  params: {
    id: string;
  };
}

export async function PUT(request: Request | NextRequest, context: PutContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const { title, completed } = await request.json();
    const todo = await prisma.todo.update({
      where: { id },
      data: { title, completed },
    });
    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ error: "Error updating todo" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request | NextRequest,
  context: PutContext
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = context.params;
    await prisma.todo.delete({
      where: { id },
    });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ error: "Error deleting todo" }, { status: 500 });
  }
}
