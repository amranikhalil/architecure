"use client"
import { useState } from "react"
import { Download, FileText, Lightbulb, ThermometerSun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageGenerator } from "./image-generator"

interface RecommendationDisplayProps {
  projectType: string
  spaceType: string
  simulationObjective: string
  onStartOver: () => void
}

export function RecommendationDisplay({
  projectType,
  spaceType,
  simulationObjective,
  onStartOver,
}: RecommendationDisplayProps) {
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  // Simulation de recommandations basées sur les entrées de l'utilisateur
  const getRecommendations = () => {
    // Recommandations pour le confort
    if (simulationObjective === "comfort") {
      return {
        title: "Recommandations pour améliorer le confort",
        summary: "Votre espace présente des opportunités d'amélioration du confort thermique et acoustique.",
        recommendations: [
          {
            title: "Isolation acoustique",
            description: "Ajoutez des panneaux acoustiques sur les murs pour réduire la réverbération du son.",
            impact: "Élevé",
            icon: <ThermometerSun className="h-5 w-5" />,
            visualizationPrompt: `Panneaux acoustiques décoratifs installés sur les murs d'une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
          {
            title: "Ventilation naturelle",
            description: "Optimisez la disposition des fenêtres pour créer une ventilation croisée.",
            impact: "Moyen",
            icon: <ThermometerSun className="h-5 w-5" />,
            visualizationPrompt: `Fenêtres optimisées pour la ventilation croisée dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
          {
            title: "Matériaux à forte inertie thermique",
            description: "Utilisez des matériaux à forte inertie thermique pour stabiliser la température intérieure.",
            impact: "Élevé",
            icon: <ThermometerSun className="h-5 w-5" />,
            visualizationPrompt: `Matériaux à forte inertie thermique dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
        ],
      }
    }

    // Other recommendation types remain the same...
    // (keeping the existing code for other recommendation types)

    // Recommandations pour l'énergie
    if (simulationObjective === "energy") {
      return {
        title: "Recommandations pour optimiser l'énergie",
        summary: "Votre projet présente plusieurs opportunités d'amélioration de l'efficacité énergétique.",
        recommendations: [
          {
            title: "Double vitrage à faible émissivité",
            description: "Remplacez les fenêtres existantes par du double vitrage à faible émissivité.",
            impact: "Élevé",
            icon: <ThermometerSun className="h-5 w-5" />,
            visualizationPrompt: `Fenêtres à double vitrage à faible émissivité dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
          {
            title: "Isolation des murs",
            description: "Renforcez l'isolation des murs extérieurs avec des matériaux à haute performance.",
            impact: "Élevé",
            icon: <ThermometerSun className="h-5 w-5" />,
            visualizationPrompt: `Installation d'isolation haute performance sur les murs d'une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
          {
            title: "Éclairage LED",
            description: "Remplacez tous les systèmes d'éclairage par des LED à haute efficacité énergétique.",
            impact: "Moyen",
            icon: <Lightbulb className="h-5 w-5" />,
            visualizationPrompt: `Éclairage LED à haute efficacité énergétique dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
        ],
      }
    }

    // Recommandations pour l'éclairage
    if (simulationObjective === "lighting") {
      return {
        title: "Recommandations pour améliorer l'éclairage",
        summary: "Votre espace peut bénéficier de plusieurs améliorations en termes d'éclairage naturel et artificiel.",
        recommendations: [
          {
            title: "Puits de lumière",
            description: "Installez des puits de lumière pour augmenter l'apport de lumière naturelle.",
            impact: "Élevé",
            icon: <Lightbulb className="h-5 w-5" />,
            visualizationPrompt: `Puits de lumière installés dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
          {
            title: "Surfaces réfléchissantes",
            description:
              "Utilisez des surfaces réfléchissantes pour diffuser la lumière naturelle plus profondément dans l'espace.",
            impact: "Moyen",
            icon: <Lightbulb className="h-5 w-5" />,
            visualizationPrompt: `Surfaces réfléchissantes pour diffuser la lumière naturelle dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
          {
            title: "Éclairage indirect",
            description:
              "Intégrez un système d'éclairage indirect pour réduire l'éblouissement et créer une ambiance plus agréable.",
            impact: "Moyen",
            icon: <Lightbulb className="h-5 w-5" />,
            visualizationPrompt: `Système d'éclairage indirect dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
        ],
      }
    }

    // Recommandations pour l'ergonomie
    if (simulationObjective === "ergonomics") {
      return {
        title: "Recommandations pour améliorer l'ergonomie",
        summary: "Votre espace peut être optimisé pour une meilleure ergonomie et fonctionnalité.",
        recommendations: [
          {
            title: "Circulation optimisée",
            description:
              "Réorganisez les zones de circulation pour faciliter les déplacements et réduire les obstacles.",
            impact: "Élevé",
            icon: <FileText className="h-5 w-5" />,
            visualizationPrompt: `Zones de circulation optimisées dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
          {
            title: "Zones fonctionnelles",
            description: "Définissez clairement les zones fonctionnelles pour améliorer l'efficacité de l'espace.",
            impact: "Élevé",
            icon: <FileText className="h-5 w-5" />,
            visualizationPrompt: `Zones fonctionnelles clairement définies dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
          {
            title: "Mobilier adaptable",
            description: "Intégrez du mobilier adaptable qui peut être reconfiguré selon les besoins.",
            impact: "Moyen",
            icon: <FileText className="h-5 w-5" />,
            visualizationPrompt: `Mobilier adaptable et reconfigurable dans une ${
              spaceType === "classroom"
                ? "salle de classe"
                : spaceType === "studio"
                  ? "studio"
                  : spaceType === "laboratory"
                    ? "laboratoire"
                    : spaceType === "office"
                      ? "bureau"
                      : "pièce"
            }, style architectural, rendu photoréaliste`,
          },
        ],
      }
    }

    // Recommandations par défaut
    return {
      title: "Recommandations générales",
      summary: "Voici quelques recommandations générales pour améliorer votre projet.",
      recommendations: [
        {
          title: "Matériaux durables",
          description: "Utilisez des matériaux durables et écologiques pour réduire l'impact environnemental.",
          impact: "Élevé",
          icon: <FileText className="h-5 w-5" />,
          visualizationPrompt: `Matériaux durables et écologiques dans une ${
            spaceType === "classroom"
              ? "salle de classe"
              : spaceType === "studio"
                ? "studio"
                : spaceType === "laboratory"
                  ? "laboratoire"
                  : spaceType === "office"
                    ? "bureau"
                    : "pièce"
          }, style architectural, rendu photoréaliste`,
        },
        {
          title: "Flexibilité des espaces",
          description: "Concevez des espaces flexibles qui peuvent s'adapter à différentes utilisations.",
          impact: "Moyen",
          icon: <FileText className="h-5 w-5" />,
          visualizationPrompt: `Espace flexible et adaptable à différentes utilisations dans une ${
            spaceType === "classroom"
              ? "salle de classe"
              : spaceType === "studio"
                ? "studio"
                : spaceType === "laboratory"
                  ? "laboratoire"
                  : spaceType === "office"
                    ? "bureau"
                    : "pièce"
          }, style architectural, rendu photoréaliste`,
        },
        {
          title: "Intégration de la nature",
          description: "Intégrez des éléments naturels pour améliorer le bien-être des occupants.",
          impact: "Moyen",
          icon: <ThermometerSun className="h-5 w-5" />,
          visualizationPrompt: `Éléments naturels intégrés dans une ${
            spaceType === "classroom"
              ? "salle de classe"
              : spaceType === "studio"
                ? "studio"
                : spaceType === "laboratory"
                  ? "laboratoire"
                  : spaceType === "office"
                    ? "bureau"
                    : "pièce"
          }, style architectural, rendu photoréaliste`,
        },
      ],
    }
  }

  const recommendations = getRecommendations()

  const handleDownloadPDF = () => {
    // Simulation de téléchargement de PDF
    alert("Téléchargement du rapport PDF (fonctionnalité simulée)")
  }

  const handleImageGenerated = (imageBase64: string) => {
    setGeneratedImages([...generatedImages, imageBase64])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{recommendations.title}</CardTitle>
          <CardDescription>
            Basé sur votre{" "}
            {spaceType === "classroom"
              ? "salle de classe"
              : spaceType === "studio"
                ? "studio"
                : spaceType === "laboratory"
                  ? "laboratoire"
                  : spaceType === "office"
                    ? "bureau"
                    : "espace"}{" "}
            dans un projet{" "}
            {projectType === "residential"
              ? "résidentiel"
              : projectType === "commercial"
                ? "commercial"
                : projectType === "educational"
                  ? "éducatif"
                  : projectType === "industrial"
                    ? "industriel"
                    : "autre"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="font-medium">{recommendations.summary}</p>
          </div>

          <Tabs defaultValue="recommendations">
            <TabsList className="mb-4">
              <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
              <TabsTrigger value="materials">Matériaux suggérés</TabsTrigger>
              <TabsTrigger value="resources">Ressources</TabsTrigger>
              <TabsTrigger value="visualizations">Visualisations</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">{rec.icon}</div>
                  <div>
                    <h3 className="font-medium">{rec.title}</h3>
                    <p className="text-muted-foreground">{rec.description}</p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          rec.impact === "Élevé"
                            ? "bg-green-100 text-green-800"
                            : rec.impact === "Moyen"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        Impact: {rec.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Panneaux acoustiques en fibre de bois</h3>
                  <p className="text-muted-foreground">
                    Excellente absorption acoustique et faible impact environnemental
                  </p>
                  <p className="text-sm mt-2">Coût estimé: €€</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Verre à contrôle solaire</h3>
                  <p className="text-muted-foreground">
                    Réduit les gains de chaleur tout en maximisant la lumière naturelle
                  </p>
                  <p className="text-sm mt-2">Coût estimé: €€€</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Isolant en laine de chanvre</h3>
                  <p className="text-muted-foreground">Excellent isolant thermique et acoustique d'origine naturelle</p>
                  <p className="text-sm mt-2">Coût estimé: €€</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Peinture réfléchissante</h3>
                  <p className="text-muted-foreground">
                    Augmente la luminosité des espaces en réfléchissant la lumière
                  </p>
                  <p className="text-sm mt-2">Coût estimé: €</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Guide d'optimisation acoustique</h3>
                  <p className="text-muted-foreground">
                    Un guide complet sur l'amélioration de l'acoustique dans les espaces éducatifs
                  </p>
                  <Button variant="link" className="px-0">
                    Télécharger le guide
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Calculateur d'efficacité énergétique</h3>
                  <p className="text-muted-foreground">
                    Outil en ligne pour estimer les économies d'énergie potentielles
                  </p>
                  <Button variant="link" className="px-0">
                    Accéder à l'outil
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">Bibliothèque de matériaux durables</h3>
                  <p className="text-muted-foreground">
                    Une collection de matériaux durables avec leurs caractéristiques et applications
                  </p>
                  <Button variant="link" className="px-0">
                    Explorer la bibliothèque
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualizations" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Générer une visualisation</h3>
                <p className="text-muted-foreground mb-4">
                  Utilisez l'IA pour générer une visualisation de vos recommandations
                </p>

                <div className="border rounded-lg p-4">
                  <ImageGenerator
                    initialPrompt={recommendations.recommendations[0]?.visualizationPrompt || ""}
                    onImageGenerated={handleImageGenerated}
                  />
                </div>
              </div>

              {generatedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Visualisations générées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedImages.map((imgBase64, index) => (
                      <Card key={index}>
                        <CardContent className="p-2">
                          <img
                            src={`data:image/png;base64,${imgBase64}`}
                            alt={`Generated visualization ${index + 1}`}
                            className="w-full h-auto rounded-md"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onStartOver}>
            Nouvelle simulation
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger le rapport PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
