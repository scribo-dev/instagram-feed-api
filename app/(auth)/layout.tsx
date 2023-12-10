import "../globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Footer from "../Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
