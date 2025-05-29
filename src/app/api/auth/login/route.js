import { EResponseCode } from '@/common/enums';
import { URL_API } from '@/constants/ApiUrl';
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

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ message: 'Missing username or password' }, { status: EResponseCode.BAD_REQUEST });
    }
    const response = await fetch(`${URL_API}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status !== EResponseCode.OK) {
      const errorData = await response.json();
      return NextResponse.json(
        { code: 101, message: errorData.message || 'Login failed' },
        { status: response.status },
      );
    }

    const data = await response.json();

    if (data.code === 0) {
      const { token, access_store, fullname } = data;
      const cookieStore = cookies();

      if (!token) {
        return NextResponse.json({ message: 'Missing token' }, { status: EResponseCode.BAD_REQUEST });
      }

      const decodedToken = decodeJWT(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenMaxAge = decodedToken.exp - currentTime;

      cookieStore.set('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenMaxAge,
        path: '/',
      });

      cookieStore.set('accessStore', access_store, {
        path: '/',
      });

      cookieStore.set('fullName', fullname, {
        path: '/',
      });
    }

    return NextResponse.json(data, { status: EResponseCode.OK });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { code: 500, message: 'Internal server error' },
      { status: EResponseCode.INTERNAL_SERVER_ERROR },
    );
  }
}
