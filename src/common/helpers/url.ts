function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

function getFirstPathSegment(url: string): string | null {
    try {
        const pathname = isValidUrl(url) ? new URL(url).pathname : url;
        const segments = pathname.split('/').filter(Boolean);
        return `${segments[0]}` || null;
    } catch (e) {
        return null;
    }
}

function addPathSegment(url: string, segment: string): string {
    try {
        return `/${segment}${url}`;
    } catch {
        return url;
    }
}

export { getFirstPathSegment, addPathSegment };

