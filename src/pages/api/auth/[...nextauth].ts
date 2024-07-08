import NextAuth, { NextAuthOptions } from "next-auth";
import AffinidiProvider from "src/utils/AffinidiProvider";

import {
  authJwtSecret,
  providerClientId,
  providerClientSecret,
} from "src/utils/env";

export const authOptions: NextAuthOptions = {
  debug: false,
  session: { strategy: "jwt" },
  secret: authJwtSecret,
  providers: [
    AffinidiProvider({
      clientId: providerClientId,
      clientSecret: providerClientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      return {
        ...token,
        ...(account?.access_token && { accessToken: account?.access_token }),
        ...(account?.id_token && { idToken: account?.id_token }),
      };
    },
    async session({ session, token }) {
      return {
        ...session,
        ...(session.user && { user: { ...session.user, userId: token.sub } }),
        ...(token.accessToken && { accessToken: token.accessToken }),
        ...(token.idToken && { idToken: token.idToken }),
      };
    },
  },
};

export default NextAuth(authOptions);
