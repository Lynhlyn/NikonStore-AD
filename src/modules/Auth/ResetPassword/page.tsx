'use client';
import { ResetPasswordForm, VerifyTokenForgotPassword } from './components';
import { useValidateResetTokenQuery } from '@/lib/services/modules/authService';
import LoadingComponent from '@/common/components/loading/LoadingComponent';
import { useAppNavigation } from '@/common/hooks';
import { routerApp } from '@/router';

interface IResetPasswordPageProps {
  searchParams: { token: string };
}

const ResetPasswordPage: React.FC<IResetPasswordPageProps> = ({
  searchParams,
}) => {
   const { getRouteWithRole, navigate } = useAppNavigation();
  const token = searchParams.token;
  const { data, error, isLoading } = useValidateResetTokenQuery(token, { skip: !token });
  
  if (isLoading) return <LoadingComponent />;
  
  const errorMessage = error && 'data' in error && (error.data as { message: string }).message;
  const isExpired = errorMessage === 'Token không hợp lệ' || errorMessage === 'Invalid token';
  
  if (error && !isExpired) {
    navigate(getRouteWithRole(routerApp.auth.forgotPassword));
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {data ? (
        <ResetPasswordForm token={token} />
      ) : (
        isExpired && <VerifyTokenForgotPassword token={token}/>
      )}
    </div>
  );
};

export default ResetPasswordPage;

