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
import { AppSideBarItem } from './components';
import { useAppSelector } from '@/lib/hook/redux';
import { usePathname } from 'next/navigation';
import { useAppNavigation } from '@/common/hooks';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const sidebarDashboardState = useAppSelector<
        RootState,
        ISidebarDashboardState
    >((state) => state.sidebarDashboard);
    const { getRouteWithRole, navigate, goToHome } = useAppNavigation();
    const path = usePathname();

    return (
        <>
            <Sidebar {...props} className='bg-background'>
                <SidebarHeader>
                    <div className="flex items-center mx-auto cursor-pointer" onClick={goToHome}>
                        <span className="font-bold leading-[155%] text-2xl text-center">NikonStore</span>
                    </div>
                </SidebarHeader>
                <SidebarContent className='flex flex-col gap-3'>
                    {sidebarDashboardState.listRoute.map((item, index) => {
                        return (
                            <SidebarGroup key={index.toString()}>
                                <SidebarGroupLabel className="text-base text-black">
                                    {item.name}
                                </SidebarGroupLabel>

                                <SidebarGroupContent className='flex flex-col gap-2'>
                                    {item.listRoute?.map((subItem, subIndex) => {
                                        if (subItem?.type === 'item') {
                                            return (
                                                <AppSideBarItem key={subIndex.toString()}
                                                    route={subItem}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )
                    })}
                </SidebarContent>
            </Sidebar>
        </>
    );
}

