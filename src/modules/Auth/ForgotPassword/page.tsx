'use client';

import { useState } from 'react';
import { ForgotPasswordForm, ForgotPasswordSuccess } from './components';

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const handleSubmitFrom = (value:boolean) => {
    setIsSubmitted(value);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      {!isSubmitted ? (
        <ForgotPasswordForm handleSubmitFrom={handleSubmitFrom} />
      ) : (
        <ForgotPasswordSuccess />
      )}
    </div>
  );
};

export default ForgotPasswordPage;

