import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from '@/core/shadcn/components/ui/sidebar';
import { ISidebarDashboardState } from '@/lib/features/sidebarDashboardSlice/type';
import { RootState } from '@/lib/services/store';
import * as React from 'react';
import { AppSideBarGroup, AppSideBarItem } from './components';
import { useAppSelector } from '@/lib/hook/redux';
import { addRolePrefixToRoutes, extractRoleFromPath } from '@/common/utils/prependRoleToRoutes';
import { usePathname } from 'next/navigation';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';
import logoImage from '@/assets/images/logo.png';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const sidebarDashboardState = useAppSelector<
        RootState,
        ISidebarDashboardState
    >((state) => state.sidebarDashboard);
    const { getRouteWithRole, navigate } = useAppNavigation();
    const path = usePathname();
    const role = extractRoleFromPath(path);
    const handleGoHome = () => navigate(getRouteWithRole(routerApp.dashboard.dashboard));

    return (
        <Sidebar {...props} className='bg-slate-800 border-r border-slate-700 shadow-2xl'>
            <SidebarHeader className='border-b border-slate-700 bg-slate-800 backdrop-blur-sm'>
                <div className="flex items-center mx-auto cursor-pointer px-4 py-4 group" onClick={handleGoHome}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200 overflow-hidden">
                            <img src={logoImage.src || logoImage} alt="NikonStore Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold leading-[155%] text-xl text-white text-center group-hover:text-blue-100 transition-colors duration-200">
                            NikonStore
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className='flex flex-col gap-2 px-3 py-4 overflow-y-auto bg-black'>
                {sidebarDashboardState.listRoute.map((item, index) => {
                    return (
                        <SidebarGroup key={index.toString()} className='space-y-1'>
                            {item.name && (
                                <SidebarGroupLabel className="text-xs font-bold text-slate-300 uppercase tracking-wider px-3 py-2.5">
                                    {item.name}
                                </SidebarGroupLabel>
                            )}

                            <SidebarGroupContent className='flex flex-col gap-1'>
                                {item.listRoute?.map((subItem, subIndex) => {
                                    const subItemWithRole = role ? addRolePrefixToRoutes([subItem], role) : [subItem];
                                    const currentRouteItem = subItemWithRole[0];
                                    const isVisible = !currentRouteItem.visibleRoles || currentRouteItem.visibleRoles.includes(role);
                                    if (!isVisible) return null;
                                    if (subItem?.type === 'item') {
                                        return (
                                            <AppSideBarItem key={subIndex.toString()}
                                                route={subItemWithRole[0]}
                                            />
                                        );
                                    }
                                    return (
                                        <AppSideBarGroup
                                            route={subItemWithRole[0]}
                                            key={subIndex.toString()}
                                        />
                                    );
                                })}
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                })}
            </SidebarContent>
        </Sidebar>
    );
}

