import { prisma } from "../../lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  // const session = await getServerSession(authOptions)
  // if (!session?.user?.id) {
  //   return new NextResponse('Unauthorized', { status: 401 })
  // }

  const todos = await prisma.todo.findMany({
    // where: { userId: 'user1' }, // session.user.id
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const todo = await prisma.todo.create({
      data: {
        title,
        userId: "user1", // session.user.id
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error adding todo:", error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
