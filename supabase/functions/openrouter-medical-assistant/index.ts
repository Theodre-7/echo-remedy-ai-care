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
When a user uploads a picture, analyze it and generate a response in Markdown format.

Structure your response with the following sections using Markdown headings:
- **## Preliminary Analysis**: Provide a concise and clear diagnosis guess or symptom name.
- **## AI-Generated Report**: Give a summarized report of the potential condition.
- **## Possible Causes & Triggers**: List common causes and triggers for the identified issue.
- **## Home Remedies**: Suggest safe home remedies in a bulleted list.
- **## OTC Medications**: Suggest relevant OTC medications in a bulleted list. Do not give prescription medicines.
- **## Estimated Healing Time**: Provide an estimated rest/healing period based on typical severity.

If the image is unclear or unidentifiable, respond with: “Unable to determine the symptom confidently. Please upload a clearer image.”

ALWAYS end your response with the following disclaimer, exactly as written:
---
**Disclaimer**: _Consulting a healthcare professional is recommended for confirmation. This is not a substitute for professional medical advice._

Responses must be human-like, empathetic, and easy to understand.
`.trim();

const TEXT_SYSTEM_PROMPT = `
You are an AI-powered medical assistant integrated in a web/mobile app named Medxo. Your primary role is to analyze user-described symptoms and provide helpful, safe, and preliminary guidance. When a user describes their symptoms, you must generate a response in Markdown format.

Structure your response with the following sections using Markdown headings:
- **## Symptom Summary**: Briefly and clearly re-state the user's key symptoms.
- **## Potential Causes**: Provide a few likely, common causes for these symptoms.
- **## Home Remedies**: Suggest safe, general home care or natural remedies in a bulleted list.
- **## OTC Medications**: Suggest relevant Over-The-Counter (OTC) medications available in general pharmacies in a bulleted list. Do not suggest prescription medications.

ALWAYS end your response with the following disclaimer, exactly as written:
---
**Disclaimer**: _This is not a substitute for professional medical advice. For a definitive diagnosis and treatment, please consult a healthcare professional. If you are experiencing a medical emergency, call 911._

Your responses must be human-like, empathetic, and easy to understand for a non-medical person. If the user's query is unclear or seems like a medical emergency, advise them to seek immediate medical attention.
`.trim();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");

    const { image_url, user_text, conversation } = await req.json();

    if (!image_url && !user_text && !conversation) {
      return new Response(
        JSON.stringify({ error: "Missing image_url, user_text, or conversation" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let model, messages;

    if (image_url) {
      model = "google/gemini-flash-1.5"; // Updated model
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
    } else if (conversation) {
      model = "google/gemini-flash-1.5"; // Updated model
      messages = [
        { role: "system", content: TEXT_SYSTEM_PROMPT },
        ...conversation
      ];
    } else if (user_text) {
      model = "google/gemini-flash-1.5"; // Updated model
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
