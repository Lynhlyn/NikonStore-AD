import React from 'react';

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#4CD596] border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-semibold text-gray-700 dark:text-foreground">Đang tải</p>
      </div>
    </div>
  );
};

export default LoadingComponent;

