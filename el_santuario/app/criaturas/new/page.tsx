import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";

export default async function CreateCreaturePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    const master = session.user.role === "MAESTRO";

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

                <form action="/api/criaturas" method="POST" className={styles.formulario}>
                    <h3 className={styles.subtituloFormulario}>Creador de criaturas mágicas</h3>

                    <div className={styles.fila}>
                        <div className={styles.campo}>
                            <label>Nombre mágico de la criatura</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Introduce el nombre de la criatura"
                                required
                            />
                        </div>

                        <div className={styles.campo}>
                            <label>Tipo de criatura</label>
                            <select name="type" defaultValue="PHOENIX">
                                <option value="DRAGON">Dragon</option>
                                <option value="PHOENIX">Phoenix</option>
                                <option value="GOLEM">Golem</option>
                                <option value="VAMPIRE">Vampire</option>
                                <option value="UNICORN">Unicorn</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.fila}>
                        <div className={styles.campo}>
                            <label>Nivel de poder</label>
                            <input
                                name="power"
                                type="number"
                                min={1}
                                max={5}
                                defaultValue="1"
                                required
                            />
                        </div>

                        <div className={styles.campoCheckbox}>
                            <label>¿Entrenada?</label>
                            <div className={styles.opciones}>
                                <label>
                                    <input type="radio" name="trained" value="true" defaultChecked />
                                    Sí
                                </label>
                                <label>
                                    <input type="radio" name="trained" value="false" />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={styles.boton}>Registrar criatura</button>
                </form>
            </main>
        </div>
    );
}
