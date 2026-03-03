# AdsGen – AI UGC Ads (Next.js)

Full-stack **AI UGC Ads** SaaS: create AI-generated product ad images and short-form videos, then share or publish. Built with **Next.js 15**, TypeScript, Tailwind CSS 4, MongoDB, Google GenAI, and Cloudinary.

**Positioning:** Create AI UGC ads and launch them on Meta & Google in minutes.

## Tech stack

| Layer   | Technology |
|--------|------------|
| **App** | Next.js 15, React 19, TypeScript, App Router |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT (register/login) |
| **AI** | Google GenAI (`@google/genai`) – image, video, prompt suggestions |
| **Media** | Cloudinary (image & video uploads) |

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- [Google AI API key](https://aistudio.google.com/apikey)
- [Cloudinary](https://cloudinary.com) account

### Setup

1. Clone and install:

   ```bash
   cd adsgen
   npm install
   ```

2. Copy env and set variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   - `MONGODB_URI` – MongoDB connection string
   - `JWT_SECRET` – Secret for JWTs (use a strong value in production)
   - `GOOGLE_CLOUD_API_KEY` – Google GenAI API key
   - `CLOUDINARY_URL` – `cloudinary://api_key:api_secret@cloud_name`

3. Run dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Features

- **Auth:** Register (20 free credits), login, JWT, protected routes
- **Credits:** 5 per image, 10 per video; checked and refunded on failure
- **Create ad:** Upload one product image, name, product info, aspect ratio (9:16 or 16:9), optional user prompt with AI suggestions
- **Video:** Generate video from a project’s generated image (Result page)
- **My generations:** List projects, view details, share (YouTube, Instagram, copy link), delete, toggle publish
- **Community:** Browse published projects
- **Plans:** Pricing page (Free / Pro / Agency style)

## API (App Router)

| Method | Route | Auth | Description |
|--------|--------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/user/me` | Yes | Current user |
| GET | `/api/user/credits` | Yes | Credits |
| GET | `/api/user/projects` | Yes | User’s projects |
| GET | `/api/user/projects/:id` | Yes | One project |
| GET | `/api/user/publish/:id` | Yes | Toggle publish |
| POST | `/api/project/create` | Yes | Create + generate image (multipart) |
| POST | `/api/project/video` | Yes | Generate video (body: `projectId`) |
| POST | `/api/project/prompt-suggestions` | No | AI prompt suggestions |
| GET | `/api/project/published` | No | Published projects |
| DELETE | `/api/project/:id` | Yes | Delete project |

Auth header: `Authorization: Bearer <jwt>`.

## Project structure

```
adsgen/
├── src/
│   ├── app/              # App Router pages & API
│   │   ├── api/           # API routes (auth, user, project)
│   │   ├── generate/
│   │   ├── result/[projectId]/
│   │   ├── my-generations/
│   │   ├── community/
│   │   ├── plans/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/       # Navbar, Hero, AuthModal, ProjectCard, etc.
│   ├── config/           # axios
│   ├── contexts/         # AuthContext
│   ├── lib/               # mongoose, jwt, auth, cloudinary, genai
│   ├── models/            # User, Project (Mongoose)
│   └── types/
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## License

MIT
