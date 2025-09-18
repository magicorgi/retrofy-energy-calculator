import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/layout/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RetroPro 节改专家 - 专业的建筑节能改造平台",
  description: "RetroPro节改专家是专业的建筑节能改造计算工具和解决方案平台，提供HVAC节能改造、丹佛斯产品推荐、案例库、专家预约等服务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AdminProvider>
            <Navigation />
            <main>
              {children}
            </main>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
