import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceCheckRequest {
  itemName: string;
  itemNumber?: string;
}

interface PriceResult {
  success: boolean;
  currentPrice?: number;
  itemName?: string;
  productUrl?: string;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itemName, itemNumber }: PriceCheckRequest = await req.json();

    if (!itemName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Item name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query for Costco
    const searchQuery = itemNumber 
      ? `Costco ${itemNumber} ${itemName} price`
      : `site:costco.com ${itemName} price`;

    console.log('Searching for:', searchQuery);

    // Use Firecrawl search to find the product
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 5,
        scrapeOptions: {
          formats: ['markdown'],
        },
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Firecrawl search error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to search for product' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchData = await searchResponse.json();
    console.log('Search results:', JSON.stringify(searchData, null, 2));

    if (!searchData.success || !searchData.data || searchData.data.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to extract price from results
    let foundPrice: number | null = null;
    let productUrl: string | undefined;
    let foundItemName: string | undefined;

    for (const result of searchData.data) {
      const content = result.markdown || result.description || '';
      const url = result.url || '';
      
      // Only process Costco URLs
      if (!url.includes('costco.com')) continue;

      productUrl = url;
      foundItemName = result.title;

      // Extract price patterns from content
      // Costco prices typically appear as $XX.XX or $X,XXX.XX
      const pricePatterns = [
        /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,  // Standard price format
        /(?:price|now|sale)[\s:]*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi,  // Price with label
        /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|dollars?)/gi,  // With currency name
      ];

      for (const pattern of pricePatterns) {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          const priceStr = match[1] || match[0];
          const cleanPrice = parseFloat(priceStr.replace(/[$,]/g, ''));
          
          // Sanity check: price should be reasonable for retail items
          if (cleanPrice > 0 && cleanPrice < 50000) {
            // Take the first valid price found (usually the main product price)
            if (!foundPrice || cleanPrice < foundPrice) {
              foundPrice = cleanPrice;
            }
          }
        }
      }

      if (foundPrice) break;
    }

    if (foundPrice) {
      console.log('Found price:', foundPrice, 'for:', foundItemName);
      return new Response(
        JSON.stringify({
          success: true,
          currentPrice: foundPrice,
          itemName: foundItemName,
          productUrl,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Could not extract price from search results',
        productUrl,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking price:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
