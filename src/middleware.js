import { NextResponse } from 'next/server';
import { LayoutPaths, Paths } from './utils/router';

const privatePaths = [
    '/explore-store',
    '/my-partner',
    '/dashboard/partner/',
    `${LayoutPaths.Auth}${Paths.SetPassword}`,
];
const authPaths = [
    `${LayoutPaths.Auth}${Paths.LoginApp}`,
    `${LayoutPaths.Auth}${Paths.GoogleCallback}`,
    `${LayoutPaths.Auth}${Paths.ResetPassword}`,
];

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('accessToken')?.value;

    if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
        return NextResponse.redirect(new URL(`${LayoutPaths.Auth}${Paths.LoginApp}`, request.url));
    }

    if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
        return NextResponse.redirect(new URL(`${LayoutPaths.Guest}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/explore-store',
        '/my-partner',
        '/dashboard/partner/',
        '/auth/login-app',
        '/auth/google_login_callback',
        '/auth/reset-password',
        '/auth/set-password',
    ],
};
