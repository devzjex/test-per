import { EResponseCode } from '@/common/enums';
import { DOMAIN, URL_API } from '@/constants/ApiUrl';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function decodeJWT(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
        return JSON.parse(payload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const state = url.searchParams.get('state');
        const code = url.searchParams.get('code');

        if (!state || !code) {
            return NextResponse.json({ message: 'Missing state or code' }, { status: EResponseCode.BAD_REQUEST });
        }

        const response = await fetch(
            `${URL_API}google_login_callback?redirect_url=${DOMAIN}google_login_callback&state=${state}&code=${code}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { code: 101, message: errorData.message || 'Login failed' },
                { status: response.status },
            );
        }

        const data = await response.json();

        if (data.code === 0) {
            const { token, access_store, fullname } = data;

            if (!token) {
                return NextResponse.json({ message: 'Missing token' }, { status: EResponseCode.BAD_REQUEST });
            }

            const decodedToken = decodeJWT(token);
            if (!decodedToken || !decodedToken.exp) {
                return NextResponse.json({ message: 'Invalid token' }, { status: EResponseCode.BAD_REQUEST });
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const tokenMaxAge = decodedToken.exp - currentTime;

            const res = NextResponse.json(data, { status: EResponseCode.OK });

            res.cookies.set('accessToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: tokenMaxAge,
                path: '/',
            });

            res.cookies.set('accessStore', access_store ?? '', {
                path: '/',
            });

            res.cookies.set('fullName', fullname ?? '', {
                path: '/',
            });

            return res;
        } else {
            return NextResponse.json(data, { status: EResponseCode.UNAUTHORIZED });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json(
            { code: 500, message: 'Internal server error' },
            { status: EResponseCode.INTERNAL_SERVER_ERROR },
        );
    }
}
