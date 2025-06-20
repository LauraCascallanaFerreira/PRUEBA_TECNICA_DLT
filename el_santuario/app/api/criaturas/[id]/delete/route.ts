import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (session.user.role !== "MAESTRO") {
    return NextResponse.json(
      { error: "No autorizado para eliminar una criatura" },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const creatureId = segments[segments.indexOf("criaturas") + 1];

  try {
    await prisma.creature.delete({
      where: { id: creatureId },
    });

    return NextResponse.redirect(new URL("/criaturas", req.url));
  } catch (error) {
    console.error("Error al eliminar la criatura:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}