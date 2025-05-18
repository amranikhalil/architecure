"use server"

import Together from "together-ai"

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

    try {
      // First try: extract JSON using regex for most common pattern
      const jsonPattern = /\{[\s\S]*\}/;
      const jsonMatch = analysisText.match(jsonPattern);
      
      if (jsonMatch && jsonMatch[0]) {
        console.log("Attempting to parse JSON with primary method:", jsonMatch[0].substring(0, 100) + "...");
        analysisJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON block found with primary method");
      }
    } catch (parseError) {
      console.error("Error parsing AI response JSON with primary method:", parseError);
      
      // Second try: clean up markdown and other formatting
      try {
        const cleanedText = analysisText
          .replace(/```json|```/g, '')  // Remove markdown code blocks
          .replace(/^[\s\S]*?(\{)/m, '{')  // Remove any text before first {
          .replace(/\}[\s\S]*$/m, '}')     // Remove any text after last }
          .trim();
          
        if (cleanedText.startsWith('{') && cleanedText.endsWith('}')) {
          console.log("Attempting to parse JSON with secondary method:", cleanedText.substring(0, 100) + "...");
          analysisJson = JSON.parse(cleanedText);
        } else {
          throw new Error("Secondary JSON extraction failed");
        }
      } catch (secondaryError) {
        // Third try: handle case where model might have wrapped the JSON in quotes
        try {
          const unquotedText = analysisText
            .replace(/^["']|["']$/g, '')  // Remove surrounding quotes
            .replace(/\\"/g, '"')         // Replace escaped quotes
            .trim();
            
          if (unquotedText.startsWith('{') && unquotedText.endsWith('}')) {
            console.log("Attempting to parse JSON with tertiary method:", unquotedText.substring(0, 100) + "...");
            analysisJson = JSON.parse(unquotedText);
          } else {
            throw new Error("Tertiary JSON extraction failed");
          }
        } catch (tertiaryError) {
          return {
            success: false,
            error: `Failed to parse AI analysis. Detail: ${parseError.message}.`,
            rawResponse: analysisText // Include raw response for debugging
          };
        }
      }
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
 * Generates an improved version of an architectural image.
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

    const problemsSummary = problems.map(p => p.title).join(", ")
    const solutionsSummary = solutions.map(s => s.title).join(", ")

    // System prompt that defines the AI's role without examples
    const systemPrompt = `Vous êtes un expert en design d'intérieur et visualisation 3D qui crée des rendus réalistes d'espaces améliorés. 
Votre tâche est de générer une visualisation photoréaliste qui montre l'espace avec les améliorations suggérées, tout en préservant la structure, l'échelle et la perspective originales.`;

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

    // User prompt with focused instructions on visual transformation
    const userPrompt = `Description de l'espace original:
${descriptionImageOriginale}

Créez une visualisation photoréaliste qui intègre les améliorations suivantes:

${improvementMapping}

CONSIGNES IMPORTANTES:
- Conservez exactement la même perspective, angle de vue et structure architecturale de base
- Rendez les changements clairement visibles et harmonieux
- La visualisation doit être photoréaliste et professionnelle
- Respectez le style général de l'espace tout en l'améliorant

Cette visualisation sera utilisée pour montrer un "avant/après" réaliste et convaincant.`;

    // Combine system and user prompts
    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell",
      prompt: combinedPrompt,
      n: 1,
      height: 512,
      width: 512,
    })

    return {
      success: true,
      generatedImage: response.data[0].url,
    }
  } catch (error) {
    console.error("Error generating improved version:", error)
    return {
      success: false,
      error: error.message || "Failed to generate improved version",
      stack: error.stack
    }
  }
}