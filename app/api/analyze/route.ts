import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';

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

    const systemPrompt = `Vous êtes un expert en décoration d'intérieur et design d'espaces. Votre tâche est d'analyser des images d'espaces et de fournir des observations détaillées ainsi que des suggestions d'amélioration en format JSON structuré. \nVos observations doivent être pertinentes, spécifiques à l'image et fondées sur des principes de design. \nVos suggestions doivent être créatives, réalisables et appropriées au contexte visible dans l'image.\nVous devez toujours répondre avec un JSON valide sans aucun texte avant ou après.`;

    const userPrompt = `Analysez cette image d'espace et fournissez un objet JSON comprenant:\n\n1. "descriptionImageOriginale": une brève description objective de l'espace visualisé.\n\n2. "problems": un tableau d'au moins 3 observations constructives. Chaque élément doit contenir:\n   - "title": un titre court et précis du problème\n   - "description": une explication détaillée du problème\n   - "severity": évaluation de l'importance ("faible", "moyen", ou "élevé")\n\n3. "solutions": un tableau avec au moins une solution pour chaque problème identifié. Chaque solution doit avoir:\n   - "title": un titre clair\n   - "description": une explication détaillée de la solution\n   - "cost": estimation du coût ("faible", "moyen", "élevé")\n   - "implementationTime": temps de mise en œuvre estimé ("jours", "semaines", "mois")\n   - "impact": impact prévu de la solution ("faible", "moyen", "élevé")\n\nVotre réponse doit être UNIQUEMENT l'objet JSON valide, sans texte avant ou après.`;

    const response = await together.chat.completions.create({
      model: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
    });

    const analysisText = response.choices[0].message.content;
    let analysisJson: any = null;

    // Try to parse JSON from the response
    try {
      // Try direct parse
      analysisJson = JSON.parse(analysisText);
    } catch {
      // Try to extract JSON block
      const jsonPattern = /\{[\s\S]*\}/;
      const jsonMatch = analysisText.match(jsonPattern);
      if (jsonMatch && jsonMatch[0]) {
        try {
          analysisJson = JSON.parse(jsonMatch[0]);
        } catch {}
      }
    }

    if (!analysisJson) {
      return NextResponse.json({ success: false, error: 'Failed to parse AI response', rawResponse: analysisText }, { status: 500 });
    }

    // Validate structure
    if (!analysisJson.descriptionImageOriginale || !Array.isArray(analysisJson.problems) || !Array.isArray(analysisJson.solutions)) {
      return NextResponse.json({ success: false, error: 'AI response missing required fields', receivedStructure: Object.keys(analysisJson), rawResponse: analysisText }, { status: 500 });
    }

    return NextResponse.json({ success: true, analysis: analysisJson });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error', stack: error.stack }, { status: 500 });
  }
} 