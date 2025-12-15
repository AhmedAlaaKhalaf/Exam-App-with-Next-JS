import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {LoginResponse} from "./lib/types/auth";


export const authOption : NextAuthOptions = {
   pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login', // Error code passed in query string as ?error=
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await fetch(`${process.env.API}/auth/signin`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const payload: ApiResponse<LoginResponse> = await response.json();
        if ("code" in payload) {
          throw new Error(payload.message);
        }
        return {
          id: payload.user._id,
          accessToken: payload.token,
          user: payload.user,
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({token, user, trigger, session}) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user.user;
      }
      // Handle token update when update() is called
      if (trigger === "update" && session?.accessToken) {
        token.accessToken = session.accessToken;
        if (session.user) {
          token.user = session.user;
        }
      }
      return token;
    },
    session: async ({session, token}) => {
      if (token) {
        session.user = token.user!;
        session.accessToken = token.accessToken;
      }
      return session;
    }
} 
}