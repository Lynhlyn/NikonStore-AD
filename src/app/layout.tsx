import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import '@/styles/globals.css';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Toaster } from '@/core/shadcn/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const notoSans = Noto_Sans({
  weight: ['400', '500', '700', '600', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quản trị cửa hàng Nikon Store Dashboard',
  description: 'Quản trị cửa hàng Nikon Store Dashboard - Manage camera and photography equipment',
};

const ReduxProvider = dynamic(() => import('@/lib/Provider/StoreProvider'), {
  ssr: false,
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={notoSans.className}>
        <ReduxProvider>
          <Suspense>
            <NuqsAdapter>
              {children}
            </NuqsAdapter>
          </Suspense>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
