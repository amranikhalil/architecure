"use client"

import { useState } from "react"
import { generateImage } from "@/app/actions/generate-image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ImageIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ImageGeneratorProps {
  initialPrompt?: string
  onImageGenerated?: (imageBase64: string) => void
}

export function ImageGenerator({ initialPrompt = "", onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const [result, setResult] = useState<any>(null)
  
  const handleGenerate = async () => {
    if (!prompt || !prompt.trim()) {
      setError("Veuillez entrer une description pour générer une image.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setImages([])
    setResult(null)

    try {
      console.log("Generating image with prompt:", prompt)
      const response = await generateImage(prompt, 1)
      console.log("Generation result:", response)
      setResult(response)

      if (response.success) {
        if (response.images && response.images.length > 0) {
          setImages(response.images)
          if (onImageGenerated && response.images.length > 0) {
            onImageGenerated(response.images[0])
          }
        } else if (response.imageUrls && response.imageUrls.length > 0) {
          // Handle the URL-based images
          // Optionally notify parent component about generated image URL
          if (onImageGenerated && response.imageUrls.length > 0) {
            onImageGenerated(response.imageUrls[0])
          }
        } else {
          setError("La génération a réussi mais aucune image n'a été retournée.")
        }
      } else {
        setError(response.error || "Échec de la génération d'image. Veuillez réessayer.")
      }
    } catch (err) {
      console.error("Error in handleGenerate:", err)
      setError("Une erreur inattendue s'est produite lors de la génération de l'image.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Décrivez l'image que vous souhaitez générer..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
          disabled={isGenerating}
        />
        <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Générer une visualisation
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {((images && images.length > 0) || (result?.imageUrls && result.imageUrls.length > 0)) && (
        <div className="grid gap-4 grid-cols-1">
          {/* Handle direct image URLs */}
          {result?.imageUrls?.map((imgUrl, index) => (
            <Card key={`url-${index}`}>
              <CardContent className="p-2">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={`Generated visualization ${index + 1}`}
                    className="w-full h-auto rounded-md"
                    onError={(e) => {
                      console.error("Image URL failed to load:", imgUrl)
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3EImage Error%3C/text%3E%3C/svg%3E"
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md">
                    <span className="text-gray-400">Image URL unavailable</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {/* Handle base64 encoded images */}
          {/* {images.map((imgBase64, index) => (
            <Card key={`base64-${index}`}>
              <CardContent className="p-2">
                {imgBase64 ? (
                  <img
                    src={`data:image/png;base64,${imgBase64}`}
                    alt={`Generated visualization ${index + 1}`}
                    className="w-full h-auto rounded-md"
                    onError={(e) => {
                      console.error("Image failed to load:", imgBase64 ? imgBase64.substring(0, 20) + "..." : "undefined")
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3EImage Error%3C/text%3E%3C/svg%3E"
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md">
                    <span className="text-gray-400">Image data unavailable</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))} */}
        </div>
      )}
    </div>
  )
}