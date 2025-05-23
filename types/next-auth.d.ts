import "next-auth";

// Extend the default session types for NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}

// Extend the JWT type for NextAuth
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
