# PM Sequence

A learning tool for Product Managers that provides opinionated, sequenced video content to help PMs upgrade their thinking without decision fatigue.

## Features

- **Problem Selection**: Choose from 5 predefined PM problems
- **Sequence Commitment**: See exactly what you'll learn before committing
- **Guided Video Player**: Watch YouTube videos with clear guidance on what to focus on

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
pm-sequence/
├── app/
│   ├── page.tsx          # Main orchestrator
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ProblemPicker.tsx  # Screen 1: Problem selection
│   ├── SequenceIntro.tsx  # Screen 2: Sequence commitment
│   └── SequencePlayer.tsx # Screen 3: Guided video player
└── data/
    ├── problems.json      # 5 entry problems
    └── sequences.json     # Video sequences for each problem
```

## How It Works

1. **Pick a Problem**: Select one of 5 common PM problems
2. **Review Sequence**: See the curated video sequence and time commitment
3. **Watch & Learn**: Go through videos with clear guidance on what to focus on

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- YouTube iframe embeds

## Design Principles

- Diagnose before content
- One decision per screen
- No infinite scroll
- No optionality unless user rejects current path
- Text > thumbnails early (trust before dopamine)
