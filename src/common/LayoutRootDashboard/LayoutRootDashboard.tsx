'use client';

import { SidebarInset, SidebarProvider } from "@/core/shadcn/components/ui/sidebar";
import { AppSidebar } from "./components";
import { Menu } from "lucide-react";
import { NavBarUser } from "./components/NavBar/components";
import { useAppNavigation } from "../hooks";
import { useAppSelector, useAppDispatch } from '@/lib/hook/redux';
import { RootState } from '@/lib/services/store';
import { toggleSidebar } from '@/lib/features/appSlice';
import { Button } from "@/core/shadcn/components/ui/button";

interface ILayoutRootDashboardProps {
    children: React.ReactNode;
    initialUserData?: any;
}

const LayoutRootDashboard = ({ children, initialUserData }: ILayoutRootDashboardProps) => {
    const { getRouteWithRole } = useAppNavigation();
    const dispatch = useAppDispatch();
    const isOpenSidebar = useAppSelector<RootState, boolean>(
        (state) => state.app.isOpenSidebar
    );

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };

    return (
        <SidebarProvider 
            className="h-full"
            open={isOpenSidebar}
            onOpenChange={(open) => dispatch(toggleSidebar())}
        >
            <AppSidebar />
            <SidebarInset className="bg-background overflow-x-hidden">
                <header className="flex sticky top-0 bg-[#454A70] z-40 shrink-0 items-center gap-2 border-b px-4 lg:px-12 h-[60px]">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleSidebar}
                                className="text-white hover:bg-white/10 hover:text-white -ml-1"
                                aria-label={isOpenSidebar ? 'Close sidebar' : 'Open sidebar'}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="text-lg font-bold leading-[155%] text-white">
                                NikonStore Admin
                            </div>
                        </div>
                        <div className="flex gap-7 items-center">
                            <NavBarUser />
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 w-full">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
};

export default LayoutRootDashboard;

