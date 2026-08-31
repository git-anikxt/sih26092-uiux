import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NSFDC Scheme Finder',
  description:
    'Find and explore schemes offered by the National Scheduled Castes Finance & Development Corporation.',
  openGraph: {
    title: 'NSFDC Scheme Finder',
    description:
      'Find and explore schemes offered by the National Scheduled Castes Finance & Development Corporation.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
