import { UIIcons } from "@/core/ui/UIIcon/UIIcon.enum";

export function isValidIcon(icon: string): icon is keyof typeof UIIcons {
    return icon in UIIcons;
}

