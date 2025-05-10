import Link from "next/link"
import { ArrowLeft, BookOpen, Download, FileText, Lightbulb, ThermometerSun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RessourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl font-bold">Ressources</h1>
        <p className="text-muted-foreground mt-2">
          Explorez notre bibliothèque de ressources pour approfondir vos connaissances
        </p>
      </div>

      <Tabs defaultValue="guides">
        <TabsList className="mb-6">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="materials">Matériaux</TabsTrigger>
          <TabsTrigger value="case-studies">Études de cas</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-2 w-fit mb-2">
                  <ThermometerSun className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Guide du confort thermique</CardTitle>
                <CardDescription>
                  Principes fondamentaux pour optimiser le confort thermique dans les espaces intérieurs
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Comprendre les facteurs du confort thermique</li>
                  <li>• Stratégies passives pour la régulation thermique</li>
                  <li>• Matériaux et technologies pour l'isolation</li>
                  <li>• Études de cas et exemples pratiques</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le guide
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-2 w-fit mb-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Optimisation de l'éclairage naturel</CardTitle>
                <CardDescription>
                  Techniques et stratégies pour maximiser l'utilisation de la lumière naturelle
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Principes de conception pour l'éclairage naturel</li>
                  <li>• Systèmes de redirection de la lumière</li>
                  <li>• Intégration avec l'éclairage artificiel</li>
                  <li>• Calculs et simulations d'éclairage</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le guide
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-2 w-fit mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Acoustique architecturale</CardTitle>
                <CardDescription>
                  Guide complet sur l'amélioration de l'acoustique dans différents types d'espaces
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Principes fondamentaux de l'acoustique</li>
                  <li>• Matériaux et solutions d'absorption acoustique</li>
                  <li>• Conception pour différents types d'espaces</li>
                  <li>• Mesures et évaluations acoustiques</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le guide
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-2 w-fit mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Ergonomie des espaces d'apprentissage</CardTitle>
                <CardDescription>Principes d'ergonomie appliqués aux environnements éducatifs</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Conception centrée sur l'utilisateur</li>
                  <li>• Mobilier ergonomique pour l'apprentissage</li>
                  <li>• Organisation spatiale optimale</li>
                  <li>• Accessibilité et inclusion</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le guide
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Matériaux isolants écologiques</CardTitle>
                <CardDescription>Comparaison des performances et caractéristiques</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Laine de chanvre</h3>
                    <p className="text-sm text-muted-foreground">Conductivité thermique: 0.040 W/mK</p>
                    <p className="text-sm text-muted-foreground">Absorption acoustique: Excellente</p>
                    <p className="text-sm text-muted-foreground">Impact environnemental: Très faible</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Fibre de bois</h3>
                    <p className="text-sm text-muted-foreground">Conductivité thermique: 0.038-0.050 W/mK</p>
                    <p className="text-sm text-muted-foreground">Absorption acoustique: Très bonne</p>
                    <p className="text-sm text-muted-foreground">Impact environnemental: Faible</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Liège expansé</h3>
                    <p className="text-sm text-muted-foreground">Conductivité thermique: 0.040-0.045 W/mK</p>
                    <p className="text-sm text-muted-foreground">Absorption acoustique: Bonne</p>
                    <p className="text-sm text-muted-foreground">Impact environnemental: Très faible</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir la fiche complète
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Matériaux pour le confort acoustique</CardTitle>
                <CardDescription>Solutions pour réduire la réverbération et le bruit</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Panneaux acoustiques en laine minérale</h3>
                    <p className="text-sm text-muted-foreground">Coefficient d'absorption: 0.90-0.95</p>
                    <p className="text-sm text-muted-foreground">Applications: Murs et plafonds</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Mousse acoustique à cellules ouvertes</h3>
                    <p className="text-sm text-muted-foreground">Coefficient d'absorption: 0.70-0.90</p>
                    <p className="text-sm text-muted-foreground">Applications: Traitement ponctuel</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Baffles acoustiques suspendus</h3>
                    <p className="text-sm text-muted-foreground">Coefficient d'absorption: 0.85-0.95</p>
                    <p className="text-sm text-muted-foreground">Applications: Grands volumes</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir la fiche complète
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Matériaux pour l'optimisation lumineuse</CardTitle>
                <CardDescription>Solutions pour maximiser et contrôler la lumière</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Verre à contrôle solaire</h3>
                    <p className="text-sm text-muted-foreground">Transmission lumineuse: 40-70%</p>
                    <p className="text-sm text-muted-foreground">Facteur solaire: 0.25-0.40</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Films réfléchissants</h3>
                    <p className="text-sm text-muted-foreground">Transmission lumineuse: 15-60%</p>
                    <p className="text-sm text-muted-foreground">Réduction de chaleur: 45-80%</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h3 className="font-medium">Peintures à haute réflectance</h3>
                    <p className="text-sm text-muted-foreground">Réflectance: 85-95%</p>
                    <p className="text-sm text-muted-foreground">Applications: Murs et plafonds</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir la fiche complète
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Rénovation d'une salle de classe</CardTitle>
                <CardDescription>Amélioration du confort et des performances énergétiques</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="aspect-video bg-muted flex items-center justify-center mb-4">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    Cette étude de cas présente la rénovation complète d'une salle de classe dans une école construite
                    dans les années 1970, avec des problèmes d'inconfort thermique et acoustique.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget: 45 000€</span>
                    <span className="text-muted-foreground">Surface: 65m²</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Lire l'étude de cas
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Optimisation d'un open space</CardTitle>
                <CardDescription>Amélioration de l'acoustique et de l'ergonomie</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="aspect-video bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    Cette étude présente la transformation d'un open space bruyant et peu fonctionnel en un
                    environnement de travail confortable et productif grâce à des solutions acoustiques et ergonomiques.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget: 75 000€</span>
                    <span className="text-muted-foreground">Surface: 120m²</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Lire l'étude de cas
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Réaménagement d'un studio d'art</CardTitle>
                <CardDescription>Optimisation de l'éclairage naturel et artificiel</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="aspect-video bg-muted flex items-center justify-center mb-4">
                  <Lightbulb className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    Cette étude de cas détaille la transformation d'un ancien atelier en studio d'art avec un accent
                    particulier sur l'optimisation de l'éclairage naturel et la mise en place d'un système d'éclairage
                    artificiel adapté.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget: 35 000€</span>
                    <span className="text-muted-foreground">Surface: 80m²</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Lire l'étude de cas
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Rénovation énergétique d'un laboratoire</CardTitle>
                <CardDescription>Amélioration de l'efficacité énergétique et du confort</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="aspect-video bg-muted flex items-center justify-center mb-4">
                  <ThermometerSun className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    Cette étude présente la rénovation complète d'un laboratoire universitaire avec un focus sur
                    l'efficacité énergétique, la qualité de l'air et le confort des utilisateurs.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget: 120 000€</span>
                    <span className="text-muted-foreground">Surface: 150m²</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Lire l'étude de cas
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
