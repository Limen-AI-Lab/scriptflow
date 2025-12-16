/**
 * n8n Code Node: Insert Script into Supabase
 * 
 * Copy this code into an n8n Code node (JavaScript mode)
 * Make sure to set your Supabase credentials below or as environment variables
 */

// ===== CONFIGURATION =====
// Replace these with your actual Supabase credentials
// Or set them as n8n environment variables: $env.SUPABASE_URL and $env.SUPABASE_ANON_KEY
const SUPABASE_URL = $env.SUPABASE_URL || 'https://yunrhoxuxrzbcbkrvgjw.supabase.co';
const SUPABASE_ANON_KEY = $env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

// ===== MAIN CODE =====
const inputData = $input.all();
const results = [];

for (const item of inputData) {
  const data = item.json;
  
  // Map input data to script schema
  // Adjust these mappings based on your n8n workflow data structure
  const scriptData = {
    title: data.title || data.name || data.heading || 'Untitled Script',
    raw_text: data.raw_text || data.content || data.text || data.body || '',
    content_cn_draft: data.content_cn_draft || data.draft || data.chinese_content || data.content || '',
    source_url: data.source_url || data.url || data.link || null,
    content_cn_final: data.content_cn_final || data.final_content || null,
    content_en: data.content_en || data.english_content || null,
    audio_url: data.audio_url || data.audio || null,
    status: ['new', 'editing', 'done'].includes(data.status) ? data.status : 'new',
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(t => t.trim()) : [])
  };
  
  // Validate required fields
  if (!scriptData.title || !scriptData.raw_text || !scriptData.content_cn_draft) {
    results.push({
      json: {
        success: false,
        error: 'Missing required fields',
        message: 'title, raw_text, and content_cn_draft are required',
        received: {
          title: scriptData.title,
          raw_text: scriptData.raw_text ? 'present' : 'missing',
          content_cn_draft: scriptData.content_cn_draft ? 'present' : 'missing'
        }
      }
    });
    continue;
  }
  
  try {
    // Insert into Supabase using REST API
    const response = await $http.request({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/scripts`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation' // Return the inserted row
      },
      body: scriptData
    });
    
    results.push({
      json: {
        success: true,
        script: response,
        id: response.id,
        title: response.title,
        status: response.status,
        createdAt: response.created_at
      }
    });
  } catch (error) {
    // Handle errors
    let errorMessage = 'Unknown error';
    let errorDetails = null;
    
    if (error.response) {
      // HTTP error response
      errorMessage = error.response.body?.message || error.response.body?.error_description || 'HTTP error';
      errorDetails = error.response.body;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    results.push({
      json: {
        success: false,
        error: errorMessage,
        errorDetails: errorDetails,
        attemptedData: scriptData
      }
    });
  }
}

return results;

