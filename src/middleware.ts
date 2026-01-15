import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isProfilePage = req.nextUrl.pathname.startsWith('/profile');
  const isCheckoutPage = req.nextUrl.pathname.startsWith('/checkout');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return NextResponse.next();
  }

  if (isAdminPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.nextUrl));
    }
    // Role check is better handled in layout for security, 
    // but we can check here if we put role in session token (which we did).
    if (req.auth?.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  if (isProfilePage || isCheckoutPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
