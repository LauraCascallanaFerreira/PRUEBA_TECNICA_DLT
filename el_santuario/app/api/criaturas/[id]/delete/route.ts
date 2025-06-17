import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Context = {
  params: {
    id: string;
  };
};

export async function POST(req: Request, context: Context) {
    const session = await getServerSession(authOptions);

    if(!session) return NextResponse.json({error: "No autenticado"}, {status: 401});

    if(session.user.role !== "MAESTRO") return NextResponse.json({error: "No autorizado para eliminar una criatura"}, {status: 403});

    const creatureId = context.params.id;

    try {
        await prisma.creature.delete({
            where: {id: creatureId},
        });

        return NextResponse.redirect(new URL("/criaturas", req.url));
    } catch (error) {
        console.error("Error al elimianr la criatura:", error);
        return NextResponse.json({error: "Error al eliminar"}, {status: 500});
    }
}