import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../index.css';

// Disable static generation for the entire app since it uses React Router
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lavatec',
  description: 'Lavatec web application',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
