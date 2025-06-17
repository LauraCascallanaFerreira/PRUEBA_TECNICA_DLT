import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import type { Creature } from "@prisma/client";


type Props = {
    searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function CreaturesPage({ searchParams }: Props) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    const master = session.user.role === "MAESTRO";

    const validTypes = ["DRAGON", "PHOENIX", "GOLEM", "VAMPIRE", "UNICORN"] as const;
    type CreatureType = typeof validTypes[number];

    function isCreatureType(tipo: string): tipo is CreatureType {
        return validTypes.includes(tipo as CreatureType);
    }

    const rawTipo = searchParams?.tipo;
    const rawNombre = searchParams?.nombre;

    const tiposSeleccionados: string[] = Array.isArray(rawTipo)
        ? rawTipo
        : rawTipo
            ? [rawTipo]
            : [];

    const tiposFiltrados = tiposSeleccionados.filter(isCreatureType);
    const nombreBusqueda = Array.isArray(rawNombre) ? rawNombre[0] : rawNombre;

    const nameFilter = nombreBusqueda
        ? { contains: nombreBusqueda }
        : undefined;

    const creatures = await prisma.creature.findMany({
        where: {
            userId: session.user.id,
            ...(tiposFiltrados.length > 0 && { type: { in: tiposFiltrados as CreatureType[] } }),
            ...(nameFilter && { name: nameFilter }),
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className={styles.page}>
            <aside className={styles.sidebar}>
                <Image
                    src={master ? "/assets/master.png" : "/assets/caretaker.png"}
                    alt="Imagen lateral"
                    fill
                    className={styles.img}
                />
            </aside>

            <main className={styles.main}>
                <nav className={styles.nav}>
                    <span className={`${styles.enlace} ${styles.activo}`}>Mis criaturas</span>
                    <Link href="/profile" className={styles.enlace}>Mi perfil</Link>
                    <form action="/api/auth/signout" method="POST">
                        <button type="submit" className={styles.enlace}>Cerrar sesión</button>
                    </form>
                </nav>

                <h1 className={styles.titulo}>El santuario</h1>
                <h2 className={styles.subtitulo}>Mis criaturas</h2>
                <p className={styles.descripcion}>
                    Explora y gestiona todas las criaturas mágicas que has recolectado. Cada una tiene habilidades únicas y características especiales
                </p>

                <div className={styles.top}>
                    <Link href="/criaturas/new">
                        <button className={styles.botonCrear}>Añadir nueva criatura</button>
                    </Link>
                </div>

                <div className={styles.content}>
                    <aside className={styles.filtros}>
                        <h3>Filtrar</h3>
                        <form method="GET">
                            <p>Buscar por tipo</p>
                            {validTypes.map((tipo) => (
                                <label key={tipo}>
                                    <input
                                        type="checkbox"
                                        name="tipo"
                                        value={tipo}
                                        defaultChecked={tiposFiltrados.includes(tipo)}
                                    />{" "}
                                    {formatearTipo(tipo)}
                                </label>
                            ))}
                            <button type="submit" className={styles.botonConfirmar}>Confirmar</button>
                        </form>
                    </aside>

                    <section className={styles.tabla}>
                        <form method="GET" className={styles.formBusqueda}>
                            {tiposFiltrados.map((tipo) => (
                                <input type="hidden" name="tipo" value={tipo} key={tipo} />
                            ))}
                            <div className={styles.busqueda}>
                                <label className={styles.labelBusqueda}>Palabra mágica</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    defaultValue={nombreBusqueda || ""}
                                    className={styles.inputBusqueda}
                                />
                            </div>
                        </form>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Nivel</th>
                                    <th>Entrenado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creatures.map((criatura: Creature) => (
                                    <tr key={criatura.id}>
                                        <td>{criatura.name}</td>
                                        <td>{formatearTipo(criatura.type)}</td>
                                        <td>{nivelRomano(criatura.power)}</td>
                                        <td>{criatura.trained ? "Sí" : "No"}</td>
                                        <td>
                                            <Link href={`/criaturas/${criatura.id}/edit`}>
                                                <span className={styles.icono}>✎</span>
                                            </Link>
                                            {master && (
                                                <form
                                                    action={`/api/criaturas/${criatura.id}/delete`}
                                                    method="POST"
                                                    className={styles.inlineForm}
                                                >
                                                    <button type="submit" className={styles.iconoEliminar}>🗑</button>
                                                </form>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </div>
    );
}

function formatearTipo(tipo: string) {
    return tipo.charAt(0) + tipo.slice(1).toLowerCase();
}

function nivelRomano(n: number) {
    const romanos = ["I", "II", "III", "IV", "V"];
    return romanos[n - 1] || n;
}
