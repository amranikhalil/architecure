// Chat Completions Implementation
import Together from "together-ai";

// Make sure to use your API key
const apiKey = process.env.TOGETHER_API_KEY || "your_api_key_here";
const together = new Together({ apiKey });

// Example chat completion function
export async function generateChatResponse(userMessage) {
  try {
    // Using a supported model - "meta-llama/Llama-3.2-90B-Instruct" instead of Vision variant
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "meta-llama/Llama-3.2-70B-Instruct", // Using available model
      max_tokens: 1024
    });
    
    return {
      success: true,
      content: response.choices[0].message.content
    };
  } catch (error) {
    console.error("Error generating chat response:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during chat generation"
    };
  }
}

// Image Generation Implementation
export async function generateImage(prompt, n = 1) {
  try {
    const apiKey = process.env.TOGETHER_API_KEY || "your_api_key_here";
    
    if (!apiKey) {
      console.error("TOGETHER_API_KEY environment variable is missing or empty");
      return {
        success: false,
        error: "API key not configured. Please check server configuration."
      };
    }

    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt:", prompt);
      return {
        success: false,
        error: "A valid text prompt is required."
      };
    }

    const together = new Together({ apiKey });
    const numImages = Math.max(1, Math.min(4, Number(n) || 1));
    
    // Using a confirmed working model
    console.log("Sending request to Together API with:", {
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo", // Updated model name
      prompt: prompt,
      n: numImages
    });

    const response = await together.images.generate({ // Using .generate() instead of .create()
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo", // Updated model name
      prompt: prompt,
      n: numImages
    });

    console.log("Raw API response:", JSON.stringify(response));

    if (!response) {
      console.error("Empty API response");
      return {
        success: false,
        error: "Received an empty response from the image generation API."
      };
    }

    // Processing the response based on Together AI's format
    let imageUrls = [];
    
    if (response.images && Array.isArray(response.images)) {
      // Extract base64 data from the images array
      const imageData = response.images.map(img => img.data);
      
      return {
        success: true,
        images: imageData
      };
    } else if (response.data && Array.isArray(response.data)) {
      // Extract URLs if present
      imageUrls = response.data
        .filter(img => img && img.url)
        .map(img => img.url);
        
      if (imageUrls.length > 0) {
        return {
          success: true,
          imageUrls: imageUrls
        };
      }
      
      // Try for base64 data
      const imageData = response.data
        .filter(img => img && img.b64_json)
        .map(img => img.b64_json);
        
      if (imageData.length > 0) {
        return {
          success: true,
          images: imageData
        };
      }
    }
    
    console.error("No image URLs or data found in response:", response);
    return {
      success: false,
      error: "No valid image URLs or data found in the API response."
    };
  } catch (error) {
    console.error("Error generating image:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during image generation"
    };
  }
}

// Usage examples:
// For chat:
// const chatResult = await generateChatResponse("What are some fun things to do in New York?");
// console.log(chatResult.content);

// For image:
// const imageResult = await generateImage("A serene landscape with mountains and a lake");
// if (imageResult.success) {
//   console.log(imageResult.images || imageResult.imageUrls);
// }