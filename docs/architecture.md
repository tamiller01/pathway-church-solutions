# Pathway Church Solutions — System Architecture
A complete architectural specification for the Pathway Church Solutions application.  
Use this document when generating modules, pages, API routes, or backend logic with GitHub Copilot Chat.

---

# 1. High-Level Overview

Pathway Church Solutions is a full-stack AI-powered SaaS platform built on:

- **Next.js 14 (App Router)** — frontend + backend  
- **Supabase (Postgres + Auth + Storage)** — database + authentication  
- **OpenAI / Azure OpenAI** — AI workflows  
- **Tailwind CSS** — styling  
- **Vercel** — deployment  

The architecture is intentionally simple, scalable, and optimized for AI-assisted development.

---

# 2. Application Structure

/app
/api
/worship
/sermon
/discipleship
/songs
/worship
/sermon
/discipleship
/account
/login
/signup
/components
/ui
/layout
/lib
supabaseClient.ts
supabaseAdmin.ts
/ai
worship.ts
sermon.ts
discipleship.ts
/docs
ui-kit.md
component-library.md
wireframes.md
architecture.md

---

# 3. Frontend Architecture

### Framework
- **Next.js App Router**
- Server Components for data loading
- Client Components for interactive UI

### Styling
- **Tailwind CSS**
- Design tokens defined in `/docs/ui-kit.md`

### UI Components
Defined in `/docs/component-library.md`  
Located in `/components/ui`

### Page Types
- **Marketing pages** (landing page)
- **Module pages** (worship, sermon, discipleship)
- **Account pages** (login, signup, saved plans)

---

# 4. Backend Architecture

### API Routes (Next.js)
Located in `/app/api/*`

Each module has its own API route:
- `/api/worship` — worship planning AI workflow  
- `/api/sermon` — sermon builder AI workflow  
- `/api/discipleship` — discipleship tools workflow  
- `/api/songs` — song search + metadata  

### Server Actions (optional)
Used for:
- saving plans  
- updating user data  
- generating shareable links  

---

# 5. Database Architecture (Supabase)

### Tables

#### `users`
- id  
- email  
- created_at  

#### `worship_plans`
- id  
- user_id  
- input_data (JSON)  
- output_data (JSON)  
- created_at  

#### `sermons`
- id  
- user_id  
- input_data (JSON)  
- output_data (JSON)  
- created_at  

#### `discipleship_plans`
- id  
- user_id  
- input_data (JSON)  
- output_data (JSON)  
- created_at  

#### `songs`
- id  
- title  
- artist  
- theme  
- tempo  
- metadata (JSON)

### Authentication
- Supabase email/password auth  
- Session stored client-side  
- Protected routes enforced via middleware  

### RLS (Row-Level Security)
- Users can only access their own plans  
- Admin client bypasses RLS for AI workflows  

---

# 6. Supabase Clients

### Client-Side Supabase
File: `/lib/supabaseClient.ts`  
Used for:
- login  
- signup  
- fetching user plans  
- saving user plans (non-admin)

### Server-Side Supabase (Admin)
File: `/lib/supabaseAdmin.ts`  
Uses service role key  
Used for:
- inserting AI-generated plans  
- generating shareable links  
- admin-only operations  

---

# 7. AI Architecture

### AI Workflow Files
Located in `/lib/ai/*`

#### `worship.ts`
- Builds worship plan prompt  
- Calls OpenAI  
- Returns structured JSON  
- Inserts into `worship_plans` via admin client  

#### `sermon.ts`
- Builds sermon prompt  
- Calls OpenAI  
- Returns structured JSON  
- Inserts into `sermons`  

#### `discipleship.ts`
- Builds discipleship prompt  
- Calls OpenAI  
- Returns structured JSON  
- Inserts into `discipleship_plans`  

### Safety Layer
- Scripture validation  
- Theological tone checks  
- Song alignment checks  

---

# 8. Data Flow

### Worship Planning Example

1. User enters worship details  
2. UI sends POST request → `/api/worship`  
3. API route calls `ai/worship.ts`  
4. AI generates structured worship plan  
5. Admin Supabase client saves plan  
6. API returns plan to UI  
7. UI displays plan in preview card  
8. User saves or exports plan  

---

# 9. Module Architecture

### Worship Planning Module
- Input form  
- Preset selector  
- Song selector  
- AI output preview  
- Save/export modal  

### Sermon Builder Module
- Input form  
- Outline generator  
- Illustration selector  
- Application builder  
- AI output preview  

### Discipleship Tools Module
- Group builder  
- Study builder  
- Pathway builder  
- AI output preview  

---

# 10. Deployment Architecture

### Platform
- **Vercel**

### Environment Variables
- Supabase URL  
- Supabase anon key  
- Supabase service role key  
- OpenAI key  

### Build Output
- Static + serverless hybrid  
- API routes deployed as serverless functions  

---

# End of Architecture Document
