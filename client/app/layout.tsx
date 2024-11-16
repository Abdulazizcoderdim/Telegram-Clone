import type { Metadata } from 'next';
import { Sour_Gummy } from 'next/font/google';
import './globals.css';

const sourGummy = Sour_Gummy({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sour-gummy',
});

export const metadata: Metadata = {
  title: 'Telegram',
  description: 'Telegram web application clone',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourGummy.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
