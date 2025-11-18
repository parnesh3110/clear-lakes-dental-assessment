# Instructions

Most of your work can be done in the app.vue file.
For interacting with APIs, you can use [composables](https://vuejs.org/guide/reusability/composables) or leave it in app.vue.

You can do all of your development in 'app.vue', or you can get more advanced by:

- Using Vue and Nuxt's [page/components system](https://nuxt.com/docs/4.x/guide/directory-structure/app/pages)
- Practicing proper environment safety via Nuxt's [Server API Routes](https://nuxt.com/docs/api/composables/use-fetch)

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

```

# Clear Lakes Dental - Technical Assessment

A data management application I built for the Clear Lakes Dental SWE Intern position. Users can sign up, log in, and manage entries through a simple interface.

## Getting Started

Clone the repo and install dependencies on your terminal:

```bash
npm install
```

### Database Setup

In Supabase projects, create the '**entries**' table by running this SQL in the SQL Editor:

```sql
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_entries_created_at ON entries(created_at DESC);

ALTER TABLE entries DISABLE ROW LEVEL SECURITY;

```

Also make sure Email authentication is enabled:

1. Go to Authentication > Providers
2. Enable Email provider
3. Disable "Confirm email" for testing

You'll need to set up a Supabase project. Create a `.env` file:

```bash
cp .env.example .env
```

````

Then create a table called '**entries**' in Supabase with these columns:

- id (uuid, primary key)
- user_id (uuid, references auth.users)
- name (text)
- email (text)
- message (text)
- created_at (timestamp)

Run the dev server:

```bash

npm run dev

````

Go to http://localhost:3000 and you should see the login page.

## What It Does

The app has a pretty straightforward flow. When you first visit, you'll need to sign up or log in. Once you're in, you can see all the entries people have created and add your own.

I built two main pages - one shows all the entries in a grid, and the other has a form where you can create new ones. The form validates your input (name needs to be 2-100 characters, message needs at least 10 characters).

All the database stuff happens on the server side through API routes, so the Supabase credentials never get exposed to the browser. The middleware checks authentication on every route except login/signup.

## Tech I Used

- Nuxt 3 (As per requirement)
- TypeScript (As per requirement)
- Supabase (As per requirement)
- Tailwind

## File Structure

Pretty standard Nuxt layout:

```
pages/

- index.vue (shows all entries)
- addData.vue (form to create entries)
- login.vue and signup.vue (auth pages)

server/api/entries/

- create.post.ts - this handles creating entries
- list.get.ts - this fetches all entries

middleware/

- auth.ts - this protects routes

types/

- entry.ts

```

## Notes

I disabled Row Level Security on the entries table to keep things simple. In production you'd want that enabled with proper policies.

The page auto-refreshes every 5 seconds so you can see new entries without manually refreshing.

If you log out and log back in, all your data is still there since it's stored in supabase's postgres database.

```

```
