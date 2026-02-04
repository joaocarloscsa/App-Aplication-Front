// /var/www/GSA/animal/frontend/src/app/layout.tsx

import "./globals.css";
import { ClientProviders } from "./ClientProviders";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

