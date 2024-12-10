import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// 型をネストされたPromiseとして定義
type ContextWithPromise = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: NextRequest, context: ContextWithPromise) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { title, completed } = await request.json();
    const todo = await prisma.todo.update({
      where: { id: params.id },
      data: { title, completed },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ error: "Error updating todo" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: ContextWithPromise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    await prisma.todo.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ error: "Error deleting todo" }, { status: 500 });
  }
}
