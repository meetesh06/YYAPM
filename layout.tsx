import { Inter } from 'next/font/google';
import React from 'react';
import StyledComponentsRegistry from './lib/AntdRegistry';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'YYAPM',
  description: 'Yet Yet Another Password Manager',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;