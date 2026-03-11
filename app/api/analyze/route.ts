import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ success: false, error: 'Missing imageBase64' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const base64Image = imageBase64.includes('base64,')
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    const systemPrompt = `Vous êtes un expert en décoration d'intérieur. Répondez UNIQUEMENT avec un objet JSON valide.`;

    const userPrompt = `Analysez cette image d'espace et fournissez un objet JSON comprenant:
    1. "descriptionImageOriginale": une brève description objective.
    2. "problems": un tableau d'au moins 3 observations (title, description, severity).
    3. "solutions": un tableau avec solutions (title, description, cost, implementationTime, impact).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: "low" },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    // --- LA CORRECTION EST ICI ---
    const rawContent = response.choices[0].message.content;
    if (!rawContent) {
        return NextResponse.json({ success: false, error: "L'IA n'a pas renvoyé de contenu" }, { status: 500 });
    }

    // On parse une seule fois
    const analysisJson = JSON.parse(rawContent);

    // Validation simple de la structure
    if (!analysisJson.descriptionImageOriginale || !Array.isArray(analysisJson.problems)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Structure JSON invalide', 
        rawResponse: rawContent 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, analysis: analysisJson });

  } catch (error: any) {
    console.error("Erreur API:", error);
    return NextResponse.json({ 
        success: false, 
        error: error.message || 'Server error' 
    }, { status: 500 });
  }
}