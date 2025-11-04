import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/core/shadcn/components/ui/dropdown-menu';
import {
  LogOut,
} from 'lucide-react';
import { INavBarUserProps } from './NavBarUser.type';
import { useLogout } from '@/common/hooks/useLogout';
import { useAppSelector } from '@/lib/hook/redux';
import { RootState } from '@/lib/services/store';
import { useAppNavigation } from '@/common/hooks';
import { ChevronDown } from 'lucide-react';

const NavBarUser: React.FC<INavBarUserProps> = () => {
  const { logout } = useLogout();
  const { goToLogin } = useAppNavigation();
  const userState = useAppSelector<RootState, any>((state) => state.user || {});
  const user = userState?.user || {};
  const handleLogout = async () => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 500));
    goToLogin();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-x-4 cursor-pointer">
          <div className="flex items-center gap-x-2">
            <span className="text-white leading-[155%] inline-block">
            {user?.data?.name || user?.name || 'Admin'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-[160px] rounded-lg mt-2"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.data?.name || user?.name || 'Admin'}</span>
              <span className="truncate text-xs">{user?.data?.email || user?.email || ''}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { NavBarUser };

