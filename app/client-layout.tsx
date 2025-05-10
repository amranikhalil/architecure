"use client"

import type React from "react"
import Link from "next/link"
import { Bell, Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

import "./globals.css"

export default function ClientLayout({
  children,
  inter,
}: {
  children: React.ReactNode
  inter: any
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background">
              <div className="container flex h-16 items-center">
                <MainNav />
                <div className="flex flex-1 items-center justify-end space-x-4">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </div>
              </div>
            </header>
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
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

function MainNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold">SimRec</span>
      </Link>
      <nav
        className={cn(
          "hidden md:flex md:items-center md:space-x-4 lg:space-x-6",
          isOpen
            ? "absolute inset-x-0 top-16 z-50 mt-px bg-background p-4 shadow-lg md:static md:bg-transparent md:shadow-none"
            : "hidden",
        )}
      >
        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
          Accueil
        </Link>
        <Link href="/espace-etudiant" className="text-sm font-medium transition-colors hover:text-primary">
          Espace Étudiant
        </Link>
        <Link href="/espace-client" className="text-sm font-medium transition-colors hover:text-primary">
          Espace Client
        </Link>
        <Link href="/ressources" className="text-sm font-medium transition-colors hover:text-primary">
          Ressources
        </Link>
      </nav>
    </div>
  )
}
