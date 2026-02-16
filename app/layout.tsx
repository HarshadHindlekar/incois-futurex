import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientIntlProvider } from "@/components/i18n/ClientIntlProvider";
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
  title: "INCOIS Marine Fisheries Platform",
  description:
    "Real-time ocean observations, Potential Fishing Zone advisories, and marine weather alerts for India's fishing community",
  keywords: [
    "INCOIS",
    "PFZ",
    "Potential Fishing Zone",
    "Marine Fisheries",
    "Ocean Data",
    "Sea Surface Temperature",
    "Fishing Advisory",
    "India",
  ],
  authors: [{ name: "INCOIS" }],
  openGraph: {
    title: "INCOIS Marine Fisheries Platform",
    description: "Real-time ocean observations and fishing advisories",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientIntlProvider>{children}</ClientIntlProvider>
      </body>
    </html>
  );
}
