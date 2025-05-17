"use client"

import { useState, useEffect } from "react"
import { Upload, Scan, AlertCircle, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyzeArchitecturalImage, generateImprovedVersion } from "./analyzeArchitecturalImage"

// Define interfaces for our state
interface Problem {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Solution {
  title: string;
  description: string;
  cost: 'high' | 'medium' | 'low';
  implementationTime: string;
  impact: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  descriptionImageOriginale: string;
  problems: Problem[];
  solutions: Solution[];
}

interface BeforeAfterState {
  before: string | null;
  after: string | null;
}

export default function ArchitecturalAIAnalysis(): React.ReactElement {
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [beforeAfterImages, setBeforeAfterImages] = useState<BeforeAfterState | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      // setError("No file selected."); // Optionally set an error
      return;
    }
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image file size exceeds 10MB limit.")
        return
      }
      
      setImage(file)
      const fileReader = new FileReader()
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        setPreviewUrl(e.target?.result as string | null)
      }
      fileReader.readAsDataURL(file)
      setAnalysis(null)
      setError(null)
      setBeforeAfterImages(null)
    }
  }

  const analyzeImage = async () => {
    if (!image || !previewUrl) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Call the Together AI service to analyze the image
      const result = await analyzeArchitecturalImage(previewUrl)
      
      if (result.success) {
        setAnalysis(result.analysis)
        
        // Set before image
        setBeforeAfterImages({
          before: previewUrl,
          after: "/placeholder.jpg", // Using a local placeholder image instead of API endpoint
        })
        
        // Now generate the improved version
        setIsGenerating(true)
        try {
          const descriptionImageOriginale = result.analysis.descriptionImageOriginale || "Description non fournie"; // Fallback if not present
          const improvedResult = await generateImprovedVersion(
            previewUrl, 
            result.analysis.problems, 
            result.analysis.solutions,
            descriptionImageOriginale // Pass the new description
          )
          
          if (improvedResult.success) {
            setBeforeAfterImages(prev => ({
              before: prev!.before,
              after: improvedResult.generatedImage
            }))
          } else {
            // If generation fails, use a placeholder
            setBeforeAfterImages(prev => ({
              before: prev!.before,
              after: "/placeholder.jpg"
            }))
          }
        } catch (genError) {
          console.error("Generation error:", genError)
          setBeforeAfterImages(prev => ({
            before: prev!.before,
            after: "/placeholder.jpg"
          }))
        } finally {
          setIsGenerating(false)
        }
      } else {
        setError(result.error || "Failed to analyze the image.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    // Clean up object URLs when component unmounts
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Architecture AI Analysis</CardTitle>
          <CardDescription>
            Upload an image of your space to receive AI-powered analysis and improvement recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              {previewUrl ? (
                <div className="w-full">
                  <img 
                    src={previewUrl} 
                    alt="Uploaded space" 
                    className="max-h-64 mx-auto object-contain mb-4" 
                  />
                  <p className="text-sm text-muted-foreground">{image?.name}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImage(null)
                      setPreviewUrl(null)
                      setAnalysis(null)
                    }}
                    className="mt-4"
                  >
                    Replace Image
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Upload an image of your architectural space</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supported formats: JPG, PNG (max 10MB)
                  </p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button asChild>
                    <label htmlFor="image-upload">Upload Image</label>
                  </Button>
                </>
              )}
            </div>

            {previewUrl && !analysis && (
              <Button 
                className="w-full" 
                onClick={analyzeImage} 
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Architecture...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-4 w-4" />
                    Analyze Architecture
                  </>
                )}
              </Button>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered assessment of your architectural space with recommended improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="problems">
              <TabsList className="mb-4">
                <TabsTrigger value="problems">Identified Problems</TabsTrigger>
                <TabsTrigger value="solutions">Recommended Solutions</TabsTrigger>
                <TabsTrigger value="visualization">Before & After</TabsTrigger>
              </TabsList>

              <TabsContent value="problems" className="space-y-4">
                {analysis.problems.map((problem, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`rounded-full p-2 mt-1 ${
                      problem.severity === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : problem.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{problem.title}</h3>
                      <p className="text-muted-foreground">{problem.description}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          problem.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : problem.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {problem.severity.charAt(0).toUpperCase() + problem.severity.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="solutions" className="space-y-4">
                {analysis.solutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="rounded-full bg-green-100 text-green-700 p-2 mt-1">
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{solution.title}</h3>
                      <p className="text-muted-foreground">{solution.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          solution.cost === 'high'
                            ? 'bg-red-100 text-red-800'
                            : solution.cost === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          Cost: {solution.cost.charAt(0).toUpperCase() + solution.cost.slice(1)}
                        </span>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                          Time: {solution.implementationTime.charAt(0).toUpperCase() + solution.implementationTime.slice(1)}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          solution.impact === 'high'
                            ? 'bg-green-100 text-green-800'
                            : solution.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          Impact: {solution.impact.charAt(0).toUpperCase() + solution.impact.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="visualization">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-2">
                        <img 
                          src={beforeAfterImages?.before || "/placeholder.jpg"} 
                          alt="Before" 
                          className="w-full h-auto rounded-md"
                        />
                      </div>
                      <div className="p-4 bg-muted">
                        <h3 className="font-medium text-center">Current Space</h3>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-2">
                        {isGenerating ? (
                          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                            <div className="text-center">
                              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Generating improved design...</p>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={beforeAfterImages?.after || "/placeholder.jpg"} 
                            alt="After" 
                            className="w-full h-auto rounded-md"
                          />
                        )}
                      </div>
                      <div className="p-4 bg-muted">
                        <h3 className="font-medium text-center">AI Visualized Improvements</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> This visualization represents a conceptual interpretation of the recommended improvements.
                      Actual results may vary based on specific implementation details.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}