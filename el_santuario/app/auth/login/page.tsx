'use client'

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from './page.module.scss'
import Image from 'next/image'
import { ROUTES } from "@/lib/routes"

export default function Login() {
    const { data: session } = useSession()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (session?.user.role === 'MAESTRO') {
            router.push(ROUTES.maestro)
        } else if (session?.user.role === 'CUIDADOR') {
            router.push(ROUTES.cuidador)
        }
    }, [session, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })

        if (res?.error) {
            setError('Credenciales incorrectas')
        }
    }

    return (
        <main className={styles.container}>
            <div className={styles.imageContainer}>
                <Image src="/assets/login.png" alt="Login background" fill className={styles.image} />
            </div>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>INICIA SESIÓN</h1>
                <p className={styles.description}>
                    Para acceder a la colección de criaturas mágicas. Sólo los maestros y los cuidadores reconocidos pueden entrar
                </p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="email">Correo mágico</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="tunombre@santuario.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Palabra mágica</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Introduce tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Acceder al santuario</button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
                <p className={styles.footer}>
                    ¿No tienes cuenta? <a href="/auth/register">Regístrate como maestro o cuidador</a>
                </p>
            </div>
        </main>
    )
}
