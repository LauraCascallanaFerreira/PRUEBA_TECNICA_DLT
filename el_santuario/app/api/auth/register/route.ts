import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json()

        const userExists = await prisma.user.findUnique({ where: {email} })

        if(userExists) {
            return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400})
        }

        const hashedPassword = await hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name, 
                email,
                password: hashedPassword,
                role,
            },
        })

        return NextResponse.json({ user }, { status: 201})
    } catch (error) {
        console.error('Error al registrar el usuario:', error)
        return NextResponse.json({ error: 'Error al registrar el usuario' }, { status: 500})
    }
}