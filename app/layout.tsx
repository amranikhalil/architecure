import type React from "react"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Simulation et Recommandations",
  description: "Application web de simulation et de recommandations pour l'architecture et le design d'intérieur",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout children={children} inter={inter} />
}


import './globals.css'