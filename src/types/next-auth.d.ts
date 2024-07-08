import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      userId: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken: string | undefined;
    idToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string | undefined;
    idToken: string;
  }
}
