import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

interface User {
    id: string;
    email: string;
    name: string;
    role: "MAESTRO" | "CUIDADOR"
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                };
            },
        }),
    ],
    session:{
        strategy: "jwt",
        maxAge: 600,
        updateAge: 300,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as User;
                token.id = u.id;
                token.role = u.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "MAESTRO" | "CUIDADOR";
            }
            return session;
        },
    },
};
