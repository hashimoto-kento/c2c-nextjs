import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { title, completed } = await req.json();
    const todo = await prisma.todo.update({
      where: { id: params.id },
      data: { title, completed },
    });
    return Response.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return new Response("Error updating todo", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await prisma.todo.delete({
      where: { id: params.id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return new Response("Error deleting todo", { status: 500 });
  }
}