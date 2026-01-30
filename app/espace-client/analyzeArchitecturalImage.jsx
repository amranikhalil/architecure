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

   const systemPrompt = `STRICT RULES (read first):
- Reproduce the attached 2D floor plan as a 3D model with exact dimensions and furniture placement.
- DO NOT add, remove, or move any elements not present in the 2D plan.
- Use only the items and layout shown in the analysis data.
- Doors and windows must be placed exactly as specified.
- No creative interpretation or visual embellishments.
- Maintain architectural accuracy and proportions. No omissions.

Your only goal is to generate a 3D view that matches the 2D plan exactly, suitable for construction reference.`;

// Ultra-strict user prompt for 2D-to-3D fidelity
const userPrompt = `You must convert the attached 2D floor plan into a 3D representation with absolute precision.

STRICT REQUIREMENTS:
1. Reproduce the 2D plan exactly, including all dimensions, furniture, and architectural elements.
2. Do NOT add, remove, or move any elements not present in the plan.
3. Use only the items, layout, and positions shown in the analysis data.
4. Doors and windows must match the plan in size and placement.
5. No creative interpretation, style changes, or visual embellishments.
6. Output must be a valid JSON object only, with all measurements and proportions preserved.

Return a JSON object with fields:
{
  "architecturalAnalysis": {
    "drawingType": "Type of drawing (e.g., floor plan)",
    "scale": "Drawing scale or estimate",
    "orientation": "Cardinal orientation (N/E/S/W)",
    "dimensionalData": {
      "overallDimensions": "Overall length, width, area",
      "roomDimensions": "Each room with precise measurements",
      "wallThickness": "Wall thickness",
      "doorWidths": "Door widths",
      "windowDimensions": "Window sizes and positions"
    }
  },
  "precise3DDescription": {
    "basePrompt": "Detailed 3D description using only the plan's data",
    "structuralElements": "Walls, columns, beams, stairs, with exact positions",
    "materialSpecifications": "Materials for floors, walls, ceilings, doors, windows",
    "lightingAndAmbiance": "Natural and artificial lighting as shown",
    "perspectiveInstructions": "Camera/viewpoint for 3D rendering"
  },
  "qualityAssurance": {
    "dimensionalAccuracy": "Checklist for exact proportions",
    "architecturalStandards": "Compliance with standard codes",
    "visualConsistency": "Consistent style and materials"
  },
  "enhanced3DPrompt": "A single, strict instruction for 3D AI: create an identical 3D representation, no additions, no omissions, no creative interpretation."
}`;

//       messages: [
//         {
//           role: "system",
//           content: systemPrompt
//         },
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: userPrompt,
//             },
//             {
//               type: "image_url",
//               image_url: {
//                 url: `data:image/jpeg;base64,${base64Image}`,
//               },
//             },
//           ],
//         },
//       ],
//     })
    const response = await openai.chat.completions.create({
    model: "gpt-4o", // ou "gpt-4-vision-preview"
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: systemPrompt },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ]
  });

    const analysisText = response.choices[0].message.content;
    let analysisJson;
    console.log("AI response text:", analysisText);

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
    // if (!analysisJson.descriptionImageOriginale || 
    //     !Array.isArray(analysisJson.problems) || 
    //     !Array.isArray(analysisJson.solutions)) {
      
    //   console.error("Invalid JSON structure received:", analysisJson);
      
    //   return {
    //     success: false,
    //     error: "AI response did not contain the expected JSON structure with descriptionImageOriginale, problems, and solutions.",
    //     receivedStructure: Object.keys(analysisJson).join(', '),
    //     rawResponse: analysisText
    //   };
    // }
    console.log("nepo")
    console.log('analyses',analysisJson)

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
export async function generateImprovedVersion(imageBase64, problems, solutions, descriptionImageOriginale,analysis) {
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

    // const problemsSummary = problems.map(p => p.title).join(", ")
    // const solutionsSummary = solutions.map(s => s.title).join(", ")

    // Enhanced system prompt with lighting information
    const systemPrompt = `Vous êtes un expert en design d'intérieur et visualisation 3D qui crée des rendus réalistes d'espaces améliorés.
Votre tâche est de générer une visualisation photoréaliste qui montre l'espace avec les améliorations suggérées, tout en préservant la structure, l'échelle et la perspective originales.

Une analyse d'éclairage a été effectuée sur l'image originale, avec les résultats suivants:
- Zones bien éclairées (en vert): ${lightingAnalysis.lightingMap.bright.percentage}% de l'image
- Zones moyennement éclairées (en jaune): ${lightingAnalysis.lightingMap.medium.percentage}% de l'image
- Zones sombres (en rouge): ${lightingAnalysis.lightingMap.dark.percentage}% de l'image

${lightingAnalysis.assessment}`;

    // Create problem-solution pairs mapping
    // const problemsList = problemsSummary.split(',').map(p => p.trim());
    // const solutionsList = solutionsSummary.split(',').map(s => s.trim());
    
    // Build problem-solution mapping with clearer instructions
    // let improvementMapping = "";
    
    // for (let i = 0; i < problemsList.length; i++) {
      
    //   const solution = i < solutionsList.length
    //     ? solutionsList[i]
    //     : "Amélioration générale de l'espace";
      
    //   improvementMapping += `${i+1}. Problème: "${problemsList[i]}" → Application visuelle: "${solution}"\n`;
    // }

    // Enhanced user prompt with lighting instructions
//     const userPrompt = `Description de l'espace original:
// ${descriptionImageOriginale}



// Créez une visualisation photoréaliste qui intègre les améliorations suivantes:

// ${improvementMapping}

// CONSIGNES IMPORTANTES:
// - Conservez exactement la même perspective, angle de vue et structure architecturale de base
// - Rendez les changements clairement visibles et harmonieux
// - La visualisation doit être photoréaliste et professionnelle
// - Respectez le style général de l'espace tout en l'améliorant

// AMÉLIORATIONS D'ÉCLAIRAGE SPÉCIFIQUES:
// - Zones vertes (${lightingAnalysis.lightingMap.bright.percentage}% de l'image): Maintenir le bon niveau d'éclairage existant
// - Zones jaunes (${lightingAnalysis.lightingMap.medium.percentage}% de l'image): Renforcer légèrement l'éclairage pour une meilleure visibilité
// - Zones rouges (${lightingAnalysis.lightingMap.dark.percentage}% de l'image): Ajouter des sources d'éclairage significatives pour éliminer les zones d'ombre

// Cette visualisation sera utilisée pour montrer un "avant/après" réaliste et convaincant.`;

//     // Log the prompts to verify lighting analysis usage
//     console.log("\n--- System Prompt for Image Generation ---");
//     console.log(systemPrompt);
//     console.log("--- User Prompt Lighting Instructions for Image Generation ---");
//     console.log(`AMÉLIORATIONS D'ÉCLAIRAGE SPÉCIFIQUES:
// - Zones vertes (${lightingAnalysis.lightingMap.bright.percentage}% de l'image): Maintenir le bon niveau d'éclairage existant
// - Zones jaunes (${lightingAnalysis.lightingMap.medium.percentage}% de l'image): Renforcer légèrement l'éclairage pour une meilleure visibilité
// - Zones rouges (${lightingAnalysis.lightingMap.dark.percentage}% de l'image): Ajouter des sources d'éclairage significatives pour éliminer les zones d'ombre`);
//     console.log("-----------------------------------------\n");
//     console.log(analysis.enhanced3DPrompt)
//     console.log(analysis)

//     // Combine system and user prompts
//     const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;
//     // Create the enhanced 3D generation prompt
//     const enhanced3DPrompt = `
// GÉNÉRATION DE VISUALISATION ARCHITECTURALE 3D:

// ${analysis.enhanced3DPrompt}

// SPÉCIFICATIONS TECHNIQUES DE LA PIÈCE:
// - Nom de la pièce: ${analysis.architecturalAnalysis.roomName || 'Pièce'}
// - Surface totale: ${analysis.architecturalAnalysis.area || 'Non spécifiée'}
// - Dimensions: ${analysis.architecturalAnalysis.dimensions?.width || 'Largeur non spécifiée'} × ${analysis.architecturalAnalysis.dimensions?.length || 'Longueur non spécifiée'}

// MOBILIER ET AMÉNAGEMENT:
// ${analysis.architecturalAnalysis.furniture?.map(item => 
//   `- ${item.quantity} ${item.type}${item.quantity > 1 ? 's' : ''}`
// ).join('\n') || '- Aucun mobilier spécifié'}

// POSITIONNEMENT DU MOBILIER:
// ${analysis.precise3DDescription.furniture?.map(item => 
//   `- ${item.type}: ${item.position}`
// ).join('\n') || '- Positionnement standard'}

// SPÉCIFICATIONS ARCHITECTURALES:
// - Hauteur sous plafond: ${analysis.precise3DDescription.height || '2.7m (standard)'}
// - Épaisseur des murs: ${analysis.precise3DDescription.details?.wallThickness || '200mm (standard)'}
// - Matériaux de construction: ${analysis.precise3DDescription.details?.constructionMaterial || 'Matériaux standards'}
// - Position des fenêtres: ${analysis.architecturalAnalysis.features?.windowPosition || 'À déterminer selon le plan'}
// - Position des portes: ${analysis.architecturalAnalysis.features?.doorPosition || 'À déterminer selon le plan'}

// QUALITÉ DE RENDU:
// - Qualité: Photoréaliste, qualité visualisation architecturale professionnelle
// - Éclairage: Lumière naturelle du jour avec ombres douces, éclairage architectural professionnel
// - Caméra: Vue en perspective montrant l'aménagement complet de l'espace
// - Résolution: Haute définition adaptée pour présentation architecturale
// - Style: Visualisation architecturale propre et professionnelle
// - Matériaux: Textures et finitions réalistes appropriées au type de bâtiment

// EXIGENCES DE PRÉCISION:
// - Maintenir les proportions exactes du plan 2D: ${analysis.architecturalAnalysis.dimensions?.width || 'Largeur'} × ${analysis.architecturalAnalysis.dimensions?.length || 'Longueur'}
// - Préserver tous les agencements de pièces et connexions comme indiqué sur le dessin original
// - Positionner portes et fenêtres exactement comme spécifié dans le plan 2D
// - Appliquer les hauteurs de plafond standard et conventions architecturales
// - Assurer l'intégrité structurelle et détails de construction réalistes

// CONTRÔLE QUALITÉ:
// - ${analysis.qualityAssurance.dimensionCheck || 'Vérifier que toutes les dimensions correspondent au plan 2D'}
// - ${analysis.qualityAssurance.materialCheck || 'Attribuer des textures réalistes à toutes les surfaces'}
// - ${analysis.qualityAssurance.structuralAccuracy || 'Confirmer que le positionnement correspond à lagencement'}

// QUALITÉ VISUELLE:
// - Style de rendu architectural professionnel
// - Éclairage équilibré avec ambiance naturelle
// - Présentation propre et épurée
// - Matériaux et textures réalistes
// - Angle de vue optimal pour mettre en valeur l'agencement de l'espace

// Générer une visualisation architecturale 3D précise qui pourrait être utilisée comme référence de construction, en maintenant une fidélité absolue au dessin architectural 2D original.
// `;
console.log('nepoo')
console.log('base64Image',base64Image)
// console.log("Enhanced 3D Prompt for Image Generation:", enhanced3DPrompt);
const newprop=`Create a stunning, photorealistic 3D architectural visualization that looks like a high-end interior design render.

TECHNICAL REQUIREMENTS:
- Use EXACT dimensions and positions from the analysis
- Maintain architectural accuracy and proportions
- Include proper lighting and shadows
- Show materials and textures realistically

VISUAL STYLE:
- Modern, clean architectural photography style
- Soft, natural lighting with subtle shadows
- Neutral color palette with warm accents
- Professional interior design aesthetic
- Isometric or 3/4 perspective view
- High-end architectural visualization quality

ANALYSIS DATA:
${JSON.stringify(analysis, null, 2)}

STRICT RULES:
...
- Render the scene from a wide-angle camera, slightly above eye level, positioned to show the entire room and all features.
- Use bright, natural daylight. Make the image full of vibrant, realistic colors.
- The style should be photorealistic, lively, and inviting, like a professional interior design magazine photo.
- Do not crop or cut off furniture or features; everything should be visible.
...
1. DO NOT add any elements not mentioned in the analysis
2. Use EXACT dimensions provided
3. Position elements precisely as specified
4. Maintain proper scale relationships
5. Include all specified openings (doors/windows)
6. Respect the functional zoning described

Generate a single, cohesive 3D interior view that could serve as a construction reference.`;;

console.log('newprop',newprop)
console.log("Analysis Object:", analysis);

 

    // first model
    //  const response = await together.images.create({
    //   model: "black-forest-labs/FLUX.1-schnell",
    //   prompt: newprop,
    //   n: 1,
    //   height: 512,
    //   width: 512,
    // })
    //  const  generatedImage = response.data[0].url

// const response = await together.images.create({
//   model: "black-forest-labs/FLUX.1-depth",
//   prompt: "Cats eating popcorn",
//   steps: 10,
//   n: 4
// });
// const  generatedImage = response.data[0].b64_json

    // return {
    //   success: true,
    //   generatedImage: response.data[0].url,
    // FIXED: Use correct size parameter for GPT-image-1

    // const response = await openai.images.generate({
    //   model: "gpt-image-1",
    //  prompt: newprop,
    //   n: 1,
    //   size: "1024x1024", // Reduce resolution
    //   quality: "low", // Lower quality level
    //   output_format: "jpeg" // Smaller output format
    // });
    // console.log("Image generation response:", response);

    // // Create a data URI from the base64 string so it can be used directly in an <img> src
    // const generatedImage = response.data[0].b64_json 
    //   ? `data:image/png;base64,${response.data[0].b64_json}`
    //   : null;
    const response = await openai.images.generate({
            model: "dall-e-3", // or "dall-e-2" if you prefer
      prompt: newprop,
      n: 1, // Number of images
      size: "1024x1024", // Available sizes: "256x256", "512x512", "1024x1024" for DALL-E 2
                          // For DALL-E 3: "1024x1024", "1792x1024", "1024x1792"
      response_format: "url", // "url" or "b64_json"
      quality: "standard", // "standard" or "hd" (DALL-E 3 only)
      style: "vivid" // "vivid" or "natural" (DALL-E 3 only)
        });
       const generatedImage =  response.data[0].url

    console.log("Generated image URL:", response.data[0].url); // Will be undefined, which is expected
    console.log("Generated image base64:", generatedImage ? "Available and formatted" : "Not available");
    console.log(generatedImage)

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