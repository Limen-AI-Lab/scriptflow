# ScriptFlow

A Next.js application for managing and editing social media scripts with AI-powered features.

## Features

- 📝 Script management dashboard
- ✏️ Rich text editor with auto-save
- 🤖 AI-powered writing tools (Fix CTA, Rewrite Hook, Shorten)
- 🌐 English translation generation
- 🔊 Text-to-Speech audio generation
- 💾 Supabase integration for data storage

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project
- Google Gemini API key (for AI features)
- Minimax API key and Group ID (for TTS feature)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `GEMINI_API_KEY` - Your Google Gemini API key
- `MINIMAX_API_KEY` - Your Minimax API key
- `MINIMAX_GROUP_ID` - Your Minimax Group ID

### Supabase Setup

1. Create a `scripts` table with the following schema:
```sql
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_url TEXT,
  raw_text TEXT NOT NULL,
  title TEXT NOT NULL,
  content_cn_draft TEXT NOT NULL,
  content_cn_final TEXT,
  content_en TEXT,
  audio_url TEXT,
  status TEXT CHECK (status IN ('new', 'editing', 'done')) DEFAULT 'new',
  tags TEXT[] DEFAULT '{}'
);
```

2. Create a storage bucket named `scripts-audio`:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `scripts-audio`
   - Set it to public (or configure RLS policies)

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── actions/          # Server actions (AI, audio generation)
│   ├── editor/[id]/      # Editor page and components
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard page
│   └── globals.css       # Global styles
├── lib/
│   └── supabase/         # Supabase client configuration
└── types/                # TypeScript type definitions
```

## Deployment

### GitHub & Vercel

See detailed deployment guides:
- [GitHub Setup Guide](./GITHUB_SETUP.md)
- [Vercel Deployment Guide](./VERCEL_DEPLOY.md)
- [Complete Deployment Guide](./DEPLOYMENT.md)

Quick start:
1. Create GitHub repository (see `GITHUB_SETUP.md`)
2. Deploy to Vercel (see `VERCEL_DEPLOY.md`)
3. Configure environment variables in Vercel Dashboard

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Supabase (Database & Storage)
- Google Gemini API (`@google/genai`)
- Minimax T2S API

