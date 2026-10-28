import type { Metadata, Viewport } from "next";
import "./globals.css";

const basePath = "/seldol";

export const metadata: Metadata = {
  title: {
    default: "SELDOL — Buy Smart. Sell Easy.",
    template: "%s | SELDOL",
  },
  description:
    "Discover pre-owned products across India. Buy and sell second-hand mobiles, electronics, fashion, accessories and furniture on SELDOL.",
  applicationName: "SELDOL",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SELDOL",
  },
  icons: {
    icon: `${basePath}/icon.svg`,
    apple: `${basePath}/icon.svg`,
  },
  manifest: `${basePath}/manifest.json`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
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
