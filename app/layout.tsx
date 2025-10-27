import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PayStreet Admin Portal v2",
  description: "Enhanced Admin Portal for PayStreet - KYC, KYB, Transaction Monitoring & More",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PayStreet Admin Portal v2",
    description: "Enhanced Admin Portal for PayStreet - KYC, KYB, Transaction Monitoring & More",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PayStreet Admin Portal",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


