import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginResponse } from "./lib/types/auth";
import {
  getApiBase,
  isApiFailure,
  apiErrorMessage,
  readApiJson,
  extractLoginPayload,
} from "./lib/api";


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
        const username = String(credentials?.email ?? "").trim();
        const password = String(credentials?.password ?? "").trim();
        if (!username || !password) {
          throw new Error("Please enter your username and password.");
        }

        const response = await fetch(`${getApiBase()}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const raw = await readApiJson(response);
        if (!response.ok || isApiFailure(raw)) {
          const fallback =
            response.status === 401
              ? "Invalid username or password."
              : response.status === 403
                ? "This account cannot sign in yet (for example, email not verified)."
                : "Login failed.";
          throw new Error(apiErrorMessage(raw, fallback));
        }
        const { token, user: apiUser } = extractLoginPayload(raw);
        if (!token || !apiUser) {
          throw new Error(
            "Login succeeded but the response was missing a token or user. Check API_BASE / NEXT_PUBLIC_API_URL."
          );
        }
        const id = String(apiUser.id ?? apiUser._id ?? "");
        const user: LoginResponse["user"] = {
          _id: id,
          username: String(apiUser.username ?? ""),
          firstName: String(apiUser.firstName ?? ""),
          lastName: String(apiUser.lastName ?? ""),
          email: String(apiUser.email ?? ""),
          phone: String(apiUser.phone ?? ""),
          role: String(apiUser.role ?? "USER"),
          isVerified: Boolean(apiUser.emailVerified ?? apiUser.isVerified ?? false),
          createdAt: String(apiUser.createdAt ?? ""),
        };
        return {
          id,
          accessToken: token,
          user,
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
      return token; // token is saved to cookie
    },
    session: async ({session, token}) => {
      if (token) {
        session.user = token.user!;
        session.accessToken = token.accessToken;
      }
      return session; // session is returned to useSession()
    }
} 
}