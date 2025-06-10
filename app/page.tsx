"use client"

import Link from "next/link"
import architecture from '../../public/architecture.jpg'

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src='architecture.jpg'
          alt="Architecture background"
          className="object-cover w-full h-full"
        />
        
        {/* Dégradé noir - commence à 60% de la hauteur et va jusqu'en bas */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[150vh] z-10"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 25%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)'
          }}
        />
      </div>

      {/* Navigation Bar */}
      {/* <nav className="relative z-20 flex items-center justify-between px-8 py-6 bg-black/20 backdrop-blur-md mx-4 mt-4 rounded-full shadow-lg">
        <div className="flex items-center gap-2 font-bold text-white text-xl">
          <div className="flex gap-1">
            <div className="w-1 h-6 bg-white rounded-full"></div>
            <div className="w-1 h-6 bg-white rounded-full"></div>
            <div className="w-1 h-6 bg-white rounded-full"></div>
            <div className="w-1 h-6 bg-white rounded-full"></div>
          </div>
          <span className="ml-2">Lumia</span>
        </div>
        <div className="hidden md:flex gap-8 text-white/90 font-medium">
          <Link href="/" className="hover:text-copper transition">Accueil</Link>
          <Link href="/espace-etudiant" className="hover:text-copper transition">Espace Etudiant</Link>
          <Link href="/espace-client" className="hover:text-copper transition">Espace Client</Link>
          <Link href="#" className="hover:text-copper transition">Espace Architecte</Link>
        </div>
        <Link href="#" className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 text-white font-semibold shadow hover:bg-white/30 transition border border-white/30 backdrop-blur">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Se connecter
        </Link>
      </nav> */}

      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-start justify-center flex-1 px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl">
          {/* <div className="text-copper font-medium text-lg mb-4 tracking-wide">L'avenir de l'architecture commence ici</div> */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-12 leading-tight">
            Votre Outil d'architecture IA
          </h1>
        </div>
      </main>

      {/* Bottom Section */}
      <div className="relative z-20 flex flex-col items-center text-center px-8 pb-16">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-copper bg-copper/20 text-white font-medium mb-8 backdrop-blur">
          <span className="w-3 h-3 rounded-full bg-copper" />
          Découvrez notre solution
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 max-w-3xl leading-tight">
          Tester les imperfections de vos architectures
        </h2>
        
        <Link 
          href="/landing" 
          className="px-8 py-4 rounded-lg bg-copper text-white font-bold text-lg shadow-lg hover:bg-copper-dark transition-all duration-300 hover:shadow-xl"
        >
          Essayez Lumia
        </Link>
      </div>

      {/* Custom styles for copper color */}
      <style jsx global>{`
        .text-copper { color: #B87333; }
        .bg-copper { background-color: #B87333; }
        .bg-copper\/20 { background-color: rgba(184, 115, 51, 0.2); }
        .hover\:bg-copper-dark:hover { background-color: #8B5C2A; }
        .border-copper { border-color: #B87333; }
      `}</style>
    </div>
  )
}