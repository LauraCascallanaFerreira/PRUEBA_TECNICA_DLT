import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientPage from "./client-page";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const creatures = await prisma.creature.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return <ClientPage creatures={creatures} isMaster={session.user.role === "MAESTRO"} />;
}
