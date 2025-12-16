# Database Fields Explanation

This document explains the purpose and workflow of each field in the `scripts` table.

## Field Overview

### Required Fields

#### `raw_text` (TEXT, required)
**Purpose**: Original, unedited source content  
**Usage**: 
- Displayed in the **left "Source" column** of the editor (read-only)
- Never edited or modified by the app
- Serves as reference material for editors
- Preserves the original content from your n8n workflow

**Example**: 
```
"今天天气真好，我们去公园吧！记得带水。"
```

#### `content_cn_draft` (TEXT, required)
**Purpose**: Initial Chinese draft content for editing  
**Usage**:
- Starting point for the editing workflow
- This is what you should populate from n8n when creating new scripts
- When a script is first created, this is what appears in the editor
- Once editing begins, content moves to `content_cn_final`

**Example**:
```
"今天天气真好，我们去公园吧！记得带水。"
```

#### `title` (TEXT, required)
**Purpose**: Script title/heading  
**Usage**: Displayed in the dashboard and editor header

---

### Optional Fields

#### `content_cn_final` (TEXT, optional)
**Purpose**: Final edited Chinese content  
**Usage**:
- This is what the user edits in the **right "Workspace" column**
- When the editor loads, it shows `content_cn_final` if it exists, otherwise falls back to `content_cn_draft`
- Auto-saves as the user types (debounced)
- This is the polished, ready-to-publish version

**Workflow**:
1. Script created with `content_cn_draft` → shows in editor
2. User edits → saves to `content_cn_final`
3. Future edits always update `content_cn_final`

**Example**:
```
"今天天气真好！我们去公园野餐吧 🌞 记得带水和防晒霜哦～"
```

#### `content_en` (TEXT, optional)
**Purpose**: English translation  
**Usage**:
- Generated automatically via AI (Gemini API) or manually entered
- Displayed in the bottom section of the editor
- Can be auto-generated from `content_cn_final`

#### `source_url` (TEXT, optional)
**Purpose**: Original source URL  
**Usage**:
- Displayed as a clickable link in the Source column
- Useful for tracking where the content came from

#### `audio_url` (TEXT, optional)
**Purpose**: Generated audio file URL  
**Usage**:
- Stores the URL to the TTS-generated audio file
- Audio is generated from `content_cn_final`
- Stored in Supabase Storage bucket `scripts-audio`

#### `status` (TEXT, optional)
**Purpose**: Workflow status  
**Values**: `'new'`, `'editing'`, `'done'`  
**Default**: `'new'`

#### `tags` (TEXT[], optional)
**Purpose**: Array of tags for categorization  
**Default**: `[]` (empty array)

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    n8n Workflow                          │
│  Inserts script with:                                   │
│  • raw_text: "Original content..."                      │
│  • content_cn_draft: "Initial draft..."                │
│  • title: "Script Title"                                 │
│  • source_url: "https://..."                            │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              ScriptFlow Dashboard                        │
│  Shows script card with status "new"                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Script Editor Opens                        │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐               │
│  │   Source     │      │  Workspace    │               │
│  │  (Read-only) │      │  (Editable)   │               │
│  │              │      │               │               │
│  │ raw_text     │      │ content_cn_   │               │
│  │ (original)   │      │ final         │               │
│  │              │      │ (editable)    │               │
│  └──────────────┘      └──────────────┘               │
│                                                          │
│  Initial load: Shows content_cn_draft                    │
│  After edit: Saves to content_cn_final                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              User Edits Content                         │
│  • Uses AI tools (Fix CTA, Rewrite Hook, Shorten)       │
│  • Manually edits content                               │
│  • Auto-saves to content_cn_final                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Optional: Generate English                  │
│  • AI translates content_cn_final → content_en          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Optional: Generate Audio                    │
│  • TTS generates audio from content_cn_final            │
│  • Uploads to Supabase Storage                          │
│  • Saves URL to audio_url                               │
└─────────────────────────────────────────────────────────┘
```

## Key Differences

### `raw_text` vs `content_cn_draft`

| Field | Purpose | Editable | When Set |
|-------|---------|----------|----------|
| `raw_text` | Original source content (reference) | ❌ Never | On creation (from n8n) |
| `content_cn_draft` | Initial draft for editing | ❌ Not directly | On creation (from n8n) |

### `content_cn_draft` vs `content_cn_final`

| Field | Purpose | Editable | When Set |
|-------|---------|----------|----------|
| `content_cn_draft` | Starting point for editing | ❌ Not directly | On creation (from n8n) |
| `content_cn_final` | Final edited content | ✅ Yes (main editor) | When user edits |

**Important**: The editor always displays `content_cn_final` if it exists, otherwise `content_cn_draft`. When saving, it always saves to `content_cn_final`.

## n8n Integration Best Practices

When inserting from n8n, you should provide:

```javascript
{
  title: "Script Title",
  raw_text: "Original unedited content from source",      // Reference material
  content_cn_draft: "Initial Chinese draft to edit",      // Starting point
  source_url: "https://source-url.com",                    // Optional
  status: "new"                                            // Optional, defaults to "new"
}
```

**Why both `raw_text` and `content_cn_draft`?**

- **`raw_text`**: Preserves the original source exactly as received (for reference, comparison, or audit)
- **`content_cn_draft`**: The initial version ready for editing (may already be cleaned/formatted)

In many cases, they might be the same initially, but `raw_text` stays unchanged while `content_cn_draft` becomes `content_cn_final` through editing.

## Example Use Cases

### Use Case 1: Same Content Initially
```javascript
// From n8n
{
  raw_text: "今天天气真好",
  content_cn_draft: "今天天气真好"  // Same as raw_text initially
}
```

### Use Case 2: Pre-processed Draft
```javascript
// From n8n (if you do some preprocessing)
{
  raw_text: "今天天气真好，我们去公园吧！记得带水。",  // Original
  content_cn_draft: "今天天气真好！我们去公园吧 🌞 记得带水哦"  // Pre-formatted
}
```

### Use Case 3: Different Sources
```javascript
// From n8n (if raw_text comes from scraping, draft from AI processing)
{
  raw_text: "Raw scraped content with HTML tags...",      // Original scraped
  content_cn_draft: "Cleaned and formatted content..."    // AI-processed draft
}
```

## Summary

- **`raw_text`**: Original source (reference, never changes)
- **`content_cn_draft`**: Initial draft (starting point for editing)
- **`content_cn_final`**: Final edited version (what gets published)

The app workflow: `raw_text` (reference) → `content_cn_draft` (start editing) → `content_cn_final` (final version)

