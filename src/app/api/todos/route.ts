import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify("Unauthorized"), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify("Unauthorized"), { status: 401 });
  }

  const { title } = await req.json();
  const todo = await prisma.todo.create({
    data: {
      title,
      userId: session.user.id,
    },
  });
  return NextResponse.json(todo);
}
