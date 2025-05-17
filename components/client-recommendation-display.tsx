"use client"
// Removed useState as it's not used in the final version of this component
// import { useState } from "react"
import { Download } from "lucide-react" // Removed unused FileText, Lightbulb, ThermometerSun

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Interface definitions remain the same
interface Problem {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface Solution {
  title: string;
  description: string;
  cost: "high" | "medium" | "low";
  implementationTime: "months" | "weeks" | "days";
  impact: "high" | "medium" | "low";
}

interface AnalysisResult {
  problems: Problem[];
  solutions: Solution[];
}

interface ClientRecommendationDisplayProps {
  originalImage: string; // base64 data URL
  analysis: AnalysisResult;
  generatedImage: string; // URL of the generated image
  onStartOver: () => void;
}

export function ClientRecommendationDisplay({
  originalImage,
  analysis,
  generatedImage,
  onStartOver,
}: ClientRecommendationDisplayProps) {
  const { problems, solutions } = analysis;

  const handleDownloadPDF = () => {
    // Simulation de téléchargement de PDF
    alert("Téléchargement du rapport PDF (fonctionnalité simulée)");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Analyse Architecturale et Recommandations</CardTitle>
          <CardDescription>Résultats de l'analyse IA de votre espace et suggestions d'amélioration.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="original" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="original">Image Originale</TabsTrigger>
              <TabsTrigger value="analysis">Analyse et Solutions</TabsTrigger>
              <TabsTrigger value="improved">Visualisation Améliorée</TabsTrigger>
            </TabsList>
            <TabsContent value="original">
              <Card>
                <CardHeader>
                  <CardTitle>Votre Image Initiale</CardTitle>
                </CardHeader>
                <CardContent>
                  {originalImage ? (
                    <img src={originalImage} alt="Original architectural space" className="rounded-lg w-full h-auto" />
                  ) : (
                    <p>Aucune image originale fournie.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analysis">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Problèmes Identifiés</h3>
                  {problems && problems.length > 0 ? (
                    <ul className="space-y-4">
                      {problems.map((problem, index) => (
                        <li key={`problem-${index}`} className="p-4 border rounded-lg bg-card shadow">
                          <h4 className="font-semibold text-lg">{problem.title} <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${problem.severity === 'high' ? 'bg-red-100 text-red-800' : problem.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`}>{problem.severity.toUpperCase()}</span></h4>
                          <p className="text-muted-foreground mt-1">{problem.description}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun problème spécifique identifié.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Solutions Proposées</h3>
                  {solutions && solutions.length > 0 ? (
                    <ul className="space-y-4">
                      {solutions.map((solution, index) => (
                        <li key={`solution-${index}`} className="p-4 border rounded-lg bg-card shadow">
                          <h4 className="font-semibold text-lg">{solution.title}</h4>
                          <p className="text-muted-foreground mt-1">{solution.description}</p>
                          <div className="text-xs mt-2 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-muted-foreground">
                            <span><span className="font-medium text-foreground">Coût:</span> {solution.cost}</span>
                            <span><span className="font-medium text-foreground">Temps:</span> {solution.implementationTime}</span>
                            <span><span className="font-medium text-foreground">Impact:</span> {solution.impact}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucune solution spécifique proposée.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="improved">
              <Card>
                <CardHeader>
                  <CardTitle>Visualisation de l'Espace Amélioré</CardTitle>
                  <CardDescription>Générée par IA basée sur les solutions proposées.</CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedImage ? (
                    <img src={generatedImage} alt="Generated improved architectural space" className="rounded-lg w-full h-auto" />
                  ) : (
                    <p>La génération de l'image améliorée est en cours ou n'est pas encore disponible.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button onClick={onStartOver} variant="outline">
              Recommencer une nouvelle analyse
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" /> Télécharger le Rapport PDF (simulé)
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          {/* Optional: Add a small note or branding here */}
          <p className="text-xs text-muted-foreground">Analyse fournie par ArchIntellect AI</p>
        </CardFooter>
      </Card>
    </div>
  );
}
