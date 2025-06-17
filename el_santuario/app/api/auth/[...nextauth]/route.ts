import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                });

                if (user && credentials?.password) {
                    const isValid = await compare(credentials.password, user.password);
                    if (isValid) return user;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user){
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },
        async session({ session, token }) {
            if(token) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'MAESTRO' | 'CUIDADOR';
            }
            return session;
        },
    }, 
    pages: {
        signIn: '/auth/login',
    },
});

export {handler as GET, handler as POST}