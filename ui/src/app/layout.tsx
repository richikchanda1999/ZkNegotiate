import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { getConfig } from "./config";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const initialState = cookieToInitialState(getConfig(), h.get("cookie"));

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialState={initialState}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div
              style={{
                height: "calc(100vh - 64px)",
              }}
            >
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
