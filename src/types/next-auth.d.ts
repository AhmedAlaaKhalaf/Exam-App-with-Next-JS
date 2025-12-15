import "next-auth";
import "next-auth/jwt";

type UserInfo = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
};

declare module "next-auth" {
  interface User {
    accessToken?: string;
    user?: UserInfo;
  }

  interface Session {
    accessToken?: string;
    user: UserInfo;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: UserInfo;
  }
}

