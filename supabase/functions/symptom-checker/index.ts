
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const API_KEY = Deno.env.get("API_NINJAS_KEY");
    if (!API_KEY) throw new Error("Missing API_NINJAS_KEY.");

    const { symptoms } = await req.json();
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return new Response(
        JSON.stringify({ error: "No symptoms provided." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Query API Ninjas Symptom Checker
    const url = `https://api.api-ninjas.com/v1/symptomchecker?symptoms=${encodeURIComponent(symptoms.join(","))}`;
    const apiResp = await fetch(url, {
      headers: { "X-Api-Key": API_KEY },
    });

    const data = await apiResp.json();

    return new Response(
      JSON.stringify({ result: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
