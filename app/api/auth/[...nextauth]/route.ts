import NextAuth from "next-auth";

import type { DefaultUser } from "next-auth";
import { authOptions } from "@/lib/auth-options";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & { id: string };
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
