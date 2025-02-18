import type { Metadata } from "next";
import { Urbanist } from "next/font/google";

import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "900"]
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Zovo",
  description:
    "Admin Dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "shadcn/ui sidebar",
    description:
      "Admin Dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "shadcn/ui sidebar",
    description:
      "Admin Dashboard built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${urbanist.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
