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
  ChevronDown,
  User,
  Settings,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { INavBarUserProps } from './NavBarUser.type';
import { useLogout } from '@/common/hooks/useLogout';
import { useAppSelector } from '@/lib/hook/redux';
import { RootState } from '@/lib/services/store';
import { useAppNavigation } from '@/common/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/core/shadcn/components/ui/avatar';
import { cn } from '@/core/shadcn/lib/utils';
import { IUserState } from '@/lib/features/userSlice/type';

const NavBarUser: React.FC<INavBarUserProps> = () => {
  const { logout } = useLogout();
  const { goToLogin } = useAppNavigation();
  const userState = useAppSelector<RootState, IUserState>((state) => state.user || {});
  const userData = userState?.user?.data;
  
  const handleLogout = async () => {
    logout();
    await new Promise((resolve) => setTimeout(resolve, 500));
    goToLogin();
  };

  const handleProfile = () => {
    console.log('Navigate to profile');
  };

  const handleSettings = () => {
    console.log('Navigate to settings');
  };

  const userName = userData?.name || 'Admin';
  const userEmail = userData?.email || 'admin@nikonstore.com';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
          <div className="relative">
            <Avatar className="h-9 w-9 ring-2 ring-slate-700 group-hover:ring-slate-600 transition-all duration-200">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-white text-sm font-semibold leading-tight">
              {userName}
            </span>
            <span className="text-slate-300 text-xs leading-tight">
              {userEmail.split('@')[0]}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-white transition-all duration-200 hidden md:block" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 rounded-xl shadow-2xl border-slate-200 bg-white mt-2 p-2"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-3 py-3 text-left border-b border-slate-100">
            <Avatar className="h-12 w-12 ring-2 ring-slate-200">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left">
              <span className="truncate font-semibold text-slate-900 text-sm">{userName}</span>
              <span className="truncate text-xs text-slate-500">{userEmail}</span>
            </div>
          </div>
        </DropdownMenuLabel>


        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem
          className="cursor-pointer px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 transition-colors duration-150"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { NavBarUser };

