import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ success: false, error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing receipt image with AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert receipt OCR system specialized in parsing Costco receipts. 
Extract all purchased items from the receipt image with high accuracy.

For each item, extract:
- name: The product name/description
- price: The price paid (as a number)
- quantity: The quantity if visible (default to 1)
- itemNumber: The Costco item number if visible

Also extract:
- storeLocation: The Costco store location if visible
- purchaseDate: The purchase date in ISO format (YYYY-MM-DD)
- receiptNumber: The receipt/transaction number if visible
- subtotal: The subtotal amount
- tax: The tax amount
- total: The total amount

Return ONLY valid JSON with no markdown formatting. Use this exact structure:
{
  "success": true,
  "items": [...],
  "metadata": {
    "storeLocation": "...",
    "purchaseDate": "...",
    "receiptNumber": "...",
    "subtotal": 0,
    "tax": 0,
    "total": 0
  }
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please extract all items and details from this Costco receipt image. Return the data as JSON."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "parse_receipt",
              description: "Parse receipt data and return structured items",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Product name" },
                        price: { type: "number", description: "Price paid" },
                        quantity: { type: "number", description: "Quantity purchased" },
                        itemNumber: { type: "string", description: "Costco item number" }
                      },
                      required: ["name", "price"]
                    }
                  },
                  metadata: {
                    type: "object",
                    properties: {
                      storeLocation: { type: "string" },
                      purchaseDate: { type: "string" },
                      receiptNumber: { type: "string" },
                      subtotal: { type: "number" },
                      tax: { type: "number" },
                      total: { type: "number" }
                    }
                  }
                },
                required: ["items"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "parse_receipt" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to process receipt" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    // Extract the tool call arguments
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsedData = JSON.parse(toolCall.function.arguments);
      console.log(`Extracted ${parsedData.items?.length || 0} items from receipt`);
      
      return new Response(
        JSON.stringify({ success: true, ...parsedData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: try to parse from content
    const content = aiResponse.choices?.[0]?.message?.content;
    if (content) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify({ success: true, ...parsedData }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: "Could not parse receipt data" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in parse-receipt function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
