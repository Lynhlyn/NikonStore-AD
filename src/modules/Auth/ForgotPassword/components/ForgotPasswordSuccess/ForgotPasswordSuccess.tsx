import type React from 'react';

const ForgotPasswordSuccess: React.FC = () => {
  return (
    <div className="flex flex-col justify-center w-full max-w-[530px]">
      <div className="w-full mb-[35px]">
        <h3 className="text-[28px] text-[#454A70] dark:text-foreground font-bold heading-[170%] text-center">
          Đã gửi email đặt lại mật khẩu
          <br />
          đến địa chỉ của bạn
        </h3>
      </div>
      <div className="w-full bg-white border border-solid border-[#CCC] dark:bg-card dark:border-border py-[50px] px-10 rounded-md text-base leading-[170%] text-[#333] dark:text-foreground">
        <p className="text-center mb-10 ">
          Vui lòng nhấp vào đường link trong email trong vòng 30 phút
          <br />
          để hoàn tất đăng ký thành viên.
        </p>
        <div className="w-full rounded-md bg-[#F4F4F4] dark:bg-muted px-10 py-[38px]">
          <p className='text-center mb-[29px]'>Nếu bạn không nhận được email</p>
          <div>
            <p>
              ・Vui lòng kiểm tra xem email có bị chặn bởi cài đặt lọc thư hoặc nằm trong thư mục spam không.
            </p>
            <p>
              ・Nếu bạn nhập sai địa chỉ email, vui lòng đăng ký lại với địa chỉ đúng tại đây.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ForgotPasswordSuccess };

