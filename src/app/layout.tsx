import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '사용자 정보 서비스',
  description: '사용자 정보 관리 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
