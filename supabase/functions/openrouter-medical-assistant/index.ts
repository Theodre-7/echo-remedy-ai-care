
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const IMAGE_SYSTEM_PROMPT = `
You are an AI-powered medical assistant integrated in a web/mobile app named Medxo.
Your primary role is to analyze uploaded images of wounds, scars, skin issues, or visible symptoms.
Act like Google Lens, but focused on medical symptoms, wounds, and allergies.
When a user uploads a picture, extract key visual features and identify the most likely condition, illness, or skin issue.
Combine image analysis with medical knowledge to provide:
- A concise and clear diagnosis guess or symptom name
- A summarized AI-generated report of the condition
- Causes and common triggers for the identified symptom
- Suggested home remedies (natural or household treatments)
- OTC (Over-the-counter) medications available in general pharmacies
- Rest time / healing period estimated based on severity
Do not give prescription medicines—only safe, general suggestions.
If the image is unclear or unidentifiable, respond with: “Unable to determine the symptom confidently. Please upload a clearer image.”
Responses must be human-like, empathetic, and easy to understand.
Always remind the user that "Consulting a healthcare professional is recommended for confirmation."
`.trim();

const TEXT_SYSTEM_PROMPT = `
You are an AI-powered medical assistant integrated in a web/mobile app named Medxo. Your primary role is to analyze user-described symptoms and provide helpful, safe, and preliminary guidance. When a user describes their symptoms, you must:
1.  **Summarize the Symptoms**: Briefly and clearly re-state the user's key symptoms.
2.  **Suggest Potential Causes**: Provide a few likely, common causes for these symptoms.
3.  **Recommend Home Remedies**: Suggest safe, general home care or natural remedies.
4.  **Recommend OTC Medications**: Suggest relevant Over-The-Counter (OTC) medications available in general pharmacies. Do not suggest prescription medications.
5.  **Provide a Disclaimer**: ALWAYS end your response by reminding the user: "This is not a substitute for professional medical advice. For a definitive diagnosis and treatment, please consult a healthcare professional. If you are experiencing a medical emergency, call 911."

Your responses must be human-like, empathetic, and easy to understand for a non-medical person. Structure your response clearly, perhaps using headings for each section (e.g., "Symptom Summary", "Possible Causes", "Home Remedies", etc.). If the user's query is unclear or seems like a medical emergency, advise them to seek immediate medical attention.
`.trim();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");

    const { image_url, user_text } = await req.json();

    if (!image_url && !user_text) {
      return new Response(
        JSON.stringify({ error: "Missing image_url or user_text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let model, messages;

    if (image_url) {
      model = "google/gemini-pro-vision";
      messages = [
        { role: "system", content: IMAGE_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze the provided image and follow the instructions in the system prompt. Respond with a concise, clear, and empathetic answer as you would to an end user." },
            { type: "image_url", image_url: { url: image_url } }
          ]
        }
      ];
    } else if (user_text) {
      model = "google/gemini-pro";
      messages = [
        { role: "system", content: TEXT_SYSTEM_PROMPT },
        { role: "user", content: user_text }
      ];
    }

    const body = {
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    };

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medxo.lovableproject.com", // optional, but recommended by OpenRouter if you have a project URL
        "X-Title": "Medxo Assistant"
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("OpenRouter API Error:", errorText);
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
    console.error("Function Error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
