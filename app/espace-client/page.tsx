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

// Define expected return type for analyzeArchitecturalImage
interface AnalyzeImageSuccessResponse {
  success: true;
  analysis: AnalysisResult;
}
interface AnalyzeImageErrorResponse {
  success: false;
  error: string;
  rawResponse?: string; // Optional: if you want to pass the raw response on error
  receivedStructure?: string; // Optional
}
type AnalyzeImageResponse = AnalyzeImageSuccessResponse | AnalyzeImageErrorResponse;

// Define expected return type for generateImprovedVersion
interface GenerateImageSuccessResponse {
  success: true;
  generatedImage: string;
  lightingAnalysis?: any; // Can be more specific if needed
}
interface GenerateImageErrorResponse {
  success: false;
  error: string;
  rawResponse?: string; // Add rawResponse here for consistency
  stack?: string; // Optional
  details?: any; // Optional, for passing lightingAnalysis failure details
}
type GenerateImageResponse = GenerateImageSuccessResponse | GenerateImageErrorResponse;

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
  // Store original inputs for regeneration
  const [originalInputs, setOriginalInputs] = useState<{
    imageBase64: string;
    problems: Problem[];
    solutions: Solution[];
    descriptionImageOriginale: string;
  } | null>(null);

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
      setOriginalInputs(null); // Reset original inputs on new image upload
    }
  }

  const analyzeImage = async () => {
    if (!image || !previewUrl) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Call the Together AI service to analyze the image
      const result = await analyzeArchitecturalImage(previewUrl) as AnalyzeImageResponse
      
      if (result.success) {
        setAnalysis(result.analysis)
        // Store inputs for regeneration
        setOriginalInputs({
          imageBase64: previewUrl,
          problems: result.analysis.problems,
          solutions: result.analysis.solutions,
          descriptionImageOriginale: result.analysis.descriptionImageOriginale || "Description non fournie",
        });
        
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
          ) as GenerateImageResponse
          
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
        // Log the raw response if available for debugging JSON parsing issues
        if (result.rawResponse) {
          console.error("Raw AI Response (analyzeArchitecturalImage):");
          console.error(result.rawResponse);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const regenerateImprovedVersion = async () => {
    if (!originalInputs) {
      setError("Original analysis data is not available for regeneration.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const improvedResult = await generateImprovedVersion(
        originalInputs.imageBase64,
        originalInputs.problems,
        originalInputs.solutions,
        originalInputs.descriptionImageOriginale
      ) as GenerateImageResponse;

      if (improvedResult.success) {
        setBeforeAfterImages(prev => ({
          before: prev!.before, // Keep the original 'before' image
          after: improvedResult.generatedImage
        }));
      } else {
        setError(improvedResult.error || "Failed to regenerate the improved image.");
        // Log raw response or details if available from regeneration error
        if (improvedResult.details && improvedResult.details.rawResponse) { // Check if details contains rawResponse
            console.error("Raw AI Response (regenerateImprovedVersion - from lighting analysis failure):");
            console.error(improvedResult.details.rawResponse);
        } else if (improvedResult.rawResponse) { // Direct rawResponse on improvedResult error (if generateImprovedVersion adds it)
            console.error("Raw AI Response (regenerateImprovedVersion):");
            console.error(improvedResult.rawResponse);
        }
      }
    } catch (genError) {
      console.error("Regeneration error:", genError);
      setError("An unexpected error occurred during regeneration. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
      <Card className="mb-6 mt-3">
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
                {beforeAfterImages ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-center">Before</h4>
                      <img 
                        src={beforeAfterImages.before!} 
                        alt="Original space" 
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-center">After (Improved)</h4>
                      {isGenerating && !beforeAfterImages.after?.includes('placeholder.jpg') && ( // Show spinner only if generating and not placeholder
                        <div className="flex flex-col items-center justify-center h-full">
                          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                          <p className="text-muted-foreground">Generating new version...</p>
                        </div>
                      )}
                      {(!isGenerating || beforeAfterImages.after?.includes('placeholder.jpg')) && beforeAfterImages.after && (
                         <img 
                           src={beforeAfterImages.after} 
                           alt="Improved space" 
                           className="w-full rounded-lg shadow-md"
                         />
                      )}
                       <Button 
                        onClick={regenerateImprovedVersion} 
                        disabled={isGenerating || !originalInputs}
                        className="w-full mt-4"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Regenerating...
                          </>
                        ) : (
                          "Regenerate Improved Version"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>Visualization will appear here once analysis is complete.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}