# RuralReach

**Local services and DIY help for rural communities.**

RuralReach is a full-stack web application that connects rural homeowners and property owners with nearby service providers — and helps them tackle jobs themselves when a local provider isn't available. Built as a team capstone project for DATA-2150 at Tulane University, Summer 2026.

🔗 **Live site:** [ruralreach.vercel.app](https://ruralreach.vercel.app)

---

## The problem

Platforms like Angie's List and TaskRabbit are built for dense urban markets. In rural areas, finding someone to fix a fence, service a well pump, repair farm equipment, or haul materials often means waiting weeks or relying entirely on word of mouth. RuralReach is purpose-built for that gap.

---

## Features

- **Service marketplace** — homeowners post jobs; providers respond. Searchable and filterable by task type and zip code.
- **Two-role authentication** — separate account flows for homeowners and service providers, each with their own dashboard and permissions.
- **Provider profiles** — providers list their specialties, service area, and contact info.
- **Job postings with status tracking** — post a job, receive responses, and track status through the lifecycle.
- **AI-powered DIY assistant** — describe a task and get step-by-step guidance plus curated YouTube tutorial videos, powered by the OpenAI API. For when a provider isn't available or you'd rather do it yourself.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend / Database | Supabase (PostgreSQL + Row Level Security) |
| Authentication | Supabase Auth |
| AI feature | OpenAI API |
| Deployment | Vercel |
| Version control | GitHub |

---

## Project structure

```
RuralReach/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   └── main.jsx
├── supabase/
│   └── migrations/
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## Getting started locally

1. Clone the repo
   ```bash
   git clone https://github.com/carennaj/RuralReach.git
   cd RuralReach
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase project URL, anon key, and OpenAI API key.

4. Run the development server
   ```bash
   npm run dev
   ```

---

## Environment variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_OPENAI_API_KEY=
```

---

## Team

| Name | Role |
|---|---|
| Carenna Johnson | Full-stack development and project lead |
| Elaine Cen | Frontend development |
| Morgan Kanengiser | Backend development |
| Rob Mooney | AI feature integration |
| Khoa Nguyen | Deployment and integration |
| Michael Baltz | Testing and quality assurance |

---

## Course

DATA-2150 — Introduction to Data Science  
Tulane University, Summer 2026
