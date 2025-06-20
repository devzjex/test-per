import { LayoutPaths, Paths } from '../router';

const EXCLUDED_PATHS = [
    `${LayoutPaths.Auth}${Paths.LoginApp}`,
    `${LayoutPaths.Auth}${Paths.Register}`,
    `${LayoutPaths.Auth}${Paths.SetPassword}`,
    `${LayoutPaths.Auth}${Paths.GoogleCallback}`,
    `${LayoutPaths.Auth}${Paths.ResetPassword}`,
];

export const isValidPreviousUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return !EXCLUDED_PATHS.some((path) => urlObj.pathname.startsWith(path));
    } catch (e) {
        return false;
    }
};

export const getValidPreviousUrl = (currentUrl) => {
    if (!currentUrl || !isValidPreviousUrl(currentUrl)) {
        return '/';
    }
    return currentUrl;
};
