import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
