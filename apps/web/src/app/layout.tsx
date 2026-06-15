import type { Metadata } from 'next';
import { AppShell } from '../components/layout/AppShell';
import { Providers } from '../components/Providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'GatewayOps',
  description: 'API Gateway Monitoring Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
