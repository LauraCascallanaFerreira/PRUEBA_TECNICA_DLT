import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || undefined },
  });

  if (!user) return <p>Usuario no encontrado</p>;

  const master = user.role === "MAESTRO";

  const totalCriaturas = master
    ? await prisma.creature.count()
    : null;

  return (
    <div className={styles.perfilContainer}>
      <aside className={styles.imagen}>
        <Image
          src={master ? "/assets/master.png" : "/assets/caretaker.png"}
          alt="Imagen de perfil"
          fill
          className={styles.img}
        />
      </aside>

      <main className={styles.info}>
        <nav className={styles.nav}>
          <Link href="/criaturas" className={styles.enlace}>Mis criaturas</Link>
          <span className={`${styles.enlace} ${styles.activo}`}>Mi perfil</span>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className={styles.enlace}>Cerrar sesión</button>
          </form>
        </nav>

        <h1 className={styles.santuario}>El Santuario</h1>
        <h2 className={styles.titulo}>Mi perfil</h2>
        <p className={styles.descripcionIntro}>
          Este es el lugar donde podrás gestionar, actualizar y personalizar la información de tu perfil.
        </p>

        <div className={styles.campo}>
          <label>Nombre mágico</label>
          <input disabled value={user.name || ""} />
        </div>

        <div className={styles.campo}>
          <label>Correo mágico</label>
          <input disabled value={user.email || ""} />
        </div>

        <div className={styles.campo}>
          <label>Rol</label>
          <input disabled value={master ? "Maestro" : "Cuidador"} />
        </div>

        {master && (
          <div className={styles.seccionMaestro}>
            <h3 className={styles.tituloMaestro}>Información exclusiva para Maestros</h3>
            <p className={styles.textoMaestro}>
              Total de criaturas creadas en el santuario: <strong>{totalCriaturas}</strong>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
