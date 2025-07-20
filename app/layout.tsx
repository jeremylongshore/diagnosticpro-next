import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DiagnosticPro | Expert Equipment Analysis & Quote Verification",
  description: "Get expert analysis of automotive, marine, and equipment repairs before you pay. Protect yourself from unnecessary repairs with professional diagnostic services starting at $14.99.",
  keywords: ["automotive diagnostic", "repair verification", "equipment analysis", "mechanic quote verification", "diagnostic service"],
  authors: [{ name: "DiagnosticPro" }],
  robots: "index, follow",
  openGraph: {
    title: "DiagnosticPro | Expert Equipment Analysis",
    description: "Professional diagnostic analysis to protect you from unnecessary repairs",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900 selection:bg-primary-100 selection:text-primary-900`}
      >
        {children}
      </body>
    </html>
  );
}
