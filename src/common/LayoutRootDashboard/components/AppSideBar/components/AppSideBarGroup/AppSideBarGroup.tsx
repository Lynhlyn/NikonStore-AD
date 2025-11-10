import React, { useEffect } from "react";
import { IAppSideBarGroupProps } from "./AppSideBarGroup.type";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/core/shadcn/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { cn } from "@/core/shadcn/lib/utils";
import { AppSideBarItem } from "../AppSideBarItem";
import { useCheckRouter } from "@/common/hooks/useCheckRouter";
import { usePathname } from "next/navigation";
import { isValidIcon } from "@/common/utils/icon";
import { renderIcon } from "@/common/LayoutRootDashboard/utils/utils";
import { addRolePrefixToRoutes, extractRoleFromPath } from "@/common/utils/prependRoleToRoutes";
import { useAppSelector } from '@/lib/hook/redux';
import { RootState } from '@/lib/services/store';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/core/shadcn/components/ui/dropdown-menu";
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/core/shadcn/components/ui/tooltip";
import Link from "next/link";

const AppSideBarGroup: React.FC<IAppSideBarGroupProps> = (props) => {
    const pathName = usePathname();
    const role = extractRoleFromPath(pathName);
    const isOpenSidebar = useAppSelector<RootState, boolean>(
        (state) => state.app.isOpenSidebar
    );

    const [isOpen, setIsOpen] = React.useState(false);
    const {
        route,
    } = props;

    const { isActived } = useCheckRouter();
    
    const appSideBarClassName = twMerge(
        clsx(
            cn("relative px-4 py-3 flex items-center gap-3 bg-slate-800/50 text-slate-200 hover:text-white hover:bg-slate-700 cursor-pointer transition-all duration-200 rounded-lg group font-medium"),
            {
                "bg-blue-600 text-white shadow-lg shadow-blue-500/40 font-semibold": isActived(route)
            },
            {
                "justify-center px-3": !isOpenSidebar
            }
        )
    );

    useEffect(() => {
        if (isActived(route)) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [pathName]);

    const iconElement = route.icon && renderIcon(route.icon);

    const visibleSubRoutes = route.subsRoute?.filter((subItem) => {
        const subItemWithRole = role ? addRolePrefixToRoutes([subItem], role) : [subItem];
        const currentSubRouteItem = subItemWithRole[0];
        return !currentSubRouteItem.visibleRoles || currentSubRouteItem.visibleRoles.includes(role);
    }) || [];

    // Khi sidebar đóng, hiển thị dropdown menu
    if (!isOpenSidebar) {
        return (
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <div className={appSideBarClassName}>
                                    {iconElement}
                                </div>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ml-2 bg-slate-700 text-white border border-slate-600 shadow-xl">
                            <p className="font-medium text-sm">{route.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent side="right" align="start" className="ml-2 min-w-48 bg-slate-700 border border-slate-600 text-white shadow-2xl rounded-lg p-1.5">
                    {visibleSubRoutes.map((subItem, subIndex) => {
                        const subItemWithRole = role ? addRolePrefixToRoutes([subItem], role) : [subItem];
                        const currentSubRouteItem = subItemWithRole[0];
                        
                        return (
                            <DropdownMenuItem key={subIndex.toString()} asChild>
                                <Link 
                                    href={currentSubRouteItem.route || "#"}
                                    className="flex items-center gap-2.5 w-full cursor-pointer px-3 py-2.5 rounded-md hover:bg-slate-600 transition-colors duration-150 text-slate-200 hover:text-white font-medium"
                                >
                                    <div className="text-slate-300">
                                        {currentSubRouteItem.icon && renderIcon(currentSubRouteItem.icon)}
                                    </div>
                                    <span className="text-sm">{currentSubRouteItem.name}</span>
                                    {currentSubRouteItem.countNotification && (
                                        <div className="w-4 h-4 bg-red-500 text-[9px] text-white rounded-full flex items-center justify-center ml-auto font-bold shadow-md">
                                            {currentSubRouteItem.countNotification}
                                        </div>
                                    )}
                                </Link>
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Khi sidebar mở, hiển thị collapsible như bình thường
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
        >
            <CollapsibleTrigger asChild>
                <div className={appSideBarClassName}>
                    <div className={cn("flex-shrink-0 transition-all duration-200", {
                        "text-blue-200": isActived(route),
                        "text-slate-300 group-hover:text-white": !isActived(route)
                    })}>
                        {iconElement}
                    </div>
                    <div className="flex flex-1 text-sm">
                        <span className="truncate">{route.name}</span>
                    </div>
                    {route.countNotification && (
                        <div className="w-5 h-5 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center shrink-0 font-bold shadow-lg">
                            {route.countNotification}
                        </div>
                    )}
                    <ChevronDown
                        className={cn("h-4 w-4 transform duration-200 shrink-0 transition-all", {
                            "rotate-180 text-blue-200": isOpen,
                            "text-slate-300 group-hover:text-white": !isOpen
                        })}
                    />
                    {isActived(route) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-400 rounded-r-full shadow-lg shadow-blue-400/60"></div>
                    )}
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 px-2 flex flex-col gap-1 mt-1 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                {visibleSubRoutes.map((subItem, subIndex) => {
                    const subItemWithRole = role ? addRolePrefixToRoutes([subItem], role) : [subItem];
                    const currentSubRouteItem = subItemWithRole[0];

                    if (subItem?.type === 'item') {
                        return (
                            <AppSideBarItem key={subIndex.toString()}
                                route={currentSubRouteItem}
                                isSubItem={true}
                            />
                        );
                    }
                    return (
                        <AppSideBarGroup
                            route={currentSubRouteItem}
                            key={subIndex.toString()} 
                        />
                    );
                })}
            </CollapsibleContent>
        </Collapsible>
    );
};

export { AppSideBarGroup };

