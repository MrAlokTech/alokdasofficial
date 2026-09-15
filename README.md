# Alok Das — Personal Brand Website (`alokdasofficial.in`)

> **"Chemistry first. Technology as a complementary skill. Building useful things."**

A modern, professional personal brand website for **Alok Das**, an M.Sc. Chemistry student at Rabindranath Tagore University (Assam), featuring research monographs in natural product chemistry alongside functional software and published mobile applications on Google Play.

---

## 🔬 Professional Positioning

- **Primary Identity**: M.Sc. Chemistry student with practical laboratory training, analytical wet chemical experience, Thin Layer Chromatography (TLC), and Good Laboratory Practice (GLP) documentation.
- **Secondary Identity**: Technology enthusiast and independent builder capable of designing, developing, and releasing cross-platform applications (Flutter, Dart, SQLite, Next.js).
- **Recruiter Direct Target**: Entry-level positions in Quality Control (QC), Quality Assurance (QA), Laboratory Assistance, and Scientific/Research fellowships.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Static HTML Export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom CSS design tokens
- **Components**: shadcn/ui design patterns & primitives with [Lucide React](https://lucide.dev/) icons
- **Theme**: Full Light Mode & Dark Mode with `next-themes` (system-aware & persistent)
- **Deployment**: Zero-server static export (`out/`) tailored for **Cloudflare Pages** & **GitHub**

---

## 📂 Project Architecture

```text
├── public/                     # Static assets (favicons, logos, images)
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Master layout with ThemeProvider, Nav, Footer, JSON-LD
│   │   ├── page.tsx            # Homepage (Hero, Hierarchy, Chemistry, Projects, Apps, Availability)
│   │   ├── about/page.tsx      # Biography, Academic journey, Philosophy
│   │   ├── chemistry/page.tsx  # Academic timeline, Categorized skills, Dissertation deep-dive
│   │   ├── projects/page.tsx   # Filterable project catalog (Chemistry, Flutter, Tools)
│   │   ├── apps/page.tsx       # Published app case studies (Mileage Tracker, Alomole)
│   │   ├── resume/page.tsx     # Recruiter-optimized, printable A4 resume with PDF export
│   │   ├── contact/page.tsx    # Direct contact channels & working Formspree integration
│   │   ├── not-found.tsx       # Custom 404 with scientific motif
│   │   ├── robots.ts           # Robots.txt generator
│   │   ├── sitemap.ts          # Sitemap generator
│   │   └── globals.css         # Tailwind tokens, CSS variables, print styles
│   ├── components/
│   │   ├── home/               # Modular homepage sections
│   │   ├── layout/             # Navbar, Footer, Theme toggle
│   │   ├── seo/                # Schema.org JSON-LD Person structured data
│   │   └── ui/                 # Reusable buttons, cards, badges
│   └── data/                   # Single source of truth data layer
│       ├── personal.ts         # Contact info, social links, biography
│       ├── education.ts        # M.Sc., B.Sc., schooling records
│       ├── chemistry.ts        # Dissertation data, laboratory skills, coursework
│       ├── projects.ts         # Portfolio projects with problems, solutions, outcomes
│       ├── apps.ts             # Published applications & store links
│       └── experience.ts       # Academic research and software background
├── next.config.mjs             # Static export configuration (output: 'export')
├── tailwind.config.ts          # Color tokens and container queries
└── tsconfig.json
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18.x or 20.x+
- npm

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Static Export
```bash
npm run build
```
This builds an optimized production static bundle into the `out/` directory.

---

## ✏️ Content Updates

To update personal records, projects, or credentials, edit the typed modules in `src/data/`:

| Data Item | File to Edit | Notes |
|---|---|---|
| **Contact, Bio, Social Links** | `src/data/personal.ts` | Email, phone, location, LinkedIn, GitHub, Formspree |
| **Education History** | `src/data/education.ts` | Degrees, institutions, graduation dates, percentages |
| **Chemistry Skills & Dissertation** | `src/data/chemistry.ts` | Lab techniques, dissertation methodology, findings |
| **Projects, Apps & Research** | `src/data/projects.ts` | Detailed problem, solution, technologies, Play Store & live links |
| **Blog Articles** | `src/data/blog-posts.ts` | Markdown articles, technical writeups, takeaways, FAQs |
| **Community Polls** | `src/data/polls.ts` | Poll questions, options, closing timestamps |
| **Academic Experience** | `src/data/experience.ts` | Lab responsibilities, scholarship, and developer work |

---

## 📝 Blog Management Guide

The website features a database-ready, statically generated blog system designed for research monographs, software writeups, and laboratory tutorials.

### 1. Adding a New Blog Post
1. Open `src/data/blog-posts.ts`.
2. Add a new object conforming to the `BlogPost` interface (`src/types/blog.ts`):
   ```ts
   {
     id: "understanding-titration-curves",
     slug: "understanding-titration-curves",
     title: "Mathematical Foundations of Weak Acid-Strong Base Potentiometric Titration Curves",
     subtitle: "Deriving buffer equilibria, inflection points, and derivative pH curves from first principles.",
     excerpt: "A rigorous mathematical exploration of the Henderson-Hasselbalch equation and Gran plots for volumetric titrations.",
     publishedAt: "2026-09-15",
     category: "Chemistry",
     tags: ["Volumetric Analysis", "Titration", "Physical Chemistry", "GLP"],
     author: {
       name: "Alok Das",
       role: "M.Sc. Chemistry Candidate, RTU",
       url: "https://alokdasofficial.in",
     },
     featured: false,
     takeaways: [
       "Buffer inflection points occur where [HA] = [A-], yielding pH = pKa.",
       "First and second derivative plots eliminate indicator subjectivity in turbid samples.",
     ],
     relatedProjectSlug: "virtual-qc-lab",
     relatedProjectTitle: "Virtual QC Laboratory Assistant",
     content: `## Article body in standard GitHub Markdown with LaTeX math...`,
   }
   ```
3. The blog route `/blog/[slug]`, reading time, sitemap entry, and Schema.org `BlogPosting` JSON-LD will be automatically generated at build time.

### 2. Editing a Post
- Edit title, metadata, takeaways, FAQs, or markdown `content` directly in `src/data/blog-posts.ts`.
- Changes immediately hot-reload during `npm run dev` and compile statically into `out/blog/[slug]/index.html` during `npm run build`.

### 3. Adding Images to Articles
1. Place optimized WebP or PNG images into `public/images/blog/` (e.g. `public/images/blog/chromatogram-plate.png`).
2. Reference them in the markdown content using standard Markdown syntax:
   ```markdown
   ![Silica Gel TLC Plate under 254nm UV Light](/images/blog/chromatogram-plate.png)
   ```

### 4. Defining Frontmatter Schema & Fields
Every article supports:
- `slug`: Stable, URL-friendly kebab-case identifier.
- `title` & `subtitle`: Primary and secondary headlines.
- `excerpt`: Concise 1–2 sentence summary used for meta descriptions and card previews.
- `publishedAt` & `updatedAt`: ISO 8601 date strings (`YYYY-MM-DD`).
- `category`: `"Chemistry" | "Research" | "Software" | "Laboratory" | "Methodology"`.
- `tags`: String array of searchable topics.
- `takeaways`: Key bullet points rendered in a highlighted takeaway card.
- `faqs`: Optional array of `{ question, answer }` rendered in an accessible accordion with Schema.org `FAQPage` JSON-LD.
- `relatedProjectSlug` / `relatedAppSlug`: Cross-links the article to relevant internal project/app case studies.

### 5. Deterministic Reading Time Calculation
Reading time is computed deterministically at build time in `src/lib/blog.ts` using `calculateReadingTime(content)` based on an average speed of 200 words per minute (excluding code blocks and markdown syntax characters).

---

## 🔬 Projects Architecture (`/projects/[slug]`)

Individual projects are structured as deep-dive case studies rather than direct outbound links, ensuring visitors understand the research context before external navigation.

### How Project Data Maps to Routes
- Source file: `src/data/projects.ts`
- Routes:
  - Collection index: `/projects`
  - Case study: `/projects/[slug]` (generated via `generateStaticParams()` matching `project.id`)
- Key Case Study Sections:
  - **Hero**: Title, subtitle, year, category badge, and repository / live links (e.g. Google Play Store, Live Site, GitHub).
  - **Executive Summary**: Key findings and primary outcome.
  - **The Problem**: Background challenge and research objectives.
  - **Methodological Solution**: Applied experimental protocols or engineering design.
  - **Applied Technologies**: Laboratory techniques (TLC, GLP) or software stack (Flutter, SQLite).
  - **Related Technical Article**: Contextual link to matching blog article (e.g. Phytochemical Dissertation ↔ Phytochemical Screening Protocols, Mileage Tracker ↔ Offline-First Flutter Architecture).
  - **Case Study Navigation**: Previous and next project navigation.

> **Note**: All published applications (such as *Mileage Tracker — Fuel & Cost* and *Alomole — Chemistry Companion*) are unified under the Projects portfolio. The `/apps` routes automatically forward to `/projects`.

---

## 🗳️ Anonymous Poll Architecture (`/polls` & `/polls/[slug]`)

The site includes a first-party, privacy-preserving anonymous polling system built with a clean data contract separating the frontend presentation layer from the backend Google Apps Script and Google Sheets storage.

### Data Contract & Privacy Design
- **Zero Identity Collection**: No names, email addresses, user accounts, phone numbers, IP addresses, or device fingerprints are collected or stored.
- **Self-Issued Anonymous One-Time Token**: When voting on an active poll, the frontend requests an opaque random token generated by the server. The token is stored in Google Sheets as unused and consumed upon verified response write.
- **Computed Poll Lifecycle**: Poll status is strictly calculated server-side from `start_time` and `end_time` timestamps (`now < start_time` → `DRAFT`, `now >= end_time` → `CLOSED`, otherwise `ACTIVE`). The server's clock is the sole authority; client clock tampering cannot bypass closing rules.
- **Small-Sample Privacy**: Results are suppressed below `minimumResultsCount` (e.g. 5 responses) to prevent early individual response deduction.
- **Formula Injection Mitigation**: All descriptive answers and option inputs prepend `'` to strings starting with `=`, `+`, `-`, or `@`.

### Google Apps Script Deployment (`scripts/google-apps-script-poll.js`)
1. Create a Google Spreadsheet named **"Alok Das Anonymous Polls"**.
2. Configure 3 sheets (tabs):
   - **`Polls`**: `poll_id | title | description | start_time | end_time`
   - **`Questions`**: `poll_id | q_no | question | type | options` (options delimited by `|`)
   - **`Tokens`**: `poll_id | token | used | issued_at | used_at`
3. Go to **Extensions** > **Apps Script**, paste `scripts/google-apps-script-poll.js`, and click **Deploy** > **New deployment**.
4. Set type to **Web app**, execute as **Me**, and grant access to **Anyone**.
5. Copy the deployment URL and add to your deployment environment:
   ```bash
   NEXT_PUBLIC_POLLS_ENDPOINT="https://script.google.com/macros/s/.../exec"
   ```

---

## 🗄️ Future Database Migration Strategy

The website is engineered with a strict repository abstraction pattern:

```text
Pages & UI Components (Server Components)
            ↓
  Repository Layer (src/lib/blog.ts, src/lib/polls.ts)
            ↓
   Current: Local Typed Data / Google Apps Script
   Future:  Supabase / Firebase / PostgreSQL / Prisma
```

### How to Substitute a Future Database
1. Keep the identical asynchronous function signatures in `src/lib/blog.ts` and `src/lib/polls.ts`:
   - `getAllPolls(): Promise<Poll[]>`
   - `getPollBySlug(slug: string): Promise<Poll | undefined>`
   - `getOpenPolls(): Promise<Poll[]>`
2. Inside `src/lib/polls.ts`, swap the internal array query for your database client or REST API.
3. Zero UI components, page layouts, or route handlers need to be rewritten.

---

## ☁️ Cloudflare Pages Deployment

This project is pre-configured for automated static deployment via **GitHub → Cloudflare Pages**:

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete modern Next.js personal brand website"
   git push origin main
   ```
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select this repository.
4. Configure Build Settings:
   - **Framework preset**: `Next.js (Static HTML Export)` or `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Environment Variables**:
     - `NODE_VERSION`: `20` (or `22`)
5. Click **Save and Deploy**. Cloudflare Pages will build the site and deploy it to `alokdasofficial.in`.

---

## 📄 License

&copy; Alok Das. All rights reserved.
