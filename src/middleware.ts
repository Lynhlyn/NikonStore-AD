import { NextRequest, NextResponse } from 'next/server';
import { EUserRole } from '@/common/enums';
import { getAuthFromCookie } from '@/common/utils/auth';
import { routerApp } from '@/router';

export const listPathRole = Object.values(EUserRole);
const authRouters = [routerApp.auth.signIn, routerApp.auth.forgotPassword, routerApp.auth.resetPassword];

export async function middleware(request: NextRequest) {
   const auth = await getAuthFromCookie();
   const { pathname } = request.nextUrl;

  const res = NextResponse.next();
  if (listPathRole.some((path) => pathname.includes(path))) {
    const rolePath = pathname.split('/')[1];
    if ((auth && auth.token.refreshToken ) && authRouters.some(route => pathname.endsWith(route))) {
      const redirectResponse = NextResponse.redirect(new URL(`/${rolePath}`, request.url));
      redirectResponse.headers.set('x-role', rolePath);
      return redirectResponse;
    }
    res.headers.set('x-role', rolePath);
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

