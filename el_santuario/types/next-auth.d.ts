import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "MAESTRO" | "CUIDADOR";
      email: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "MAESTRO" | "CUIDADOR";
    email: string;
  }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: "MAESTRO" | "CUIDADOR"
    }
}