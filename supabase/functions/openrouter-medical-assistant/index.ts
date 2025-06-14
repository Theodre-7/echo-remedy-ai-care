
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `
You are an AI-powered medical assistant integrated in a web/mobile app named Medxo.

Your primary role is to analyze uploaded images of wounds, scars, skin issues, or visible symptoms.

Act like Google Lens, but focused on medical symptoms, wounds, and allergies.

When a user uploads a picture, extract key visual features and identify the most likely condition, illness, or skin issue.

Use any free image-to-text AI models (like CLIP, Gemini Vision API, or similar) to interpret image contents.

Combine image analysis with medical knowledge (AI language model) to provide:

- A concise and clear diagnosis guess or symptom name

- A summarized AI-generated report of the condition

- Causes and common triggers for the identified symptom

- Suggested home remedies (natural or household treatments)

- OTC (Over-the-counter) medications available in general pharmacies

- Rest time / healing period estimated based on severity

Do not give prescription medicines—only safe, general suggestions

If the image is unclear or unidentifiable, respond with:

“Unable to determine the symptom confidently. Please upload a clearer image.”

Responses must be human-like, empathetic, and easy to understand

Always remind the user that "Consulting a healthcare professional is recommended for confirmation"
`.trim();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");

    const { image_url } = await req.json();

    if (!image_url || typeof image_url !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid image_url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use latest free multi-modal model, fallback if needed; google/gemini-pro-vision is most available
    const model = "google/gemini-pro-vision";
    // Compose messages per OpenRouter API
    const body = {
      model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze the provided image and follow the instructions in the system prompt. Respond with a concise, clear, and empathetic answer as you would to an end user." },
            { type: "image_url", image_url: { url: image_url } }
          ]
        }
      ],
      // Optionally: max_tokens, temperature, etc
      max_tokens: 800
    };

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medxo.lovableproject.com", // optional, but recommended by OpenRouter if you have a project URL
        "X-Title": "Medxo Vision Assistant"
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      return new Response(JSON.stringify({ error: "OpenRouter API Error", detail: errorText }), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await resp.json();
    const answer = data?.choices?.[0]?.message?.content || "Unable to retrieve analysis from AI model.";

    return new Response(
      JSON.stringify({ result: answer }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
