import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify("Unauthorized"), { status: 401 });
  }

  const { title, completed } = await req.json();
  const todo = await prisma.todo.update({
    where: { id: params.id },
    data: { title, completed },
  });

  return NextResponse.json(todo);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify("Unauthorized"), { status: 401 });
  }

  await prisma.todo.delete({
    where: { id: params.id },
  });

  return new NextResponse(null, { status: 204 });
}
