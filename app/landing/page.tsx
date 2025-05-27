"use client"
import Link from "next/link"
import { ArrowRight, BookOpen, Home, Search } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-200 via-[#e7c9b2] to-[#b87333] flex flex-col">
      {/* Universal Header */}
      {/* <nav className="relative z-10 flex items-center justify-between px-8 py-6 bg-white shadow-lg border-b">
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
        <Link href="#" className="px-5 py-2 rounded-full bg-copper text-white font-semibold shadow hover:bg-copper-dark transition border border-copper/30">Se connecter</Link>
      </nav> */}

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <header className="mb-10 text-center mt-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-copper text-balance">
            Simulation et Recommandations
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 font-light max-w-2xl mx-auto text-balance">
            Optimisez vos espaces avec nos outils de simulation et nos recommandations personnalisées
          </p>
        </header>

        <div className="relative mb-10 max-w-xl w-full mx-auto">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-copper transition-colors duration-200 group-focus-within:text-copper-dark" />
          <input placeholder="Rechercher des recommandations, matériaux, solutions..." className="pl-10 w-full rounded-full shadow focus-visible:ring-2 focus-visible:ring-copper/40 transition bg-white text-gray-800 placeholder:text-gray-400 border border-copper/20 py-3" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-14 w-full max-w-4xl">
          <div className="flex flex-col h-full rounded-2xl shadow-xl border border-copper/10 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-copper/80" />
            <div className="p-6 pb-0">
              <div className="flex items-center gap-2 text-lg sm:text-xl text-copper font-semibold">
                <BookOpen className="h-6 w-6 text-copper-dark" />
                Espace Étudiant
              </div>
              <div className="font-medium text-gray-500 mt-2">
                Importez vos plans architecturaux et recevez des recommandations pour améliorer le confort et la performance
              </div>
            </div>
            <div className="flex-grow p-6 pt-2">
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-copper/10 p-1 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-copper-dark" />
                  </div>
                  <span className="text-gray-700">Importez vos plans architecturaux</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-copper/10 p-1 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-copper-dark" />
                  </div>
                  <span className="text-gray-700">Décrivez votre projet et vos objectifs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-copper/10 p-1 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-copper-dark" />
                  </div>
                  <span className="text-gray-700">Obtenez des analyses et des recommandations</span>
                </li>
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Link href="/espace-etudiant" className="w-full block">
                <button className="w-full rounded-full font-semibold text-base py-2 transition-transform hover:scale-105 bg-copper text-white shadow-md border-0 hover:bg-copper-dark">
                  Accéder à l'Espace Étudiant
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col h-full rounded-2xl shadow-xl border border-copper/10 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-copper/60" />
            <div className="p-6 pb-0">
              <div className="flex items-center gap-2 text-lg sm:text-xl text-copper font-semibold">
                <Home className="h-6 w-6 text-copper-dark" />
                Espace Client
              </div>
              <div className="font-medium text-gray-500 mt-2">
                Partagez des photos de votre espace et recevez des suggestions d'amélioration adaptées à vos besoins
              </div>
            </div>
            <div className="flex-grow p-6 pt-2">
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-copper/10 p-1 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-copper-dark" />
                  </div>
                  <span className="text-gray-700">Importez des photos de votre espace</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-copper/10 p-1 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-copper-dark" />
                  </div>
                  <span className="text-gray-700">Décrivez les problèmes et vos objectifs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-copper/10 p-1 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-copper-dark" />
                  </div>
                  <span className="text-gray-700">Recevez des recommandations personnalisées</span>
                </li>
              </ul>
            </div>
            <div className="p-6 pt-0">
              <Link href="/espace-client" className="w-full block">
                <button className="w-full rounded-full font-semibold text-base py-2 transition-transform hover:scale-105 bg-copper text-white shadow-md border-0 hover:bg-copper-dark">
                  Accéder à l'Espace Client
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-inner border border-copper/10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 tracking-tight text-copper">Dernières mises à jour</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-copper/10 p-2">
                <ArrowRight className="h-4 w-4 text-copper-dark" />
              </div>
              <div>
                <h3 className="font-medium text-copper-dark">Nouveaux matériaux écologiques</h3>
                <p className="text-gray-600 text-sm">
                  Notre base de données s'est enrichie de 20 nouveaux matériaux écologiques.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-copper/10 p-2">
                <ArrowRight className="h-4 w-4 text-copper-dark" />
              </div>
              <div>
                <h3 className="font-medium text-copper-dark">Amélioration des recommandations</h3>
                <p className="text-gray-600 text-sm">
                  Notre système de recommandations a été amélioré pour plus de précision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Custom styles for copper color */}
      <style jsx global>{`
        .text-copper { color: #B87333; }
        .bg-copper { background-color: #B87333; }
        .hover\:bg-copper-dark:hover { background-color: #8B5C2A !important; }
        .border-copper { border-color: #B87333; }
      `}</style>
    </div>
  )
}
