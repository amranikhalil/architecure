"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileUp, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "@/components/file-uploader"
import { RecommendationDisplay } from "@/components/recommendation-display"

export default function EspaceEtudiant() {
  const [activeStep, setActiveStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectType: "",
    spaceType: "",
    existingMaterials: "",
    simulationObjective: "",
    additionalInfo: "",
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

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (activeStep < 3) {
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
      projectType: "",
      spaceType: "",
      existingMaterials: "",
      simulationObjective: "",
      additionalInfo: "",
    })
    setUploadedFile(null)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-200 via-[#e7c9b2] to-[#b87333] flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
          <h1 className="text-copper text-3xl font-bold">Espace Étudiant</h1>
          <p className="text-gray-700 mt-2">
            Importez vos plans architecturaux et obtenez des recommandations pour améliorer vos projets
          </p>
        </div>

        {!showResults ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Simulation de projet architectural</CardTitle>
              <CardDescription className="text-gray-700">Suivez les étapes pour obtenir des recommandations personnalisées</CardDescription>
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
                    <div className={`h-1 w-12 ${activeStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
                    <div
                      className={`rounded-full h-8 w-8 flex items-center justify-center ${activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      3
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Étape {activeStep} sur 3</div>
                </div>
              </div>

              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Importez votre plan architectural</h3>
                    <FileUploader onFileUpload={handleFileUpload} acceptedFileTypes=".pdf,.jpg,.jpeg,.png,.dwg" />

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
                    <Label htmlFor="projectType">Type de projet</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => handleSelectChange("projectType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de projet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Résidentiel</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="educational">Éducatif</SelectItem>
                        <SelectItem value="industrial">Industriel</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="spaceType">Type d'espace</Label>
                    <Select value={formData.spaceType} onValueChange={(value) => handleSelectChange("spaceType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type d'espace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classroom">Salle de classe</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="laboratory">Laboratoire</SelectItem>
                        <SelectItem value="office">Bureau</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="existingMaterials">Matériaux existants</Label>
                    <Textarea
                      id="existingMaterials"
                      name="existingMaterials"
                      placeholder="Décrivez les matériaux utilisés dans votre projet"
                      value={formData.existingMaterials}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="simulationObjective" className="mb-2 block">
                      Objectif de la simulation
                    </Label>
                    <RadioGroup
                      value={formData.simulationObjective}
                      onValueChange={(value) => handleRadioChange("simulationObjective", value)}
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                      <Label
                        htmlFor="comfort"
                        className="flex cursor-pointer items-start space-x-3 rounded-md border p-3 hover:bg-muted"
                      >
                        <RadioGroupItem value="comfort" id="comfort" />
                        <div>
                          <p className="font-medium">Confort</p>
                          <p className="text-sm text-muted-foreground">Améliorer le confort thermique et acoustique</p>
                        </div>
                      </Label>
                      <Label
                        htmlFor="energy"
                        className="flex cursor-pointer items-start space-x-3 rounded-md border p-3 hover:bg-muted"
                      >
                        <RadioGroupItem value="energy" id="energy" />
                        <div>
                          <p className="font-medium">Énergie</p>
                          <p className="text-sm text-muted-foreground">Optimiser la consommation énergétique</p>
                        </div>
                      </Label>
                      <Label
                        htmlFor="lighting"
                        className="flex cursor-pointer items-start space-x-3 rounded-md border p-3 hover:bg-muted"
                      >
                        <RadioGroupItem value="lighting" id="lighting" />
                        <div>
                          <p className="font-medium">Éclairage</p>
                          <p className="text-sm text-muted-foreground">Améliorer l'éclairage naturel et artificiel</p>
                        </div>
                      </Label>
                      <Label
                        htmlFor="ergonomics"
                        className="flex cursor-pointer items-start space-x-3 rounded-md border p-3 hover:bg-muted"
                      >
                        <RadioGroupItem value="ergonomics" id="ergonomics" />
                        <div>
                          <p className="font-medium">Ergonomie</p>
                          <p className="text-sm text-muted-foreground">Optimiser l'agencement et l'ergonomie</p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo">Informations complémentaires</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Ajoutez des détails supplémentaires sur votre projet"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
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
                ) : activeStep < 3 ? (
                  "Suivant"
                ) : (
                  "Lancer la simulation"
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <RecommendationDisplay
            projectType={formData.projectType}
            spaceType={formData.spaceType}
            simulationObjective={formData.simulationObjective}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  )
}
