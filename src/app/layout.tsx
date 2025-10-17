import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import '@/styles/globals.css';

const notoSans = Noto_Sans({
  weight: ['400', '500', '700', '600', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NikonStore Admin Dashboard',
  description: 'NikonStore Admin Dashboard - Manage camera and photography equipment',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={notoSans.className}>
        {children}
      </body>
    </html>
  );
}
