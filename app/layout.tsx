import type { Metadata, Viewport } from "next";
import { Mali } from "next/font/google";
import "./globals.css";

const mali = Mali({
  subsets: ["latin", "thai"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-mali"
});

export const metadata: Metadata = {
  title: "Anniversary Quest",
  description: "A private pixel story game for anniversary and birthday memories."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={mali.variable}>
      <body className={mali.className}>{children}</body>
    </html>
  );
}
