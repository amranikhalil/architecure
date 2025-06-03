"use client"

import { useAuth } from "@/lib/authContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { ReactNode } from "react"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If authentication is still loading, do nothing
    if (isLoading) return

    // If user is not authenticated and not on the homepage, redirect to homepage
    if (!user && pathname !== "/") {
      router.push("/")
    }
  }, [user, isLoading, router, pathname])

  // While loading, show a simple loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  // If on a protected route and not authenticated, don't render children
  if (!user && pathname !== "/") {
    return null
  }

  // Otherwise, render the children
  return <>{children}</>
}
