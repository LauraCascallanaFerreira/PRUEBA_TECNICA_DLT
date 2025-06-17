import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation";
import styles from "./page.module.scss";

export default async function EditCreature({ params }: { params: Promise<{ id: string }> }) {

    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    const creature = await prisma.creature.findUnique({
        where: {
            id: resolvedParams.id,
            userId: session.user.id,
        },
    });

    if (!creature) notFound();

    return (
        <div className={styles.page}>
            <h1 className={styles.titulo}>Editar criatura mágica</h1>
            <form
                action={`/api/criaturas/${resolvedParams.id}/edit`}
                method="POST"
                className={styles.formulario}
            >
                <div className={styles.campo}>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={creature.name}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.campo}>
                    <label htmlFor="type">Tipo:</label>
                    <select
                        id="type"
                        name="type"
                        defaultValue={creature.type}
                        className={styles.select}
                    >
                        <option value="DRAGON">Dragón</option>
                        <option value="PHOENIX">Fénix</option>
                        <option value="GOLEM">Golem</option>
                        <option value="VAMPIRE">Vampiro</option>
                        <option value="UNICORN">Unicornio</option>
                    </select>
                </div>

                <div className={styles.campo}>
                    <label htmlFor="power">Nivel de poder:</label>
                    <input
                        id="power"
                        name="power"
                        type="number"
                        min={1}
                        max={5}
                        defaultValue={creature.power}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.campo}>
                    <label htmlFor="trained">¿Entrenado?</label>
                    <select
                        id="trained"
                        name="trained"
                        defaultValue={creature.trained ? "true" : "false"}
                        className={styles.select}
                    >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <button type="submit" className={styles.boton}>Guardar cambios</button>
            </form>
        </div>
    );
}