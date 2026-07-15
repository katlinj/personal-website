# Dev Portfolio

A SvelteKit portfolio site with a code-editor-inspired design. All content
(profile, projects, experience) lives in a Supabase database and is edited
through a password-protected `/admin` page on the site itself — no code
changes needed after setup.

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), sign in, and create a new project (free tier is enough).
2. Once it's ready, open the **SQL Editor** and run this to create the tables:

```sql
create extension if not exists "uuid-ossp";

create table profile (
  id int primary key default 1,
  name text not null default '',
  role text not null default '',
  bio text not null default '',
  location text not null default '',
  email text not null default '',
  github_url text default '',
  linkedin_url text default '',
  resume_url text default '',
  skills text[] default '{}',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into profile (id) values (1);

create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text default '',
  tech_stack text[] default '{}',
  project_url text default '',
  github_url text default '',
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table experience (
  id uuid primary key default uuid_generate_v4(),
  company text not null,
  role text not null,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text default '',
  tech_stack text[] default '{}',
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table profile enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;

create policy "Public read profile" on profile for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read experience" on experience for select using (true);
```

This makes all three tables publicly *readable* (so your site can display
them) but not publicly writable — edits only happen through `/admin`, which
uses a private key that bypasses these rules.

3. In your Supabase project, go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this secret — never put it in client-side code)

## 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

Fill in `.env`:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=pick-a-strong-password
SESSION_SECRET=any-long-random-string
```

## 4. Run it locally

```bash
npm run dev
```

Visit `http://localhost:5173` for the public site, and
`http://localhost:5173/admin` to log in and add your profile info, projects,
and work experience.

## 5. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, click **Add New → Project** and import the repo. Vercel will
   detect SvelteKit automatically (this project already uses
   `@sveltejs/adapter-vercel`).
3. Under **Environment Variables**, add the same five variables from your
   `.env` file.
4. Deploy. Once it's live, go to `your-site.vercel.app/admin` to log in and
   start adding content — changes save straight to Supabase and appear on
   the live site immediately, no redeploy required.

## Editing content

Everything under `/admin` is meant to be the only "editing" you do day to
day:

- **Profile** — name, role, bio, location, contact links, skills.
- **Projects** — add, edit, or delete project cards (title, description,
  tech stack, live/source links, featured flag, display order).
- **Experience** — add, edit, or delete work history entries (company,
  role, dates, description, tech stack, display order).

If you ever want to change the admin password, just update `ADMIN_PASSWORD`
in your environment variables (locally and in Vercel) — no code changes.

## Project structure

```
src/
  lib/server/
    supabase.js   # Supabase clients (public read + admin write)
    auth.js        # simple password + signed-cookie session for /admin
  routes/
    +layout.svelte       # global styles / design tokens
    +page.server.js       # loads profile/projects/experience for the public site
    +page.svelte           # the public portfolio page
    admin/
      +page.server.js     # login + CRUD form actions
      +page.svelte         # login form + edit dashboard
```
