"use server"

import Together from "together-ai"

export async function generateImage(prompt: string, n = 1) {
  try {
    // Use your new API key here
    const apiKey = process.env.TOGETHER_API_KEY || "your_complete_api_key"

    if (!apiKey) {
      console.error("TOGETHER_API_KEY environment variable is missing or empty")
      return {
        success: false,
        error: "API key not configured. Please check server configuration.",
      }
    }

    // Validate prompt
    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt:", prompt)
      return {
        success: false,
        error: "A valid text prompt is required.",
      }
    }

    // Initialize the Together client
    const together = new Together({ apiKey })

    // Ensure n is a valid number
    const numImages = Math.max(1, Math.min(4, Number(n) || 1))

    // CHANGE HERE: Set steps to a value between 1 and 4
    const steps = 4 // Changed from 10 to 4 (maximum allowed)

    console.log("Sending request to Together API with:", {
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: prompt,
      steps: steps,
      n: numImages,
    })

    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: prompt,
      steps: steps,
      n: numImages,
    })

    console.log("Raw API response:", JSON.stringify(response)) // Debug log to see the exact response structure

    // Check if response exists and has the expected structure
    if (!response) {
      console.error("Empty API response")
      return {
        success: false,
        error: "Received an empty response from the image generation API.",
      }
    }

    // NEW APPROACH: Handle URL-based image responses from Together AI
    let imageUrls: string[] = []
    
    // Check for data array with urls
    if (response.data && Array.isArray(response.data)) {
      // Extract URLs from the data array
      imageUrls = response.data
        .filter(img => img && img.url)
        .map(img => img.url)
    }
    
    // If we found image URLs, return them directly
    if (imageUrls.length > 0) {
      return {
        success: true,
        imageUrls: imageUrls,
      }
    }
    
    // Fall back to previous approach for base64 data
    let imageData: string[] = []
    
    // Check if response has data array with b64_json property
    if (response.data && Array.isArray(response.data)) {
      imageData = response.data
        .filter(img => img && img.b64_json)
        .map(img => img.b64_json)
    } 
    // Check if the response itself has a b64_json property
    else if (response.b64_json) {
      imageData = [response.b64_json]
    }
    
    if (imageData.length > 0) {
      return {
        success: true,
        images: imageData,
      }
    }
    
    console.error("No image URLs or data found in response:", response)
    return {
      success: false,
      error: "No valid image URLs or data found in the API response.",
    }
  } catch (error) {
    console.error("Error generating image:", error)

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes("toLowerCase")) {
        return {
          success: false,
          error: "There was an issue with the image generation parameters. Please try a different prompt.",
        }
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during image generation",
    }
  }
}