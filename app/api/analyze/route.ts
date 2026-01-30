import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { jsonrepair } from 'jsonrepair';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract JSON block from AI response
function extractJsonBlock(text: string): string | null {
  // Remove markdown code blocks
  text = text.replace(/```json|```/g, '').trim();
  
  // Extract JSON block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  
  let jsonText = jsonMatch[0];
  
  // Multiple cleanup passes for common AI JSON issues
  
  // 1. Fix malformed quotes around values like "1:"100"" -> "1:100"
  jsonText = jsonText.replace(/"([^"]*)"([^"]*)""/g, '"$1$2"');
  
  // 2. Fix decimal values with quotes like "15".15 -> "15.15"
  jsonText = jsonText.replace(/"(\d+)"\.(\d+)/g, '"$1.$2"');
  
  // 3. Fix scale notation like 1:"100" -> "1:100"
  jsonText = jsonText.replace(/(\d+):"(\d+)"/g, '"$1:$2"');
  
  // 4. Fix numbers with measurement units that aren't quoted
  jsonText = jsonText.replace(/([:]\s*)(\d+(?:\.\d+)?\s*[a-zA-Z]+)(?!["])/g, '$1"$2"');
  
  // 5. Fix standalone numbers that should be strings (measurements)
  jsonText = jsonText.replace(/([:]\s*)(\d+(?:\.\d+)?)\s*(?=\s*[,}])/g, function(match, colon, number) {
    // Only quote if it looks like a measurement (context-based)
    if (parseFloat(number) < 1000 && parseFloat(number) > 0) {
      return `${colon}"${number}"`;
    }
    return match;
  });
  
  return jsonText;
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ success: false, error: 'Missing imageBase64' }, { status: 400 });
    }

    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const base64Image = imageBase64.includes('base64,')
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    const systemPrompt = `You are an expert architectural visualization specialist with expertise in converting 2D floor plans and architectural drawings into accurate 3D representations. Your primary objective is to maintain absolute fidelity to the original 2D design while creating realistic 3D visualizations.

Key principles:
- Preserve ALL original dimensions, proportions, and spatial relationships
- Maintain exact room layouts, door/window positions, and architectural elements
- Apply standard architectural conventions for height, depth, and construction details
- Ensure structural accuracy and realistic material representation
- Create photorealistic 3D renderings that could serve as construction references

You must analyze the 2D architectural drawing with precision and generate detailed 3D conversion instructions.

IMPORTANT: Return ONLY valid JSON. All string values must be properly quoted. Numbers with units should be strings (e.g., "100mm", "2.5m"). Scale notations should be strings (e.g., "1:100").`;

    // Enhanced user prompt with explicit JSON formatting instructions
    const userPrompt = `Analyze this 2D architectural drawing and provide a comprehensive JSON response for accurate 3D conversion.

Given the attached 2D architectural drawing, analyze it and return ONLY a valid JSON object with the following structure (no Markdown, no explanation, no text before or after):

{
  "architecturalAnalysis": { ... },
  "precise3DDescription": { ... },
  "qualityAssurance": { ... },
  "enhanced3DPrompt": "..."
}

All string values must be quoted, numbers with units must be strings (e.g., "100mm"), and scale notations must be strings (e.g., "1:100").
Return ONLY the JSON object, nothing else.`;
const realprompt=`
I have a 2D architectural plan of a room that I need analyzed and described in detail. Here's what I want you to focus on:

Room Dimensions:

Identify and specify the total area, width, and length of the room (if dimensions are provided).

Room Layout:

Describe the arrangement of furniture or fixtures, such as tables, chairs, kitchen counters, sinks, stoves, or cabinets.

Note the placement of any doors, windows, or other openings.

Functional Zones:

Explain how the space is divided or utilized (e.g., kitchen area, dining area).

Additional Details:

Mention any relevant annotations, symbols, or architectural details present in the plan (e.g., color-coded areas, labels, or measurements).

Output Format:

Provide a clear, concise description that I can use as input for generating a 3D visualization of the room.

Once you've analyzed the plan and provided a description, I'll use it to generate a 3D model of the space.
i want the response to be in json format
`
const newwprompt = `
I have a 2D architectural plan of a space that I need analyzed in detail. Your task is to describe every detail of the plan as accurately as possible. Focus on the following:
### Room Dimensions:
- Provide the total area, width, and length of the entire space.
- For each room or zone, specify the name, dimensions (width and length), and area. Include the unit of measurement (e.g., cm, m²).
### Room Layout:
- List all furniture and fixtures in each room. Specify their types, dimensions, and positions relative to walls or other features in the room (e.g., "Bed: 200x160 cm, placed against the North wall").
- For each furniture or fixture, also specify its position relative to other nearby elements (e.g., "Dining table: adjacent to the kitchen counter, 1 meter from the stove").
- Identify the location, type, and dimensions of all openings (doors, windows, etc.), and indicate their orientation (e.g., "North-facing window").
### Functional Zones:
- Clearly explain how the space is divided into functional zones (e.g., living area, kitchen area, dining area).
- For each zone, describe its purpose and the items or features that define it.
### Additional Details:
- Include any annotations or symbols from the plan, such as decorative features, labels, or dimensions.
- If there are outdoor spaces (e.g., garden or courtyard), provide their dimensions and describe any features (e.g., plants, paths, furniture).
### Output Format:
Return the response in JSON format with the following structure:
\`\`\`json
{
  "roomDimensions": {
    "totalWidth": "number",
    "totalLength": "number",
    "totalArea": "number",
    "unit": "string"
  },
  "rooms": [
    {
      "name": "string",
      "area": "number",
      "dimensions": {
        "width": "number",
        "length": "number"
      },
      "furniture": [
        {
          "type": "string",
          "dimensions": "string",
          "position": "string",
          "relativeTo": "string"
          
        }
      ]
    }
  ],
  "functionalZones": [
    {
      "zone": "string",
      "area": "number",
      "features": ["string"],
      "connects": ["string"]
      "relativeTo": "string"

    }
  ],
  "doorsAndWindows": [
    {
      "type": "string",
      "location": "string",
      "dimensions": "string",
      "orientation": "string"
      "relativeTo": "you have to include the position of the door or window  other features with mush details"

    }
  ],
  "additionalDetails": {
    "annotations": ["string"],
    "outdoorFeatures": [
      {
        "type": "string",
        "dimensions": "string",
        "details": "string"
      }
    ]
  }
}

\`\`\`
`;

    // const response = await together.chat.completions.create({
    //   model: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
    //   max_tokens: 2048,
    //   temperature: 0.3,
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     {
    //       role: 'user',
    //       content: [
    //         { type: 'text', text: newwprompt },
    //         { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
    //       ],
    //     },
    //   ],
    // });
       const response = await openai.chat.completions.create({
    model: "gpt-4o", // ou "gpt-4-vision-preview"
    messages: [
      {
        role: "user",
        content: [
          // { type: "text", text:`${systemPrompt} ${userPrompt}`  },
          { type: "text", text:newwprompt  },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ]
  });
    const analysisText = response.choices[0].message.content;
    console.error("RAW AI RESPONSE:", analysisText); // Log the raw response for debugging
    let analysisJson: any = null;

    // Robust JSON extraction: strip markdown/code block markers, extract first { ... }
    const jsonBlock = extractJsonBlock(analysisText);
    if (jsonBlock) {
      try {
        analysisJson = JSON.parse(jsonBlock);
      } catch (e) {
        try {
          analysisJson = JSON.parse(jsonrepair(jsonBlock));
        } catch (e2) {
          console.error("JSON parse/repair error:", e2);
          analysisJson = null;
        }
      }
    }

    if (!analysisJson) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to parse AI response', 
        rawResponse: analysisText 
      }, { status: 500 });
    }

    // Optionally, validate the new 3D structure here
    // Example (uncomment if you want strict validation):
    // if (!analysisJson.architecturalAnalysis || !analysisJson.precise3DDescription || !analysisJson.qualityAssurance || !analysisJson.enhanced3DPrompt) {
    //   return NextResponse.json({ success: false, error: 'Invalid response structure' }, { status: 500 });
    // }

    return NextResponse.json({ success: true, analysis: analysisJson });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Server error', 
      stack: error.stack 
    }, { status: 500 });
  }
}