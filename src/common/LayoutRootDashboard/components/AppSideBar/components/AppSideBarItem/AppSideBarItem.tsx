import { IAppSideBarItemProps } from "./AppSideBarItem.type";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { cn } from "@/core/shadcn/lib/utils";
import { useCheckRouter } from "@/common/hooks/useCheckRouter";
import Link from "next/link";
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
    } = props;

    const { isActived } = useCheckRouter();
    const isOpenSidebar = useAppSelector<RootState, boolean>(
        (state) => state.app.isOpenSidebar
    );

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

    const iconElement = typeof route.icon === 'string' ? (
        <span>{route.icon}</span>
    ) : (
        route.icon
    );

    const content = (
        <Link href={route.route || "#"}>
            <div className={appSideBarClassName}>
                {iconElement && <div className="w-5 h-5 shrink-0 flex items-center justify-center">{iconElement}</div>}
                {isOpenSidebar && (
                    <>
                        <div className="flex flex-1 font-medium">
                            <span>{route.name}</span>
                        </div>
                        {route.countNotification && (
                            <div className="w-5 h-5 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center shrink-0">
                                {route.countNotification}
                            </div>
                        )}
                    </>
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
                    <TooltipContent side="right" className="ml-2">
                        <p>{route.name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return content;
};

export { AppSideBarItem };

