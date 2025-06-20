import { fetchWithTimeOut } from '@/utils/functions';
import RefreshToken from './RefreshToken';
import Auth from '@/utils/store/Authentication';
import { LayoutPaths, Paths } from '@/utils/router';
import { EResponseCode } from '@/common/enums';

const CommonCall = async (api, header) => {
    try {
        const accessToken = Auth.getAccessToken();
        let headers;
        if (accessToken) {
            headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
            };
        } else {
            headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            };
        }
        if (header && (header.method === 'POST' || header.method === 'PUT' || header.method === 'GET')) {
            headers = {
                ...headers,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            };
        }
        let head = {
            ...header,
            headers,
        };

        const response = await fetchWithTimeOut(
            fetch(api, {
                ...head,
                credentials: 'omit',
                cache: 'no-store',
            }),
        );

        if (response.status === EResponseCode.INTERNAL_SERVER_ERROR) {
            return {
                code: response.status,
                message: 'Server error',
                success: false,
            };
        }

        if (response.status === EResponseCode.OK) {
            return await response.json();
        }

        if (response.status === EResponseCode.UNAUTHORIZED) {
            //refresh token
            const resToken = await RefreshToken();

            if (resToken.success) {
                const newHeaders = {
                    ...headers,
                    Authorization: `Bearer ${resToken.access_token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Request-Headers': '*',
                };
                const newHead = {
                    ...head,
                    headers: newHeaders,
                };
                const responseRefreshToken = await fetch(api, newHead);
                const resultRefreshToken = await responseRefreshToken.json();
                return resultRefreshToken;
            }
            if (response.status === EResponseCode.UNAUTHORIZED) {
                Auth.logout();
                window.location.href = `${LayoutPaths.Auth}${Paths.LoginApp}`;
            } else {
                return {
                    code: response.code,
                    success: false,
                };
            }
        } else {
            const resJson = await response.json();
            return {
                code: resJson.status,
                message: resJson.message,
                success: false,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Network error',
        };
    }
};

export default CommonCall;
