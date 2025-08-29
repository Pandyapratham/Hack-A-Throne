import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Roboto, Roboto_Mono } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from '../contexts/AuthContext';
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-roboto-mono",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
      <body className={`min-h-screen bg-background text-foreground font-sans`}>
      <AuthProvider> <Suspense fallback={null}>{children}</Suspense></AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
