"use server"
import OpenAI from "openai"
import Together from "together-ai"

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from your environment variables
});

/**
 * Analyzes the lighting in an image and returns color-coded areas
 * @param {string} imageBase64 - Base64 encoded image
 * @returns {object} Object containing lighting analysis results
 */
export async function analyzeLighting(imageBase64) {
  try {
    // For server-side Node.js environment
    // We'll use the 'canvas' package which should be installed via npm
    // npm install canvas
    const { createCanvas, loadImage } = require('canvas');
    
    // Load the image
    const img = await loadImage(imageBase64);
    
    // Create canvas with image dimensions
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0);
    
    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Create a new canvas for the overlay
    const overlayCanvas = createCanvas(img.width, img.height);
    const overlayCtx = overlayCanvas.getContext('2d');
    
    // Draw original image on overlay canvas
    overlayCtx.drawImage(img, 0, 0);
    
    // Create a separate canvas for only the color overlay
    const colorCanvas = createCanvas(img.width, img.height);
    const colorCtx = colorCanvas.getContext('2d');
    
    // Statistics to track lighting distribution
    let brightPixels = 0;
    let mediumPixels = 0;
    let darkPixels = 0;
    const totalPixels = canvas.width * canvas.height;
    
    // Process each pixel to determine lighting level
    for (let i = 0; i < data.length; i += 4) {
      // Calculate brightness using luminance formula
      // Y = 0.299R + 0.587G + 0.114B
      const brightness = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      
      // Determine pixel position
      const pixelIndex = i / 4;
      const x = pixelIndex % canvas.width;
      const y = Math.floor(pixelIndex / canvas.width);
      
      // Set color based on brightness
      let color;
      if (brightness > 0.7) {
        // Bright areas (more light) - green
        color = 'rgba(0, 255, 0, 0.5)';
        brightPixels++;
      } else if (brightness > 0.3) {
        // Medium areas (little light) - yellow
        color = 'rgba(255, 255, 0, 0.5)';
        mediumPixels++;
      } else {
        // Dark areas (no light) - red
        color = 'rgba(255, 0, 0, 0.5)';
        darkPixels++;
      }
      
      // Draw a colored pixel on the overlay
      overlayCtx.fillStyle = color;
      overlayCtx.fillRect(x, y, 1, 1);
      
      // Draw on color-only canvas
      colorCtx.fillStyle = color;
      colorCtx.fillRect(x, y, 1, 1);
    }
    
    // Calculate percentages
    const brightPercentage = Math.round((brightPixels / totalPixels) * 100);
    const mediumPercentage = Math.round((mediumPixels / totalPixels) * 100);
    const darkPercentage = Math.round((darkPixels / totalPixels) * 100);
    
    // Generate lighting assessment text
    let lightingAssessment = '';
    
    if (darkPercentage > 50) {
      lightingAssessment = "L'espace est principalement sous-éclairé, nécessitant des améliorations significatives d'éclairage dans la majorité des zones.";
    } else if (brightPercentage > 50) {
      lightingAssessment = "L'espace est généralement bien éclairé, avec seulement quelques zones nécessitant des ajustements mineurs.";
    } else if (mediumPercentage > 40) {
      lightingAssessment = "L'éclairage de l'espace est modéré, avec des opportunités d'amélioration dans plusieurs zones.";
    } else {
      lightingAssessment = "L'espace présente un éclairage inégal, avec un mélange de zones bien éclairées et sous-éclairées nécessitant une approche équilibrée.";
    }
    
    // Create final output with all information
    return {
      overlayImage: overlayCanvas.toDataURL(),
      colorMaskOnly: colorCanvas.toDataURL(),
      lightingMap: {
        bright: { color: 'rgba(0, 255, 0, 0.5)', percentage: brightPercentage }, // Green - more light
        medium: { color: 'rgba(255, 255, 0, 0.5)', percentage: mediumPercentage }, // Yellow - little light
        dark: { color: 'rgba(255, 0, 0, 0.5)', percentage: darkPercentage }, // Red - no light
      },
      assessment: lightingAssessment
    };
  } catch (error) {
    console.error('Error analyzing lighting:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze image lighting',
    };
  }
}

/**
 * Analyzes an architectural image and returns structured observations and suggestions.
 * @param {string} imageBase64 Base64 encoded image to analyze.
 * @returns {Promise<object>} Analysis results or error information.
 */
export async function analyzeArchitecturalImage(imageBase64) {
  try {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    })

    const base64Image = imageBase64.includes("base64,")
      ? imageBase64.split("base64,")[1]
      : imageBase64

    // System prompt to set expectations without providing examples
    const systemPrompt = `Vous êtes un expert en décoration d'intérieur et design d'espaces. Votre tâche est d'analyser des images d'espaces et de fournir des observations détaillées ainsi que des suggestions d'amélioration en format JSON structuré. 
Vos observations doivent être pertinentes, spécifiques à l'image et fondées sur des principes de design. 
Vos suggestions doivent être créatives, réalisables et appropriées au contexte visible dans l'image.
Vous devez toujours répondre avec un JSON valide sans aucun texte avant ou après.`;

    // User prompt without examples
    const userPrompt = `Analysez cette image d'espace et fournissez un objet JSON comprenant:

1. "descriptionImageOriginale": une brève description objective de l'espace visualisé.

2. "problems": un tableau d'au moins 3 observations constructives. Chaque élément doit contenir:
   - "title": un titre court et précis du problème
   - "description": une explication détaillée du problème
   - "severity": évaluation de l'importance ("faible", "moyen", ou "élevé")

3. "solutions": un tableau avec au moins une solution pour chaque problème identifié. Chaque solution doit avoir:
   - "title": un titre clair
   - "description": une explication détaillée de la solution
   - "cost": estimation du coût ("faible", "moyen", "élevé")
   - "implementationTime": temps de mise en œuvre estimé ("jours", "semaines", "mois")
   - "impact": impact prévu de la solution ("faible", "moyen", "élevé")

Votre réponse doit être UNIQUEMENT l'objet JSON valide, sans texte avant ou après.`;

    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      max_tokens: 2048,
      temperature: 0.3, // Slightly increased for more creative responses
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    })

    const analysisText = response.choices[0].message.content;
    let analysisJson;

    // Enhanced JSON parsing with better error handling
    const tryParseJson = (text, attemptName) => {
      try {
        console.log(`Attempting to parse JSON with ${attemptName} method:`, text.substring(0, 150) + (text.length > 150 ? "..." : ""));
        return JSON.parse(text);
      } catch (e) {
        console.warn(`Parsing with ${attemptName} method failed:`, e.message);
        return null;
      }
    };

    // Enhanced cleaning function to handle escaped characters
    const cleanJsonText = (text) => {
      return text
        .replace(/```json|```/g, '') // Remove markdown code blocks
        .replace(/^[\s\S]*?(\{)/m, '{')  // Remove any text before first {
        .replace(/\}([\s\S]*)$/m, '}')     // Remove any text after last }
        .replace(/\\"/g, '"')         // Replace escaped quotes \" -> "
        .replace(/\\\//g, '/')         // Replace escaped slashes \/ -> /
        .replace(/\\'/g, "'")          // Replace escaped apostrophes \' -> '
        .replace(/\\\[/g, '[')         // Replace escaped brackets \[ -> [
        .replace(/\\\]/g, ']')         // Replace escaped brackets \] -> ]
        .replace(/\\\{/g, '{')         // Replace escaped braces \{ -> {
        .replace(/\\\}/g, '}')         // Replace escaped braces \} -> }
        .replace(/\\n/g, '\n')         // Replace escaped newlines
        .replace(/\\t/g, '\t')         // Replace escaped tabs
        .trim();
    };

    // Attempt 1: Direct parsing with enhanced cleaning
    const jsonPattern = /\{[\s\S]*\}/;
    const jsonMatch = analysisText.match(jsonPattern);
    
    if (jsonMatch && jsonMatch[0]) {
      const cleanedJson = cleanJsonText(jsonMatch[0]);
      analysisJson = tryParseJson(cleanedJson, "primary (enhanced cleaning)");
    }

    // Attempt 2: If primary fails, try parsing the entire response after cleaning
    if (!analysisJson) {
      const fullyCleanedText = cleanJsonText(analysisText);
      analysisJson = tryParseJson(fullyCleanedText, "secondary (full text cleaning)");
    }

    // Attempt 3: Handle case where response is wrapped in outer quotes
    if (!analysisJson && (analysisText.startsWith('"') && analysisText.endsWith('"'))) {
      try {
        const unquotedText = JSON.parse(analysisText); // Parse outer quotes
        if (typeof unquotedText === 'string') {
          const cleanedUnquoted = cleanJsonText(unquotedText);
          analysisJson = tryParseJson(cleanedUnquoted, "tertiary (unquote then clean)");
        }
      } catch (e) {
        console.warn("Tertiary parsing (unquoting outer string) failed:", e.message);
      }
    }

    if (!analysisJson) {
      console.error("All attempts to parse AI response JSON failed. Raw response:", analysisText);
      return {
        success: false,
        error: "Failed to parse AI analysis. The response was not valid JSON even after enhanced cleaning attempts.",
        rawResponse: analysisText // Include raw response for debugging
      };
    }

    // Validate the JSON structure has the required fields
    if (!analysisJson.descriptionImageOriginale || 
        !Array.isArray(analysisJson.problems) || 
        !Array.isArray(analysisJson.solutions)) {
      
      console.error("Invalid JSON structure received:", analysisJson);
      
      return {
        success: false,
        error: "AI response did not contain the expected JSON structure with descriptionImageOriginale, problems, and solutions.",
        receivedStructure: Object.keys(analysisJson).join(', '),
        rawResponse: analysisText
      };
    }

    return {
      success: true,
      analysis: analysisJson,
    }
  } catch (error) {
    console.error("Error analyzing image:", error)
    return {
      success: false,
      error: error.message || "Failed to analyze image",
      stack: error.stack
    }
  }
}

/**
 * Generates an improved version of an architectural image with lighting analysis.
 * @param {string} imageBase64 The base64 encoded original image.
 * @param {Array<object>} problems Array of problem objects.
 * @param {Array<object>} solutions Array of solution objects.
 * @param {string} descriptionImageOriginale Textual description of the original image.
 * @returns {Promise<object>} Object containing success status and generated image URL or error.
 */
export async function generateImprovedVersion(imageBase64, problems, solutions, descriptionImageOriginale) {
  try {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    })

    const base64Image = imageBase64.includes("base64,")
      ? imageBase64.split("base64,")[1]
      : imageBase64

    // First analyze the lighting in the original image
    const lightingAnalysis = await analyzeLighting(`data:image/jpeg;base64,${base64Image}`);
    
    // Add this check to ensure lightingAnalysis is valid
    if (!lightingAnalysis || lightingAnalysis.success === false || !lightingAnalysis.lightingMap) {
      console.error("Lighting analysis failed or returned an unexpected structure:", lightingAnalysis);
      return {
        success: false,
        error: lightingAnalysis?.error || "Lighting analysis failed and did not return the expected structure.",
        details: lightingAnalysis // Include the actual response for debugging
      };
    }
    
    console.log("Lighting analysis completed:", 
                "Bright: " + lightingAnalysis.lightingMap.bright.percentage + "%", 
                "Medium: " + lightingAnalysis.lightingMap.medium.percentage + "%", 
                "Dark: " + lightingAnalysis.lightingMap.dark.percentage + "%");
    // Log the assessment from analyzeLighting
    if (lightingAnalysis.assessment) {
        console.log("Lighting Assessment from analyzeLighting:", lightingAnalysis.assessment);
    }

    const problemsSummary = problems.map(p => p.title).join(", ")
    const solutionsSummary = solutions.map(s => s.title).join(", ")

    // Enhanced system prompt with lighting information
    const systemPrompt = `Vous êtes un expert en design d'intérieur et visualisation 3D qui crée des rendus réalistes d'espaces améliorés.
Votre tâche est de générer une visualisation photoréaliste qui montre l'espace avec les améliorations suggérées, tout en préservant la structure, l'échelle et la perspective originales.

Une analyse d'éclairage a été effectuée sur l'image originale, avec les résultats suivants:
- Zones bien éclairées (en vert): ${lightingAnalysis.lightingMap.bright.percentage}% de l'image
- Zones moyennement éclairées (en jaune): ${lightingAnalysis.lightingMap.medium.percentage}% de l'image
- Zones sombres (en rouge): ${lightingAnalysis.lightingMap.dark.percentage}% de l'image

${lightingAnalysis.assessment}`;

    // Create problem-solution pairs mapping
    const problemsList = problemsSummary.split(',').map(p => p.trim());
    const solutionsList = solutionsSummary.split(',').map(s => s.trim());
    
    // Build problem-solution mapping with clearer instructions
    let improvementMapping = "";
    
    for (let i = 0; i < problemsList.length; i++) {
      
      const solution = i < solutionsList.length
        ? solutionsList[i]
        : "Amélioration générale de l'espace";
      
      improvementMapping += `${i+1}. Problème: "${problemsList[i]}" → Application visuelle: "${solution}"\n`;
    }

    // Enhanced user prompt with lighting instructions
    const userPrompt = `Description de l'espace original:
${descriptionImageOriginale}

Problèmes identifiés:
${problemsSummary}

Créez une visualisation photoréaliste qui intègre les améliorations suivantes:

${improvementMapping}

CONSIGNES IMPORTANTES:
- Conservez exactement la même perspective, angle de vue et structure architecturale de base
- Rendez les changements clairement visibles et harmonieux
- La visualisation doit être photoréaliste et professionnelle
- Respectez le style général de l'espace tout en l'améliorant

AMÉLIORATIONS D'ÉCLAIRAGE SPÉCIFIQUES:
- Zones vertes (${lightingAnalysis.lightingMap.bright.percentage}% de l'image): Maintenir le bon niveau d'éclairage existant
- Zones jaunes (${lightingAnalysis.lightingMap.medium.percentage}% de l'image): Renforcer légèrement l'éclairage pour une meilleure visibilité
- Zones rouges (${lightingAnalysis.lightingMap.dark.percentage}% de l'image): Ajouter des sources d'éclairage significatives pour éliminer les zones d'ombre

Cette visualisation sera utilisée pour montrer un "avant/après" réaliste et convaincant.`;

    // Log the prompts to verify lighting analysis usage
    console.log("\n--- System Prompt for Image Generation ---");
    console.log(systemPrompt);
    console.log("--- User Prompt Lighting Instructions for Image Generation ---");
    console.log(`AMÉLIORATIONS D'ÉCLAIRAGE SPÉCIFIQUES:
- Zones vertes (${lightingAnalysis.lightingMap.bright.percentage}% de l'image): Maintenir le bon niveau d'éclairage existant
- Zones jaunes (${lightingAnalysis.lightingMap.medium.percentage}% de l'image): Renforcer légèrement l'éclairage pour une meilleure visibilité
- Zones rouges (${lightingAnalysis.lightingMap.dark.percentage}% de l'image): Ajouter des sources d'éclairage significatives pour éliminer les zones d'ombre`);
    console.log("-----------------------------------------\n");

    // Combine system and user prompts
    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // FIXED: Use correct size parameter for GPT-image-1
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: combinedPrompt,
      n: 1, // GPT-image-1 supports only 1 image per request
      // size: "1024x1024", // FIXED: Use supported size (was "512x512")
      // quality: "high", // Options: "standard", "high"
      // output_format: "png", // Options: "png", "jpeg"
      // background: "auto", // Options: "auto", "transparent", "white", "black"
      // moderation: "auto", // Content moderation
    });
    console.log("Image generation response:", response);

    // Create a data URI from the base64 string so it can be used directly in an <img> src
    const generatedImage = response.data[0].b64_json 
      ? `data:image/png;base64,${response.data[0].b64_json}`
      : null;

    console.log("Generated image URL:", response.data[0].url); // Will be undefined, which is expected
    console.log("Generated image base64:", generatedImage ? "Available and formatted" : "Not available");

    return {
      success: true,
      generatedImage: generatedImage,
      revisedPrompt: response.data[0].revised_prompt, // GPT-image-1 provides this
      lightingAnalysis: {
        assessment: lightingAnalysis.assessment,
        statistics: {
          brightAreas: lightingAnalysis.lightingMap.bright.percentage + '%',
          mediumAreas: lightingAnalysis.lightingMap.medium.percentage + '%',
          darkAreas: lightingAnalysis.lightingMap.dark.percentage + '%'
        },
        overlayImage: lightingAnalysis.overlayImage
      }
    }
  } catch (error) {
    console.error("Error generating improved version:", error)
    let rawResponseContent = "";
    if (error.response && error.response.data) {
        // If the error object has a response from an API call (e.g., Axios)
        rawResponseContent = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
    } else if (error.message) {
        rawResponseContent = error.message;
    }

    return {
      success: false,
      error: error.message || "Failed to generate improved version",
      rawResponse: rawResponseContent, // Include raw response or error message
      stack: error.stack
    }
  }
}