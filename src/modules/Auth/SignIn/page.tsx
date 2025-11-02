import { LoginForm } from './components';

const SignInPage: React.FC = async () => {
  return (
    <div className="flex flex-col justify-center items-center w-full max-w-[530px] mx-auto h-screen">
      <div className="w-full mb-[30px]">
        <h3 className="text-[28px] text-[#454A70] dark:text-foreground font-bold heading-[170%] text-center">
          Đăng nhập
        </h3>
      </div>
      <div className="w-full mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;

