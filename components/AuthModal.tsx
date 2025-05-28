"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else onClose()
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-400" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-4">{isLogin ? "Connexion" : "Créer un compte"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-copper text-white py-2 rounded font-semibold hover:bg-copper-dark transition"
            disabled={loading}
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer un compte"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {isLogin ? (
            <>
              Pas de compte ?{" "}
              <button className="text-copper underline" onClick={() => setIsLogin(false)}>
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà inscrit ?{" "}
              <button className="text-copper underline" onClick={() => setIsLogin(true)}>
                Se connecter
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 