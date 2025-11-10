import { EUserRole } from "../enums";

export function addRolePrefixToRoutes(
    routes: any[],
    role: EUserRole
): any[] {
    const prefix = `/${role}`;

    const hasPrefix = (path: string) =>
        path.startsWith(prefix);

    const withPrefix = (path?: string) =>
        path ? (hasPrefix(path) ? path : `${prefix}${path}`) : undefined;

    return routes.map((item) => {
        return {
            ...item,
            route: withPrefix(item.route),
            routerActive: item.routerActive?.map(withPrefix),
            subsRoute: item.subsRoute
                ? addRolePrefixToRoutes(item.subsRoute, role)
                : undefined,
        };
    });
}

export function extractRoleFromPath(path: string): EUserRole | undefined {
    const firstSegment = path.split("/").filter(Boolean)[0];
    return Object.values(EUserRole).includes(firstSegment as EUserRole)
        ? (firstSegment as EUserRole)
        : undefined;
}

