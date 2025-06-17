import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const form = await req.formData();

    const name = form.get("name") as string;
    const type = form.get("type") as string;
    const power = parseInt(form.get("power") as string);
    const trainedRaw = form.get("trained") as string;
    const trained = trainedRaw === "true";

    console.log("DATA:", { name, type, power, trained });

    const validTypes = ["DRAGON", "PHOENIX", "GOLEM", "VAMPIRE", "UNICORN"] as const;
    type CreatureType = typeof validTypes[number];

    if (
      !name ||
      !type ||
      isNaN(power) ||
      !(["true", "false"].includes(trainedRaw)) ||
      !validTypes.includes(type as CreatureType)
    ) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    await prisma.creature.create({
      data: {
        name,
        type: type as CreatureType,
        power,
        trained,
        userId: session.user.id,
      },
    });

    return NextResponse.redirect(new URL("/criaturas", req.url));
  } catch (error: unknown) {
    console.error("Error al crear criatura:", error.message, error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
