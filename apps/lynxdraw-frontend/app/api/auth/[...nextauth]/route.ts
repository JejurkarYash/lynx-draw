import NextAuth, { Session } from "next-auth";
import GoogleProviders from "next-auth/providers/google";
import axios from "axios";

// extending the type of session  
declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}

const handler = NextAuth({
    providers: [
        GoogleProviders({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
        })
    ],

    session: { strategy: "jwt" },
    callbacks: {
        //@ts-ignore 
        async jwt({ token, account, profile }) {
            if (account && profile) {
                console.log("account: ", account, "profile:", profile);
                try {
                    // calling express  endpoint
                    const response = await axios.post(`http://localhost:3001/google-login`, {
                        name: profile.name,
                        email: profile.email,
                    });

                    console.log(response.data);
                    if (!response.data.token) {
                        throw new Error("No token received from backend");
                    }

                    token.accessToken = response.data.token;
                } catch (err) {
                    console.log("Error during Google login:", err);
                }
            }

            return token;
        },

        async session({ session, token }: { session: Session, token: any }) {
            session.accessToken = token.accessToken;
            return session;
        }
    }
})

export { handler as GET, handler as POST }