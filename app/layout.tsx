import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paystreet Admin Portal UI",
  description: "Admin portal for Paystreet",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Paystreet Admin Portal UI",
    description: "Admin portal for Paystreet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Paystreet Admin",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}


