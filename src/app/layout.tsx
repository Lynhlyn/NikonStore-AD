import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import '@/styles/globals.css';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Toaster } from '@/core/shadcn/components/ui/sonner';

const notoSans = Noto_Sans({
  weight: ['400', '500', '700', '600', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NikonStore Admin Dashboard',
  description: 'NikonStore Admin Dashboard - Manage camera and photography equipment',
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
            {children}
          </Suspense>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
