import { IAppSideBarItemProps } from "./AppSideBarItem.type";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { cn } from "@/core/shadcn/lib/utils";
import { useCheckRouter } from "@/common/hooks/useCheckRouter";
import Link from "next/link";
import { isValidIcon } from "@/common/utils/icon";
import { renderIcon } from "@/common/LayoutRootDashboard/utils/utils";
import { useAppSelector } from '@/lib/hook/redux';
import { RootState } from '@/lib/services/store';
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/core/shadcn/components/ui/tooltip";

const AppSideBarItem: React.FC<IAppSideBarItemProps> = (props) => {
    const {
        route,
        isSubItem = false,
    } = props;

    const { isActived } = useCheckRouter();
    const isOpenSidebar = useAppSelector<RootState, boolean>(
        (state) => state.app.isOpenSidebar
    );

    const appSideBarClassName = twMerge(
        clsx(
            cn("relative flex items-center gap-3 bg-slate-800/50 text-slate-200 hover:text-white hover:bg-slate-700 cursor-pointer transition-all duration-200 rounded-lg group font-medium", {
                "px-4 py-3": !isSubItem && isOpenSidebar,
                "px-6 py-2.5 text-sm ml-2": isSubItem && isOpenSidebar,
                "px-3 py-3": !isOpenSidebar,
            }),
            {
                "bg-blue-600 text-white shadow-lg shadow-blue-500/40 border-l-[3px] border-blue-400 font-semibold": isActived(route)
            },
            {
                "justify-center": !isOpenSidebar
            }
        )
    );

    const iconElement = route.icon && renderIcon(route.icon);

    const content = (
        <Link href={route.route || "#"} className="block">
            <div className={appSideBarClassName}>
                <div className={cn("flex-shrink-0 transition-all duration-200", {
                    "text-blue-200": isActived(route),
                    "text-slate-300 group-hover:text-white": !isActived(route),
                    "w-3 h-3": isSubItem && route.icon === 'Circle',
                })}>
                    {iconElement}
                </div>
                {isOpenSidebar && (
                    <>
                        <div className="flex flex-1 text-sm">
                            <span className="truncate">{route.name}</span>
                        </div>
                        {route.countNotification && (
                            <div className="w-5 h-5 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center shrink-0 font-bold shadow-lg">
                                {route.countNotification}
                            </div>
                        )}
                    </>
                )}
                {isActived(route) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-400 rounded-r-full shadow-lg shadow-blue-400/60"></div>
                )}
            </div>
        </Link>
    );

    if (!isOpenSidebar) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {content}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2 bg-slate-700 text-white border border-slate-600 shadow-xl">
                        <p className="font-medium text-sm">{route.name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return content;
};

export { AppSideBarItem };

