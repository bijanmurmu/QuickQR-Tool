import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuickQR - Instant QR Code Generator",
  description:
    "Generate beautiful QR codes for Wi-Fi, URLs, contacts, and more. Fast, simple, and works on all devices.",
  keywords: ["QR code", "generator", "Wi-Fi", "URL", "contact", "email", "instant", "free"],
  authors: [{ name: "QuickQR Team" }],
  creator: "QuickQR",
  publisher: "QuickQR",
  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "QuickQR - Instant QR Code Generator",
    description:
      "Generate beautiful QR codes for Wi-Fi, URLs, contacts, and more. Fast, simple, and works on all devices.",
    url: "https://quickqr.app",
    siteName: "QuickQR",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickQR - Instant QR Code Generator",
    description:
      "Generate beautiful QR codes for Wi-Fi, URLs, contacts, and more. Fast, simple, and works on all devices.",
    creator: "@quickqr",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
