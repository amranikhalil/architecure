"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileUp, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "@/components/file-uploader"
import { ClientRecommendationDisplay } from "@/components/client-recommendation-display"

export default function EspaceClient() {
  const [activeStep, setActiveStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    materials: "",
    problems: "",
    improvements: "",
    budget: "",
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1)
    } else {
      // Simulate processing
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setShowResults(true)
      }, 2000)
    }
  }

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleStartOver = () => {
    setActiveStep(1)
    setFormData({
      materials: "",
      problems: "",
      improvements: "",
      budget: "",
    })
    setUploadedFile(null)
    setShowResults(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl font-bold">Espace Client</h1>
        <p className="text-muted-foreground mt-2">
          Partagez des photos de votre espace et obtenez des recommandations personnalisées
        </p>
      </div>

      {!showResults ? (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Analyse d'espace</CardTitle>
            <CardDescription>Suivez les étapes pour obtenir des recommandations d'amélioration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center ${activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    1
                  </div>
                  <div className={`h-1 w-12 ${activeStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center ${activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    2
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Étape {activeStep} sur 2</div>
              </div>
            </div>

            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Importez une photo de votre espace</h3>
                  <FileUploader onFileUpload={handleFileUpload} acceptedFileTypes=".jpg,.jpeg,.png" />

                  {uploadedFile && (
                    <div className="mt-4 p-4 border rounded-md bg-muted/50">
                      <div className="flex items-center">
                        <FileUp className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="materials">Matériaux utilisés</Label>
                  <Textarea
                    id="materials"
                    name="materials"
                    placeholder="Décrivez les matériaux présents dans votre espace (bois, béton, métal, verre, etc.)"
                    value={formData.materials}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="problems">Problèmes rencontrés</Label>
                  <Textarea
                    id="problems"
                    name="problems"
                    placeholder="Décrivez les problèmes que vous rencontrez (trop chaud, trop froid, sombre, bruyant, etc.)"
                    value={formData.problems}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="improvements">Améliorations souhaitées</Label>
                  <Textarea
                    id="improvements"
                    name="improvements"
                    placeholder="Décrivez les améliorations que vous souhaitez apporter à votre espace"
                    value={formData.improvements}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Fourchette budgétaire (optionnel)</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleSelectChange("budget", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Moins de 1000€</SelectItem>
                      <SelectItem value="medium">Entre 1000€ et 5000€</SelectItem>
                      <SelectItem value="high">Entre 5000€ et 10000€</SelectItem>
                      <SelectItem value="very-high">Plus de 10000€</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeStep > 1 ? (
              <Button variant="outline" onClick={handlePrevStep}>
                Précédent
              </Button>
            ) : (
              <div></div>
            )}
            <Button onClick={handleNextStep} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : activeStep < 2 ? (
                "Suivant"
              ) : (
                "Obtenir des recommandations"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <ClientRecommendationDisplay
          problems={formData.problems}
          improvements={formData.improvements}
          budget={formData.budget}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  )
}
