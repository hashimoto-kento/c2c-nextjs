import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID is not set");
}


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
