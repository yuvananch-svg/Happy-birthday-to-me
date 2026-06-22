import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anniversary Quest",
  description: "A private pixel story game for anniversary and birthday memories."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
