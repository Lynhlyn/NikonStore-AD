'use client';

import { useFetchCurrentUserQuery } from '@/lib/services/modules/userService';
import { useFetchStaffByIdQuery } from '@/lib/services/modules/staffService';
import { useAppSelector } from '@/lib/hook/redux';
import { RootState } from '@/lib/services/store';
import { IAuthState } from '@/lib/features/authSlice/type';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shadcn/components/ui/card';
import { User, Mail, Shield, Loader2, Phone, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { EUserRole } from '@/common/enums';

const getRoleDisplayName = (role: string): string => {
  if (role === EUserRole.ADMIN || role === 'main') {
    return 'Quản lý';
  }
  if (role === EUserRole.STAFF || role === 'staff') {
    return 'Nhân viên';
  }
  return role;
};

export default function DashboardPage() {
  const authState = useAppSelector<RootState, IAuthState>(
    (state) => state.auth
  );
  const { isAuthenticated, token } = authState;

  const { data: userResponse, isLoading: isLoadingUser, isError: isErrorUser } = useFetchCurrentUserQuery(null, {
    skip: !(isAuthenticated && token.accessToken !== ''),
    refetchOnMountOrArgChange: true,
  });

  const userId = userResponse?.data?.id;
  
  const { data: staffData, isLoading: isLoadingStaff, isError: isErrorStaff } = useFetchStaffByIdQuery(userId!, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const isLoading = isLoadingUser || isLoadingStaff;
  const isError = isErrorUser || isErrorStaff;

  const userName = staffData?.fullName || userResponse?.data?.name || 'Người dùng';
  const userEmail = staffData?.email || userResponse?.data?.email || '';
  const userRole = staffData?.role || userResponse?.data?.role || '';
  const userPhone = staffData?.phoneNumber || '';
  const userUsername = staffData?.username || '';
  const userStatus = staffData?.status || '';
  const createdAt = staffData?.createdAt || '';

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (isError || (!staffData && !userResponse?.data)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-red-600">Không thể tải thông tin người dùng</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-600">Chào mừng đến với Quản trị cửa hàng Nikon Store Dashboard</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Thông tin tài khoản đang đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                <p className="text-base font-semibold text-slate-900">{userEmail}</p>
              </div>
            </div>

            {userPhone && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <Phone className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Số điện thoại</p>
                  <p className="text-base font-semibold text-slate-900">{userPhone}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <Shield className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Quyền hạn</p>
                <p className="text-base font-semibold text-slate-900">{getRoleDisplayName(userRole)}</p>
              </div>
            </div>

            {userUsername && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <User className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Tên đăng nhập</p>
                  <p className="text-base font-semibold text-slate-900">{userUsername}</p>
                </div>
              </div>
            )}

            {userStatus && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                {userStatus === 'ACTIVE' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Trạng thái</p>
                  <p className={`text-base font-semibold ${userStatus === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                    {userStatus === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                  </p>
                </div>
              </div>
            )}

            {createdAt && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Ngày tạo</p>
                  <p className="text-base font-semibold text-slate-900">
                    {new Date(createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

