import { EUserRole } from "@/common/enums";
import Cookies from "js-cookie";
import type { Storage } from "redux-persist";

interface CookieStorageOptions {
    expires?: number | Date;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    httpOnly?: boolean;
}

const getFirstPathSegment = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const segments = path.split('/').filter(Boolean);
        return segments[0] || null;
    } catch {
        return null;
    }
};

const createCookieRoleStorage = (
    options: CookieStorageOptions = {}
): Storage => {
    const { expires, secure, sameSite } = options;
    const cookieOptions = { expires, secure, sameSite };

    const getPath = () => {
        if (typeof window === "undefined") return undefined;
        return getFirstPathSegment(window.location.href) || undefined;
    };

    return {
        getItem(key: string) {
            if (typeof window === "undefined") return Promise.resolve(null);
            const value = Cookies.get(key) || null;
            return Promise.resolve(value);
        },

        setItem(key: string, value: string) {
            if (typeof window === "undefined") return Promise.resolve();
            const path = getPath();
            if (path && Object.values(EUserRole).includes(path as EUserRole)) {
                Cookies.set(key, value, {
                    ...cookieOptions,
                    path: `/${path}`,
                });
            }
            return Promise.resolve();
        },

        removeItem(key: string) {
            if (typeof window === "undefined") return Promise.resolve();
            Cookies.remove(key);
            return Promise.resolve();
        },
    };
};

export default createCookieRoleStorage;

