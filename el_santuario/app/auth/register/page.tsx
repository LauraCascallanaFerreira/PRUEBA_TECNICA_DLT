'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './page.module.scss'
import Image from 'next/image'
import { ROUTES } from '@/lib/routes'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUIDADOR' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    setSuccess('Registrado con éxito!')
    setTimeout(() => {
      router.push(ROUTES.login)
    }, 2000)
  }

  return (
    <main className={styles.container}>
      <div className={styles.imageContainer}>
        <Image src="/assets/register.png" alt="Register background" fill className={styles.image} />
      </div>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>ÚNETE AL SANTUARIO</h1>
        <p className={styles.description}>
          Elige si serás un cuidador o maestro de criaturas. Completa los detalles para comenzar
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="name">Nombre mágico</label>
          <input
            id="name"
            type="text"
            placeholder="Introduce tu nombre mágico"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <label htmlFor="email">Correo mágico</label>
          <input
            id="email"
            type="email"
            placeholder="tunombre@bestiario.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <label htmlFor="role">Rol</label>
          <select
            id="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CUIDADOR">Cuidador</option>
            <option value="MAESTRO">Maestro</option>
          </select>
          <label htmlFor="password">Palabra mágica</label>
          <input
            id="password"
            type="password"
            placeholder="Introduce tu palabra mágica"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Registrarme en el santuario</button>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </form>
        <p className={styles.footer}>
          ¿Tienes cuenta? <a href="/auth/login">Inicia sesión en el refugio</a>
        </p>
      </div>
    </main>
  )
}
