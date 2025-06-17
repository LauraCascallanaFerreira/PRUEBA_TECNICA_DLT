"use client";

import type { Creature } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

type Props = {
  creatures: Creature[];
  isMaster: boolean;
};

const tiposDisponibles = ["DRAGON", "PHOENIX", "GOLEM", "VAMPIRE", "UNICORN"];

export default function ClientPage({ creatures, isMaster }: Props) {
  const [nombreTemporal, setNombreTemporal] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");

  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>([]);
  const [filtroTipos, setFiltroTipos] = useState<string[]>([]);

  const toggleTipo = (tipo: string) => {
    setTiposSeleccionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const confirmarFiltros = () => {
    setFiltroNombre(nombreTemporal);
    setFiltroTipos(tiposSeleccionados);
  };

  const filtradas = creatures.filter((c) => {
    const nombreIncluye = c.name.toLowerCase().includes(filtroNombre.toLowerCase());
    const tipoIncluido = filtroTipos.length === 0 || filtroTipos.includes(c.type);
    return nombreIncluye && tipoIncluido;
  });

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
          Explora y gestiona todas las criaturas mágicas que has recolectado. Cada una tiene habilidades únicas y características especiales
        </p>

        <div className={styles.top}>
          <Link href="/criaturas/new">
            <button className={styles.botonCrear}>Añadir nueva criatura</button>
          </Link>
        </div>

        <div className={styles.content}>
          {/* Filtros */}
          <div className={styles.filtros}>
            <h3>Filtrar</h3>
            <p>Buscar por tipo</p>
            {tiposDisponibles.map((tipo) => (
              <label key={tipo}>
                <input
                  type="checkbox"
                  checked={tiposSeleccionados.includes(tipo)}
                  onChange={() => toggleTipo(tipo)}
                />
                {formatearTipo(tipo)}
              </label>
            ))}
            <button className={styles.botonConfirmar} onClick={confirmarFiltros}>
              Confirmar
            </button>
          </div>

          {/* Tabla + Búsqueda */}
          <div className={styles.tabla}>
            <div className={styles.busqueda}>
              <label htmlFor="nombre">Palabra mágica</label>
              <input
                id="nombre"
                type="text"
                placeholder="Nombre"
                value={nombreTemporal}
                onChange={(e) => setNombreTemporal(e.target.value)}
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
        </div>
      </main>
    </div>
  );
}

function formatearTipo(tipo: string) {
  return tipo.charAt(0) + tipo.slice(1).toLowerCase(); // "PHOENIX" => "Phoenix"
}

function nivelRomano(n: number) {
  const romanos = ["I", "II", "III", "IV", "V"];
  return romanos[n - 1] || n;
}
