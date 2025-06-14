
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

    console.log("Received symptoms:", symptoms);

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      console.log("No symptoms provided.");
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

    console.log("API Ninjas response status:", apiResp.status);

    const bodyText = await apiResp.text();
    console.log("API Ninjas response body:", bodyText);

    let data;
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      console.log("Error parsing API Ninjas JSON:", e?.message);
      return new Response(
        JSON.stringify({ error: "Invalid JSON from API Ninjas." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 }
      );
    }

    if (!apiResp.ok) {
      console.log("API Ninjas returned error status.");
      return new Response(
        JSON.stringify({ error: `API Ninjas error: ${data.error || apiResp.status}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: apiResp.status }
      );
    }

    return new Response(
      JSON.stringify({ result: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.log("Unhandled error:", error && (error.stack || error.message));
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
