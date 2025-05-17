"use server"

import Together from "together-ai"

export async function analyzeArchitecturalImage(imageBase64) {
  try {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    })

    // Strip the data URL prefix if present
    const base64Image = imageBase64.includes("base64,")
      ? imageBase64.split("base64,")[1]
      : imageBase64

    // Prepare the prompt for architectural observations
    const systemPrompt = `You are a JSON data generation service.
    Based on the provided image, you MUST output ONLY a single JSON object.
    Your entire response MUST start with '{' and end with '}'. No other text, explanations, or markdown are allowed before or after the JSON object.
    
    The JSON object MUST follow this exact structure. Fill in the placeholder string values:
    {
      "problems": [
        {
          "title": "string_placeholder_for_observation_1_title",
          "description": "string_placeholder_for_observation_1_description",
          "severity": "string_placeholder_for_observation_1_severity (e.g., high, medium, low)"
        }
        // Add more problem objects here if multiple observations are made, following the same structure.
        // If no specific observations, this array can be empty or contain a placeholder object.
      ],
      "solutions": [
        {
          "title": "string_placeholder_for_suggestion_1_title",
          "description": "string_placeholder_for_suggestion_1_description",
          "cost": "string_placeholder_for_suggestion_1_cost (e.g., high, medium, low)",
          "implementationTime": "string_placeholder_for_suggestion_1_time (e.g., months, weeks, days)",
          "impact": "string_placeholder_for_suggestion_1_impact (e.g., high, medium, low)"
        }
        // Add more solution objects here if multiple suggestions are made, following the same structure.
        // If no specific suggestions, this array can be empty or contain a placeholder object.
      ]
    }
    
    Replace ALL string_placeholder_for... values with actual information derived from the image. If certain information isn't applicable or found, use a concise placeholder like "N/A" or an empty string for that value, but maintain the JSON structure.
    CRITICAL: Your response must be ONLY this JSON object. Verify it is valid JSON before outputting.`

    const userPrompt = "Provide your analysis of the image SOLELY in the JSON format specified by your system instructions."

    // Call the Together AI API with the Llama 3.2 Vision model
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      max_tokens: 2048,
      messages: [
        {
          role: "system",
          content: systemPrompt,
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

    // Parse the JSON response more robustly
    const analysisText = response.choices[0].message.content;
    let analysisJson;

    try {
      // Attempt to find and parse JSON block, handling potential surrounding text or markdown
      const jsonMatch = analysisText.match(/\{.*\}/s);
      if (jsonMatch && jsonMatch[0]) {
        analysisJson = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if no clear JSON block is found, try direct parse (might fail as before)
        // Or, more likely, the model didn't follow instructions at all.
        throw new Error("No valid JSON block found in the AI response. Response was: " + analysisText.substring(0, 100) + "...");
      }
    } catch (parseError) {
      console.error("Error parsing AI response JSON:", parseError);
      console.error("Original AI response text was:", analysisText);
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
      error: error.message || "Failed to analyze image",
    }
  }
}

export async function generateImprovedVersion(imageBase64, problems, solutions) {
  try {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    })

    // Strip the data URL prefix if present
    const base64Image = imageBase64.includes("base64,")
      ? imageBase64.split("base64,")[1]
      : imageBase64

    // Prepare a concise summary of the problems and solutions
    const problemsSummary = problems.map(p => p.title).join(", ")
    const solutionsSummary = solutions.map(s => s.title).join(", ")

    // Create the prompt for image generation
    const systemPrompt = `You are an expert architectural designer specialized in creating improved designs based on existing spaces. 
    Generate a realistic architectural visualization showing the same space but with all the suggested improvements applied.`

    const userPrompt = `This is an image of an architectural space that has the following problems: ${problemsSummary}.

I want you to visualize the same space after implementing these solutions: ${solutionsSummary}.

Generate a photorealistic visualization of the improved space that clearly shows how the implemented solutions address the identified problems. 
Maintain the same perspective and basic structure of the space.`

    // Call the Together AI API with a generative model
    // Note: This is a placeholder as Together AI might use different endpoints or methods for image generation
    // Attempting to use 'together.images.create' as 'generate' is not a function
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell", // Switched to a dedicated image generation model
      prompt: userPrompt,
      // reference_image: `data:image/jpeg;base64,${base64Image}`, // Temporarily commented out to test base functionality
      n: 1, // Standard parameter for number of images, often 'n'
      height: 512,
      width: 512,
      // You might need to add other parameters like 'steps', 'cfg_scale' depending on the API requirements
    })

    // The response would typically include the generated image as base64
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