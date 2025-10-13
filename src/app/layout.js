import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import Toaster from "@/components/WebsiteComponents/Toaster";
import AuthCleanup from "@/lib/common/AuthCleanup";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Ma3rood",
  description: "Ma3rood - The Kingdom's marketplace for everything from household items and cars to homes, jobs, and services.",
other: {
    "google-site-verification": "QOcVF2O0EwymmQj0mtALBvLdFn8PN1QjHWk2pIKwaME",
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("i18next")?.value || "en";
  const dir = lang === "ar" ? "rtl" : "ltr";
  return (
    <html lang="en" dir={dir}>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
        className={`${lang === "ar" ? "font-Amiri" : "font-Poppins"} antialiased min-h-screen bg-gray-50`}
      >
        <Toaster />
        <AuthCleanup />
        {children}
      </body>
    </html>
  );
}