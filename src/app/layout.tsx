import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Location Explorer",
  description: "Find your way to amazing places.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
