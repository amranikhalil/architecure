"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
// import { supabase } from './supabaseClient' // Disabled for bypass
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  updateProfile: (name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data for bypass
const MOCK_USER: User = {
  id: 'mock-user-id',
  app_metadata: {},
  user_metadata: { name: 'Utilisateur Invité' },
  aud: 'authenticated',
  created_at: new Date().toISOString()
} as User

const MOCK_SESSION: Session = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: MOCK_USER
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always set a user and session to bypass auth
  const [user, setUser] = useState<User | null>(MOCK_USER)
  const [session, setSession] = useState<Session | null>(MOCK_SESSION)
  const [isLoading, setIsLoading] = useState(false) // Not loading
  const router = useRouter()

  useEffect(() => {
    // No real auth check needed
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock successful sign in
    return { error: null }
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Mock successful sign up
    return { error: null }
  }

  const updateProfile = async (name: string) => {
    // Mock successful update
    return { error: null }
  }

  const signOut = async () => {
    // Mock sign out - functionally does nothing in bypass mode, 
    // or we could redirect to home but keep user logged in.
    // For "bypass", we generally want them to Stay logged in, 
    // but if the user explicitly clicks logout, maybe we should just alert them?
    // Or just do nothing and redirect.
    router.push('/')
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
