"use client"

import type React from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"
import { useState } from "react"
import dynamic from "next/dynamic"
const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false })

export default function ClientLayout({
  children,
  inter,
}: {
  children: React.ReactNode
  inter: any
}) {
  const [showAuth, setShowAuth] = useState(false)
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            {/* Universal Navigation Bar */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 bg-white shadow-lg border-b">
              <div className="flex items-center gap-2 font-bold text-copper text-xl">
                <span className="inline-block w-7 h-7 bg-copper/10 rounded-md mr-2" />
                Lumia
              </div>
              <div className="hidden md:flex gap-8 text-copper font-medium">
                <Link href="/" className="hover:text-copper-dark transition">Accueil</Link>
                <Link href="/espace-etudiant" className="hover:text-copper-dark transition">Espace Etudiant</Link>
                <Link href="/espace-client" className="hover:text-copper-dark transition">Espace Client</Link>
                <Link href="#" className="hover:text-copper-dark transition">Espace Architecte</Link>
              </div>
              <button
                onClick={() => setShowAuth(true)}
                className="px-5 py-2 rounded-full bg-copper text-white font-semibold shadow hover:bg-copper-dark transition border border-copper/30"
              >
                Se connecter
              </button>
            </nav>
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  © 2025 Simulation et Recommandations. Tous droits réservés.
                </p>
                <div className="flex items-center gap-4">
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Conditions d'utilisation
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Politique de confidentialité
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Contact
                  </Link>
                </div>
              </div>
            </footer>
            {/* Custom styles for copper color */}
            <style jsx global>{`
              .text-copper { color: #B87333; }
              .bg-copper { background-color: #B87333; }
              .hover\:bg-copper-dark:hover { background-color: #8B5C2A !important; }
              .border-copper { border-color: #B87333; }
            `}</style>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
