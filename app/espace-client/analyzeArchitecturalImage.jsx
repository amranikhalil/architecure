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

    const userPrompt = `S'il vous plaît, analysez attentivement l'image architecturale ci-jointe.\nFournissez votre analyse intégralement en FRANÇAIS et sous la forme d'un objet JSON.\nCet objet JSON doit contenir les clés suivantes :\n1. 
     "descriptionImageOriginale": une chaîne de caractères décrivant brièvement l'image.\n2. 
      "problems": un tableau d'objets. Chaque objet doit avoir les clés "title" (chaîne),
       "description" (chaîne), et "severity" (valeurs possibles : "faible", "moyen", "élevé"). Si aucun problème n'est identifié, ce doit être un tableau vide [].\n3.  
       "solutions": un tableau d'objets. Chaque objet doit avoir les clés "title" (chaîne), "description" (chaîne), "cost" (valeurs : "faible", "moyen", "élevé"),
        "implementationTime" (valeurs : "jours", "semaines", "mois"), et "impact" (valeurs : "faible", "moyen", "élevé"). Si aucune solution n'est identifiée, ce doit être un tableau vide [].\n\nVotre réponse doit être UNIQUEMENT l'objet JSON.
         N'ajoutez aucun texte explicatif avant ou après l'objet JSON.\nPar exemple, 
         un problème pourrait être : { "title": "Isolation thermique", "description": "Les fenêtres semblent anciennes et pourraient causer des pertes de chaleur.", 
         "severity": "moyen" }\nUne solution pourrait être : { "title": "Remplacer les fenêtres", "description": "Installer des fenêtres à double vitrage pour améliorer l'isolation.",
          "cost": "élevé", "implementationTime": "semaines", "impact": "élevé" }\nAnalysez l'image et générez le JSON.`;

    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      max_tokens: 2048,
      temperature: 0, // Pour une sortie déterministe et moins "créative"
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt, // This now refers to the comprehensive userPrompt defined above
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
      const jsonMatch = analysisText.match(/\{.*\}/s);
      if (jsonMatch && jsonMatch[0]) {
        console.log("Attempting to parse JSON:", jsonMatch[0]); // Log the JSON string before parsing
        analysisJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON block found in the AI response. Response was: " + analysisText + "...");
      }
    } catch (parseError) {
      console.error("Error parsing AI response JSON:", parseError);
      return {
        success: false,
        error: `Failed to parse AI analysis. Detail: ${parseError.message}. Response started with: ${analysisText.substring(0,100)}...`,
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
      error: error.message || "Failed to analyze ima",
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

    // System prompt that defines the AI's role
    const systemPrompt = `Tu es un architecte expert spécialisé dans la rénovation et l'amélioration d'espaces existants. 
Génère une **visualisation architecturale réaliste** montrant le même espace mais **amélioré**, avec les **solutions suggérées appliquées.**
Respecte la même **perspective, orientation, et structure générale.**`;

    // Create problem-solution pairs mapping
    const problemsList = problemsSummary.split(',').map(p => p.trim());
    const solutionsList = solutionsSummary.split(',').map(s => s.trim());
    
    // Build problem-solution mapping as plain string to avoid template literal issues
    let problemSolutionMapping = `- Problème: ${problemsList[0]} → Solution: ${solutionsList[0]}\n`;
    
    // Add remaining problem-solution pairs
    for (let i = 1; i < problemsList.length; i++) {
      const solution = i < solutionsList.length 
        ? solutionsList[i] 
        : "Amélioration générale de l'espace";
      
      problemSolutionMapping += `- Problème: ${problemsList[i]} → Solution: ${solution}\n`;
    }

    // User prompt that combines the inputs with instructions and emphasizes problem-solution mapping
    const userPrompt = `Description de l'image originale :
${descriptionImageOriginale}

L'image actuelle présente les problèmes suivants :
${problemsSummary}

Je souhaite voir ces problèmes résolus avec les solutions spécifiques suivantes :
${problemSolutionMapping}
Génère une visualisation photoréaliste du même espace après la mise en œuvre de ces solutions.
La nouvelle image doit clairement montrer comment chaque modification proposée corrige spécifiquement le défaut correspondant, tout en respectant la description et les caractéristiques principales de l'image originale. Maintenez la même perspective et structure de base de l'espace.`;

    // Combine system and user prompts for better context
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
    }
  }
}