"use client"

import Link from "next/link"
import architecture from '../../public/architecture.jpg'
export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src='/architecture.jpg' // <-- Replace with the correct path to your image
          alt="Architecture background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Navigation Bar */}
      {/* <nav className="relative z-10 flex items-center justify-between px-8 py-6 bg-white/20 backdrop-blur-md rounded-b-2xl mx-4 mt-4 shadow-lg">
        <div className="flex items-center gap-2 font-bold text-white text-xl">
          <span className="inline-block w-7 h-7 bg-white/80 rounded-md mr-2" />
          Lumia
        </div>
        <div className="hidden md:flex gap-8 text-white/90 font-medium">
          <Link href="/" className="hover:text-copper transition">Accueil</Link>
          <Link href="espace-etudiant" className="hover:text-copper transition">Espace Etudiant</Link>
          <Link href="espace-client" className="hover:text-copper transition">Espace Client</Link>
          <Link href="#" className="hover:text-copper transition">Espace Architecte</Link>
        </div>
        <Link href="#" className="px-5 py-2 rounded-full bg-white/30 text-white font-semibold shadow hover:bg-copper/80 transition border border-white/40 backdrop-blur">Se connecter</Link>
      </nav> */}

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-4">
        <div className="mt-24 mb-10">
          <div className="text-copper font-semibold text-lg mb-2 tracking-wide">L'avenir de l'architecture commence ici</div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg mb-4 leading-tight">Votre Outil d'architecture IA</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-copper bg-white/10 text-white font-medium mb-2 sm:mb-0">
              <span className="w-3 h-3 rounded-full bg-copper mr-2" />
              Découvrez notre solution
            </span>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">Tester les imperfections de vos architectures</h2>
            <Link href="/landing" className="inline-block px-8 py-3 rounded-lg bg-copper text-white font-bold text-lg shadow-lg hover:bg-copper-dark transition">Essayez Lumia</Link>
          </div>
        </div>
      </main>

      {/* Custom styles for copper color */}
      <style jsx global>{`
        .text-copper { color: #B87333; }
        .bg-copper { background-color: #B87333; }
        .hover\:bg-copper-dark:hover { background-color: #8B5C2A; }
        .border-copper { border-color: #B87333; }
      `}</style>
    </div>
  )
} 