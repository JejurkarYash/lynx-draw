import NextAuth, { Session } from "next-auth";
import GoogleProviders from "next-auth/providers/google";
import axios from "axios";

// extending the type of session
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProviders({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
    }),
  ],

  session: { strategy: "jwt" },
  callbacks: {
    //@ts-ignore
    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          // calling express  endpoint
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HTTP_BAKCKEND_URL}/google-login`,
            {
              name: profile.name,
              email: profile.email,
            },
          );

          console.log(response.data);
          if (!response.data.token) {
            throw new Error("No token received from backend");
          }

          token.userId = response.data.userId;
          token.accessToken = response.data.token;
        } catch (err) {
          console.log("Error during Google login:", err);
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: any }) {
      session.accessToken = token.accessToken;
      session.user.id = token.userId;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
