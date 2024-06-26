import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";
import Titlebar from "./components/TitleBar";
import { CSPostHogProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DB Lens",
  description: "Explore Databases like never before",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body className={inter.className}>
          <div className="w-screen h-screen max-h-screen text-gray-800 focus:font-bold focus:outline-none">
            <Titlebar />
            <div className="flex w-full h-full" style={{ paddingTop: 25 }}>
              <Sidebar />
              <div className="bg-gray-100 w-full max-w-full h-full max-h-full flex flex-row overflow-hidden font-mono">
                {children}
              </div>
            </div>
          </div>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
