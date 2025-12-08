'use client';

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/core/shadcn/components/ui/sidebar";
import { AppSidebar } from "./components";
import { Menu } from "lucide-react";
import { NavBarUser } from "./components/NavBar/components";
import { useAppNavigation } from "../hooks";
import { useAppSelector, useAppDispatch } from '@/lib/hook/redux';
import { RootState } from '@/lib/services/store';
import { toggleSidebar } from '@/lib/features/appSlice';
import { Button } from "@/core/shadcn/components/ui/button";
import { useFetchCurrentUserQuery } from '@/lib/services/modules/userService';
import { IAuthState } from '@/lib/features/authSlice/type';

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

    const authState = useAppSelector<RootState, IAuthState>(
        (state) => state.auth
    );

    const { isAuthenticated, token } = authState;
    
    useFetchCurrentUserQuery(null, {
        skip: !(isAuthenticated && token.accessToken !== ''),
        refetchOnMountOrArgChange: true,
    });

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
            <SidebarInset className="bg-slate-50 overflow-x-hidden">
                <header className="flex sticky top-0 bg-slate-900 z-40 shrink-0 items-center gap-2 border-b border-slate-800 px-4 lg:px-8 h-[70px] shadow-md">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleSidebar}
                                className="text-slate-200 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200"
                                aria-label={isOpenSidebar ? 'Close sidebar' : 'Open sidebar'}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="hidden md:flex items-center gap-3">
                                <div className="h-8 w-px bg-slate-700"></div>
                                <div className="text-lg font-bold leading-[155%] text-white">
                                    Quản trị cửa hàng Nikon Store
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <NavBarUser />
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 w-full p-4 lg:p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
};

export default LayoutRootDashboard;

