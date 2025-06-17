"use client";

import type { Creature } from "@prisma/client";
import styles from "./page.module.scss";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  creatures: Creature[];
  isMaster: boolean;
};

export default function ClientPage({ creatures, isMaster }: Props) {
  const [filtro, setFiltro] = useState("");

  const filtradas = creatures.filter((c) =>
    c.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <Image
          src={isMaster ? "/assets/master.png" : "/assets/caretaker.png"}
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
          Explora y gestiona todas las criaturas mágicas que has recolectado.
        </p>

        <div className={styles.top}>
          <Link href="/criaturas/new">
            <button className={styles.botonCrear}>Añadir nueva criatura</button>
          </Link>
        </div>

        <div className={styles.content}>
          <div className={styles.formBusqueda}>
            <label className={styles.labelBusqueda}>Palabra mágica</label>
            <input
              type="text"
              placeholder="Nombre"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className={styles.inputBusqueda}
            />
          </div>

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
              {filtradas.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{formatearTipo(c.type)}</td>
                  <td>{nivelRomano(c.power)}</td>
                  <td>{c.trained ? "Sí" : "No"}</td>
                  <td>
                    <Link href={`/criaturas/${c.id}/edit`}>
                      <span className={styles.icono}>✎</span>
                    </Link>
                    {isMaster && (
                      <form
                        action={`/api/criaturas/${c.id}/delete`}
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
