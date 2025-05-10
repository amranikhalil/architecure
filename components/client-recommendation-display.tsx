"use client"
import { useState } from "react"
import { Download, FileText, Lightbulb, ThermometerSun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageGenerator } from "./image-generator"

interface ClientRecommendationDisplayProps {
  problems: string
  improvements: string
  budget: string
  onStartOver: () => void
}

export function ClientRecommendationDisplay({
  problems,
  improvements,
  budget,
  onStartOver,
}: ClientRecommendationDisplayProps) {
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  // Simulation de recommandations basées sur les entrées de l'utilisateur
  const getRecommendations = () => {
    // Generate visualization prompts based on the problems and improvements
    const generatePrompt = (title: string) => {
      const spaceType = problems.toLowerCase().includes("salon")
        ? "salon"
        : problems.toLowerCase().includes("cuisine")
          ? "cuisine"
          : problems.toLowerCase().includes("chambre")
            ? "chambre"
            : problems.toLowerCase().includes("bureau")
              ? "bureau"
              : "pièce"

      return `${title} dans un ${spaceType}, style architectural, rendu photoréaliste`
    }

    // Recommandations pour les problèmes de chaleur
    if (problems.toLowerCase().includes("chaud") || problems.toLowerCase().includes("chaleur")) {
      return {
        title: "Recommandations pour réduire la chaleur",
        summary: "Votre espace présente des problèmes de surchauffe qui peuvent être résolus avec plusieurs solutions.",
        recommendations: [
          {
            title: "Brise-soleil orientables",
            description:
              "Installez des brise-soleil orientables pour bloquer les rayons directs du soleil tout en préservant la luminosité.",
            cost: budget === "low" ? "Hors budget" : "Dans votre budget",
            icon: <ThermometerSun className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Brise-soleil orientables installés sur les fenêtres"),
          },
          {
            title: "Film solaire pour vitrage",
            description:
              "Appliquez un film solaire sur vos fenêtres pour réduire la chaleur sans perdre la lumière naturelle.",
            cost: "Dans votre budget",
            icon: <ThermometerSun className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Film solaire appliqué sur les fenêtres"),
          },
          {
            title: "Ventilateurs de plafond",
            description:
              "Installez des ventilateurs de plafond pour améliorer la circulation de l'air et créer une sensation de fraîcheur.",
            cost: "Dans votre budget",
            icon: <ThermometerSun className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Ventilateurs de plafond design"),
          },
        ],
      }
    }

    // Recommandations pour les problèmes d'éclairage
    if (
      problems.toLowerCase().includes("sombre") ||
      problems.toLowerCase().includes("lumière") ||
      problems.toLowerCase().includes("eclairage")
    ) {
      return {
        title: "Recommandations pour améliorer l'éclairage",
        summary: "Votre espace manque de lumière naturelle, voici des solutions pour l'améliorer.",
        recommendations: [
          {
            title: "Puits de lumière",
            description: "Installez des puits de lumière pour apporter de la lumière naturelle depuis le toit.",
            cost: budget === "low" || budget === "medium" ? "Hors budget" : "Dans votre budget",
            icon: <Lightbulb className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Puits de lumière installé au plafond"),
          },
          {
            title: "Miroirs stratégiquement placés",
            description:
              "Placez des miroirs face aux fenêtres pour réfléchir la lumière naturelle plus profondément dans la pièce.",
            cost: "Dans votre budget",
            icon: <Lightbulb className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Miroirs stratégiquement placés pour réfléchir la lumière"),
          },
          {
            title: "Éclairage LED indirect",
            description:
              "Installez un système d'éclairage LED indirect pour créer une ambiance lumineuse agréable sans éblouissement.",
            cost: "Dans votre budget",
            icon: <Lightbulb className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Éclairage LED indirect installé"),
          },
        ],
      }
    }

    // Recommandations pour les problèmes acoustiques
    if (
      problems.toLowerCase().includes("bruit") ||
      problems.toLowerCase().includes("acoustique") ||
      problems.toLowerCase().includes("sonore")
    ) {
      return {
        title: "Recommandations pour améliorer l'acoustique",
        summary: "Votre espace présente des problèmes acoustiques qui peuvent être résolus avec plusieurs solutions.",
        recommendations: [
          {
            title: "Panneaux acoustiques décoratifs",
            description:
              "Installez des panneaux acoustiques décoratifs sur les murs pour absorber les sons et réduire la réverbération.",
            cost: "Dans votre budget",
            icon: <FileText className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Panneaux acoustiques décoratifs sur les murs"),
          },
          {
            title: "Rideaux épais",
            description: "Utilisez des rideaux épais pour absorber les sons et réduire les échos.",
            cost: "Dans votre budget",
            icon: <FileText className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Rideaux épais aux fenêtres pour l'acoustique"),
          },
          {
            title: "Tapis et moquettes",
            description:
              "Ajoutez des tapis ou de la moquette pour absorber les bruits d'impact et réduire la propagation du son.",
            cost: "Dans votre budget",
            icon: <FileText className="h-5 w-5" />,
            visualizationPrompt: generatePrompt("Tapis et moquettes pour améliorer l'acoustique"),
          },
        ],
      }
    }

    // Recommandations par défaut
    return {
      title: "Recommandations générales d'amélioration",
      summary: "Voici quelques recommandations générales pour améliorer votre espace.",
      recommendations: [
        {
          title: "Peinture réfléchissante",
          description: "Utilisez une peinture claire et réfléchissante pour augmenter la luminosité de l'espace.",
          cost: "Dans votre budget",
          icon: <Lightbulb className="h-5 w-5" />,
          visualizationPrompt: generatePrompt("Murs peints avec une peinture claire et réfléchissante"),
        },
        {
          title: "Plantes d'intérieur",
          description:
            "Ajoutez des plantes d'intérieur pour améliorer la qualité de l'air et créer une ambiance plus agréable.",
          cost: "Dans votre budget",
          icon: <ThermometerSun className="h-5 w-5" />,
          visualizationPrompt: generatePrompt("Plantes d'intérieur pour améliorer l'ambiance"),
        },
        {
          title: "Mobilier modulable",
          description: "Optez pour du mobilier modulable qui peut être réarrangé selon vos besoins.",
          cost: budget === "low" ? "Partiellement dans votre budget" : "Dans votre budget",
          icon: <FileText className="h-5 w-5" />,
          visualizationPrompt: generatePrompt("Mobilier modulable et adaptable"),
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
          <CardDescription>Basé sur votre description et vos objectifs d'amélioration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="font-medium">{recommendations.summary}</p>
          </div>

          <Tabs defaultValue="recommendations">
            <TabsList className="mb-4">
              <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
              <TabsTrigger value="examples">Exemples visuels</TabsTrigger>
              <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
              <TabsTrigger value="visualizations">Visualisations IA</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="rounded-full bg-primary/10 p-2 mt-1">{rec.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{rec.title}</h3>
                    <p className="text-muted-foreground">{rec.description}</p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          rec.cost === "Dans votre budget"
                            ? "bg-green-100 text-green-800"
                            : rec.cost === "Partiellement dans votre budget"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rec.cost}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Lightbulb className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Exemple de brise-soleil orientables</h3>
                    <p className="text-sm text-muted-foreground">Installation sur une façade sud</p>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Lightbulb className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Exemple de puits de lumière</h3>
                    <p className="text-sm text-muted-foreground">Intégration dans un salon</p>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Panneaux acoustiques décoratifs</h3>
                    <p className="text-sm text-muted-foreground">Installation dans un espace de travail</p>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <ThermometerSun className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Ventilateurs de plafond design</h3>
                    <p className="text-sm text-muted-foreground">Intégration dans un salon moderne</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">EcoMatériaux</h3>
                  <p className="text-muted-foreground">Fournisseur de matériaux écologiques et durables</p>
                  <Button variant="link" className="px-0">
                    Visiter le site
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">LumièreDesign</h3>
                  <p className="text-muted-foreground">Spécialiste en solutions d'éclairage naturel et artificiel</p>
                  <Button variant="link" className="px-0">
                    Visiter le site
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">AcoustiPro</h3>
                  <p className="text-muted-foreground">Expert en solutions acoustiques pour tous types d'espaces</p>
                  <Button variant="link" className="px-0">
                    Visiter le site
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualizations" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Générer une visualisation</h3>
                <p className="text-muted-foreground mb-4">
                  Utilisez l'IA pour visualiser les améliorations recommandées
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
            Nouvelle analyse
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger les recommandations
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
