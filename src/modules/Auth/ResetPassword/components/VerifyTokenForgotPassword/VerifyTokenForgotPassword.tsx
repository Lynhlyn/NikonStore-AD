import type React from 'react';
import { UIButton } from '@/core/ui';
import { ESize } from '@/core/ui/Helpers/UIsize.enum';
import { useForgotPasswordMutation } from '@/lib/services/modules/authService';
import { useState } from 'react';
import { IVerifyTokenForgotPasswordProps } from './VerifyTokenForgotPassword.type';
import { getRoleFromPathName } from '@/common/utils/pathname';
import { toast } from 'sonner';
import { ForgotPasswordSuccess } from '@/modules/Auth/ForgotPassword/components';

const VerifyTokenForgotPassword: React.FC<IVerifyTokenForgotPasswordProps> = (
  props
) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const email = userEmail || extractEmailFromToken(props.token);
      
      if (!email) {
        toast.error('Không thể xác định email. Vui lòng thử lại từ đầu.');
        return;
      }

      await forgotPassword({ email, role: getRoleFromPathName() }).unwrap();
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi email');
    } finally {
      setIsLoading(false);
    }
  };

  const extractEmailFromToken = (token: string): string => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || '';
    } catch {
      return '';
    }
  };

  return (
    <div>
       {
        !isSubmitted ? (
          <div className="flex flex-col justify-center w-[530px]">
          <div className="w-full mb-[35px]">
            <h3 className="text-[28px] text-[#454A70] dark:text-foreground font-bold leading-[170%] text-center">
              Gửi email đặt lại mật khẩu
            </h3>
          </div>
          <div className="w-full bg-white dark:bg-card border border-solid border-[#CCC] dark:border-border pt-[35px] pb-[50px] px-10 rounded-md font-normal text-base leading-[170%] text-[#333] dark:text-foreground">
            <div>
              <p className="text-center mb-[25px] font-bold text-[#FF1717] dark:text-destructive">
                Liên kết không hợp lệ.<br />
                Có thể bạn đã gửi yêu cầu khác<br />
                hoặc liên kết đã hết hạn. <br />
                Vui lòng thử đặt lại mật khẩu một lần nữa.
              </p>
              <p className="text-center mb-[35px]">
                Gửi lại email xác thực và
                <br />
                nhấp vào URL trong email trong vòng 30 phút <br />
                để hoàn tất việc đặt lại mật khẩu.
              </p>
              <div className="w-full mx-auto mb-[50px]">
                <UIButton
                  isLoading={isLoading}
                  onClick={handleResendEmail}
                  className="font-bold mt-10 h-[50px] w-full mx-auto rounded-[50px] text-[15px] leading-[170%]"
                  size={ESize.XL}
                >
                  Gửi email xác thực
                </UIButton>
              </div>
            </div>
            <div className="w-full rounded-md bg-[#F4F4F4] dark:bg-muted px-10 py-[38px]">
              <p className="text-center mb-[29px] font-semibold">
                Trường hợp không nhận được email
              </p>
              <div>
                <p>
                  <span className="font-medium">•</span>
                  Vui lòng kiểm tra xem địa chỉ email từ domain @ có bị chặn trong cài đặt từ chối nhận email không, và kiểm tra thư mục spam.
                </p>
                <p>
                  <span className="font-medium">•</span>
                  Nếu bạn nhập sai địa chỉ email, vui lòng đăng ký lại với địa chỉ email chính xác từ đây.
                </p>
              </div>
            </div>
          </div>
        </div>
        ) : (
          <ForgotPasswordSuccess />
        )
       }
    </div>
  );
};

export { VerifyTokenForgotPassword };

