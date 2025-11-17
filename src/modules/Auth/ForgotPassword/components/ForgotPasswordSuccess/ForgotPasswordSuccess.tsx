import type React from 'react';

const ForgotPasswordSuccess: React.FC = () => {
  return (
    <div className="flex flex-col justify-center w-full max-w-md">
      <div className="w-full mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          Đã gửi email đặt lại mật khẩu
        </h1>
        <p className="text-slate-300 text-sm">
          Vui lòng kiểm tra hộp thư của bạn
        </p>
      </div>
      <div className="w-full backdrop-blur-xl bg-white/10 border border-white/20 py-[50px] px-10 rounded-2xl shadow-2xl text-base leading-[170%] text-white">
        <p className="text-center mb-10">
          Vui lòng nhấp vào đường link trong email trong vòng 30 phút
          <br />
          để hoàn tất đặt lại mật khẩu.
        </p>
        <div className="w-full rounded-md bg-white/5 backdrop-blur-sm border border-white/10 px-10 py-[38px]">
          <p className='text-center mb-[29px] font-semibold'>Nếu bạn không nhận được email</p>
          <div className="space-y-3 text-sm text-slate-200">
            <p>
              ・Vui lòng kiểm tra xem email có bị chặn bởi cài đặt lọc thư hoặc nằm trong thư mục spam không.
            </p>
            <p>
              ・Nếu bạn nhập sai địa chỉ email, vui lòng thử lại với địa chỉ đúng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ForgotPasswordSuccess };

