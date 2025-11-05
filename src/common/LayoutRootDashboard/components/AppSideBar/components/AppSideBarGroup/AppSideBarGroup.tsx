import React, { useEffect, useState } from "react";
import { IAppSideBarGroupProps } from "./AppSideBarGroup.type";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { cn } from "@/core/shadcn/lib/utils";
import { AppSideBarItem } from "../AppSideBarItem";
import { useCheckRouter } from "@/common/hooks/useCheckRouter";
import { usePathname } from "next/navigation";
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
    const isOpenSidebar = useAppSelector<RootState, boolean>(
        (state) => state.app.isOpenSidebar
    );

    const [isOpen, setIsOpen] = useState(false);
    const {
        route,
    } = props;

    const { isActived } = useCheckRouter();
    
    const appSideBarClassName = twMerge(
        clsx(
            cn("p-3 flex items-center gap-3 bg-white text-[#A5A5A5] hover:bg-[#F6F6F6] hover:text-[#333333] cursor-pointer transition-all duration-200"),
            {
                "bg-[#F6F6F6] text-[#333333] border-l-4 border-[#4cd596]": isActived(route)
            },
            {
                "justify-center": !isOpenSidebar
            }
        )
    );

    useEffect(() => {
        if (isActived(route)) {
            setIsOpen(true);
        }
    }, [pathName, route, isActived]);

    const iconElement = typeof route.icon === 'string' ? (
        <span>{route.icon}</span>
    ) : (
        route.icon
    );

    const visibleSubRoutes = route.subsRoute || [];

    // Khi sidebar đóng, hiển thị dropdown menu
    if (!isOpenSidebar) {
        return (
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <div className={appSideBarClassName}>
                                    {iconElement && <div className="w-5 h-5 shrink-0 flex items-center justify-center">{iconElement}</div>}
                                </div>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ml-2">
                            <p>{route.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent side="right" align="start" className="ml-2 min-w-48">
                    {visibleSubRoutes.map((subItem, subIndex) => {
                        const subIconElement = typeof subItem.icon === 'string' ? (
                            <span>{subItem.icon}</span>
                        ) : (
                            subItem.icon
                        );
                        
                        return (
                            <DropdownMenuItem key={subIndex.toString()} asChild>
                                <Link 
                                    href={subItem.route || "#"}
                                    className="flex items-center gap-2 w-full cursor-pointer"
                                >
                                    {subIconElement && <div className="w-4 h-4 shrink-0 flex items-center justify-center">{subIconElement}</div>}
                                    <span>{subItem.name}</span>
                                    {subItem.countNotification && (
                                        <div className="w-4 h-4 bg-red-500 text-[9px] text-white rounded-full flex items-center justify-center ml-auto">
                                            {subItem.countNotification}
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

    // Khi sidebar mở, hiển thị collapsible
    return (
        <div className="w-full space-y-2">
            <div 
                className={appSideBarClassName}
                onClick={() => setIsOpen(!isOpen)}
            >
                {iconElement && <div className="w-5 h-5 shrink-0 flex items-center justify-center">{iconElement}</div>}
                <div className="flex flex-1 font-medium">
                    <span>{route.name}</span>
                </div>
                {route.countNotification && (
                    <div className="w-5 h-5 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center shrink-0">
                        {route.countNotification}
                    </div>
                )}
                <ChevronDown
                    className={`h-4 w-4 transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>
            {isOpen && (
                <div className="space-y-2 px-2 flex flex-col gap-[2px]">
                    {visibleSubRoutes.map((subItem, subIndex) => {
                        if (subItem?.type === 'item') {
                            return (
                                <AppSideBarItem key={subIndex.toString()}
                                    route={subItem}
                                />
                            );
                        }
                        // Nested group không được hỗ trợ trong implementation này
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};

export { AppSideBarGroup };

