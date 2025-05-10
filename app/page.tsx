import Link from "next/link"
import { ArrowRight, BookOpen, Home, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Simulation et Recommandations</h1>
        <p className="text-xl text-muted-foreground">
          Optimisez vos espaces avec nos outils de simulation et nos recommandations personnalisées
        </p>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Rechercher des recommandations, matériaux, solutions..." className="pl-10 w-full" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Espace Étudiant
            </CardTitle>
            <CardDescription>
              Importez vos plans architecturaux et recevez des recommandations pour améliorer le confort et la
              performance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
                <span>Importez vos plans architecturaux</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
                <span>Décrivez votre projet et vos objectifs</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
                <span>Obtenez des analyses et des recommandations</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/espace-etudiant" className="w-full">
              <Button className="w-full">Accéder à l'Espace Étudiant</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              Espace Client
            </CardTitle>
            <CardDescription>
              Partagez des photos de votre espace et recevez des suggestions d'amélioration adaptées à vos besoins
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
                <span>Importez des photos de votre espace</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
                <span>Décrivez les problèmes et vos objectifs</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
                <span>Recevez des recommandations personnalisées</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/espace-client" className="w-full">
              <Button className="w-full">Accéder à l'Espace Client</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Dernières mises à jour</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Nouveaux matériaux écologiques</h3>
              <p className="text-muted-foreground">
                Notre base de données s'est enrichie de 20 nouveaux matériaux écologiques.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Amélioration des recommandations</h3>
              <p className="text-muted-foreground">
                Notre système de recommandations a été amélioré pour plus de précision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
