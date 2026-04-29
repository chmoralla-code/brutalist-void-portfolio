# BRUTALIST VOID PORTFOLIO

A high-contrast, "Brutalist" themed portfolio template built with Next.js, Tailwind CSS, Framer Motion, and Supabase.

## Features
- **Brutalist Design**: High contrast, bold typography, and raw layout.
- **Dynamic Content**: Powered by Supabase.
- **Admin Dashboard**: Edit your portfolio content, projects, and skills in real-time.
- **Animations**: Smooth, snappy interactions using Framer Motion.
- **Deploy Ready**: Optimized for Vercel and Supabase.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the contents of `schema.sql` to set up your tables and RLS policies.
3. Copy your `Project URL` and `Anon Key` from the API settings.

### 2. Environment Variables
Create a `.env.local` file in the root directory and add:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Admin Login
The default credentials for the admin dashboard (`/admin`) are:
- **Username**: admin
- **Password**: admin1234

### 4. Local Development
```bash
npm install
npm run dev
```

### 5. Deployment
Push to GitHub and connect your repo to **Vercel**. Make sure to add your Supabase environment variables in the Vercel dashboard.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Database**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide React
