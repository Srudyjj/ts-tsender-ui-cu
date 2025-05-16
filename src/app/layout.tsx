import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "TSender",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
