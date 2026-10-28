import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SELDOL — Buy Smart. Sell Easy.",
  description:
    "Buy and sell second-hand products across India. Discover great deals on mobiles, bikes, electronics, furniture and more with SELDOL.",
  applicationName: "SELDOL",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SELDOL",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1767d2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
