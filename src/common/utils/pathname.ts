import {EUserRole } from "@/common/enums";

export const isValidRolePathName = (role: string): role is EUserRole => {
    return Object.values(EUserRole).includes(role as EUserRole);
};

export const getRoleFromPathName = (): EUserRole => {
    if (typeof window === 'undefined') {
        return EUserRole.ADMIN;
    }
    const role = window.location.pathname.split('/')?.[1];
    if (!role || !isValidRolePathName(role)) {
        return EUserRole.ADMIN;
    }
    return role;
};

