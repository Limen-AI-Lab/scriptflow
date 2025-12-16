# n8n Integration Guide for ScriptFlow

This guide shows you how to insert script content into your Supabase database from n8n workflows.

## Prerequisites

You'll need:
- Your Supabase project URL
- Your Supabase anon key (or service role key for server-side operations)
- n8n workflow with data you want to insert

## Database Schema

The `scripts` table requires:
- `title` (required): Script title
- `raw_text` (required): **Original source content** - displayed in read-only "Source" column, never edited
- `content_cn_draft` (required): **Initial Chinese draft** - starting point for editing in the workspace
- `source_url` (optional): Source URL
- `content_cn_final` (optional): **Final edited Chinese content** - auto-populated when user edits `content_cn_draft`
- `content_en` (optional): English translation
- `audio_url` (optional): Audio file URL
- `status` (optional): 'new', 'editing', or 'done' (defaults to 'new')
- `tags` (optional): Array of strings (defaults to empty array)

### Understanding the Fields

**`raw_text` vs `content_cn_draft`:**
- `raw_text`: Original, unedited source content (reference material, never changes)
- `content_cn_draft`: Initial draft ready for editing (becomes `content_cn_final` when edited)

**Typical n8n workflow:**
- `raw_text`: Original content from your source (scraped, webhook, etc.)
- `content_cn_draft`: Same as `raw_text` initially, or pre-processed/formatted version

See `DATABASE_FIELDS_EXPLANATION.md` for detailed field explanations.

## Method 1: Using Code Node (Recommended)

### Step 1: Add a Code Node

1. Add a **Code** node to your n8n workflow
2. Set the mode to **JavaScript**
3. Use the following code:

```javascript
// Get Supabase credentials from environment variables or node settings
const SUPABASE_URL = $env.SUPABASE_URL || 'https://yunrhoxuxrzbcbkrvgjw.supabase.co';
const SUPABASE_ANON_KEY = $env.SUPABASE_ANON_KEY || 'your-anon-key-here';

// Get input data from previous node
const inputData = $input.all();

// Process each item
const results = [];

for (const item of inputData) {
  const data = item.json;
  
  // Prepare the script data
  const scriptData = {
    title: data.title || data.name || 'Untitled Script',
    raw_text: data.raw_text || data.content || data.text || '',
    content_cn_draft: data.content_cn_draft || data.draft || data.content || '',
    source_url: data.source_url || data.url || null,
    content_cn_final: data.content_cn_final || null,
    content_en: data.content_en || null,
    audio_url: data.audio_url || null,
    status: data.status || 'new', // 'new', 'editing', or 'done'
    tags: data.tags || [] // Array of strings
  };
  
  // Validate required fields
  if (!scriptData.title || !scriptData.raw_text || !scriptData.content_cn_draft) {
    results.push({
      json: {
        success: false,
        error: 'Missing required fields: title, raw_text, and content_cn_draft are required',
        data: scriptData
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
        id: response.id
      }
    });
  } catch (error) {
    results.push({
      json: {
        success: false,
        error: error.message,
        data: scriptData
      }
    });
  }
}

return results;
```

### Step 2: Configure Environment Variables (Optional)

In n8n settings, add environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key

Or hardcode them in the code above.

## Method 2: Using HTTP Request Node

### Step 1: Add HTTP Request Node

1. Add an **HTTP Request** node
2. Configure it as follows:

**Method:** `POST`

**URL:** 
```
https://yunrhoxuxrzbcbkrvgjw.supabase.co/rest/v1/scripts
```

**Authentication:** 
- Type: `Generic Credential Type`
- Name: `Supabase`
- Add header: `apikey` = `your-anon-key`
- Add header: `Authorization` = `Bearer your-anon-key`

**Headers:**
- `Content-Type`: `application/json`
- `Prefer`: `return=representation`

**Body:**
```json
{
  "title": "{{ $json.title }}",
  "raw_text": "{{ $json.raw_text }}",
  "content_cn_draft": "{{ $json.content_cn_draft }}",
  "source_url": "{{ $json.source_url }}",
  "status": "new",
  "tags": []
}
```

## Method 3: Using Supabase Node (if available)

If you have the Supabase n8n node installed:

1. Add **Supabase** node
2. Configure connection with your Supabase URL and anon key
3. Set operation to **Insert**
4. Select table: `scripts`
5. Map your fields:
   - `title` → `{{ $json.title }}`
   - `raw_text` → `{{ $json.raw_text }}`
   - `content_cn_draft` → `{{ $json.content_cn_draft }}`
   - etc.

## Example Workflow: Webhook to Database

Here's a complete example for receiving webhook data and inserting into database:

### Node 1: Webhook
- Trigger: Webhook
- Method: POST
- Path: `/script-webhook`

### Node 2: Code Node (Transform)
```javascript
const webhookData = $input.first().json;

return [{
  json: {
    title: webhookData.title || 'New Script',
    raw_text: webhookData.raw_text || webhookData.content,
    content_cn_draft: webhookData.content_cn_draft || webhookData.draft,
    source_url: webhookData.source_url || webhookData.url,
    status: 'new',
    tags: webhookData.tags ? webhookData.tags.split(',') : []
  }
}];
```

### Node 3: HTTP Request (Insert)
- Use Method 2 configuration above

## Error Handling

Add an **IF** node after the insert to check for errors:

```javascript
// In Code node for error checking
const result = $input.first().json;

if (result.error || !result.success) {
  return [{ json: { error: true, message: result.error || 'Insert failed' } }];
}

return [{ json: { success: true, scriptId: result.id } }];
```

## Testing

Test your workflow with sample data:

```json
{
  "title": "Test Script",
  "raw_text": "This is the raw text content",
  "content_cn_draft": "这是中文草稿内容",
  "source_url": "https://example.com/source",
  "status": "new",
  "tags": ["test", "sample"]
}
```

## Security Notes

1. **Use Anon Key**: For client-side/public workflows, use the anon key. Your RLS policies will handle security.

2. **Use Service Role Key**: For server-side/admin workflows, use the service role key (bypasses RLS). Keep this secret!

3. **RLS Policies**: Make sure your RLS policies allow inserts. The current setup allows authenticated users to insert.

## Troubleshooting

### Error: "new row violates row-level security policy"
- Check your RLS policies in Supabase dashboard
- Ensure you're using the correct key (anon vs service role)

### Error: "null value in column violates not-null constraint"
- Make sure `title`, `raw_text`, and `content_cn_draft` are provided

### Error: "invalid input syntax for type uuid"
- Don't provide an `id` field - it's auto-generated

## Advanced: Batch Insert

To insert multiple scripts at once:

```javascript
const SUPABASE_URL = $env.SUPABASE_URL;
const SUPABASE_ANON_KEY = $env.SUPABASE_ANON_KEY;

const scripts = $input.all().map(item => ({
  title: item.json.title,
  raw_text: item.json.raw_text,
  content_cn_draft: item.json.content_cn_draft,
  source_url: item.json.source_url || null,
  status: item.json.status || 'new',
  tags: item.json.tags || []
}));

const response = await $http.request({
  method: 'POST',
  url: `${SUPABASE_URL}/rest/v1/scripts`,
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: scripts
});

return scripts.map((script, index) => ({
  json: {
    success: true,
    script: response[index],
    id: response[index].id
  }
}));
```

