import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');

      if (isOnAuth) {
        if (isLoggedIn) {
            return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }

      if (isOnAdmin) {
        if (isLoggedIn && auth.user.role === 'ADMIN') return true;
        return false; // Redirect to login
      }

      if (isOnProfile || isOnCheckout) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
      }
      return token;
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
