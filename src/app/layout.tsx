
import { AppProps } from "next/app";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../app/providers";
import "../app/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Dashboard App",
  description: "Todo, Weather, Gallery, and Callendar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
