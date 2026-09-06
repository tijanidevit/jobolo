import { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../providers/providers';

export const metadata: Metadata = {
  title: 'Jobolo - The Job Search Operating System',
  description: 'Track your applications, ace your interviews, and land your dream job with Jobolo.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
