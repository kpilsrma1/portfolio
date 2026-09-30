import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { StructuredData } from "@/components/structured-data";
import { absoluteUrl, siteConfig, siteUrl } from "@/config/site";
import { hasResumeFile } from "@/lib/resume";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} · ${siteConfig.professionalTitle}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.shortDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.fullName, url: siteUrl }],
  creator: siteConfig.fullName,
  keywords: [
    "Kapil Sharma",
    "full-stack developer",
    ".NET developer",
    "ASP.NET Core",
    "React",
    "TypeScript",
    "SQL Server",
    "software developer portfolio",
  ],
  alternates: {
    canonical: siteUrl,
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} · ${siteConfig.professionalTitle}`,
    description: siteConfig.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · ${siteConfig.professionalTitle}`,
    description: siteConfig.shortDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const hasResume = hasResumeFile();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-foreground"
          >
            Skip to main content
          </a>
          <SiteHeader hasResume={hasResume} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter hasResume={hasResume} />
        </ThemeProvider>
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}
