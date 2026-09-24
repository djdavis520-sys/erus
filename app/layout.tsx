import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Exotics R Us',
  description: 'Premium exotic herbs and wellness solutions sourced from around the world.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
