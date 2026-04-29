-- Portfolio Content Table
CREATE TABLE IF NOT EXISTS public.portfolio_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link TEXT,
    github_link TEXT,
    tags TEXT[],
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT, -- e.g., 'Frontend', 'Backend', 'Tools'
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    period TEXT,
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Allow public read-only access for portfolio_content" ON public.portfolio_content FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for experience" ON public.experience FOR SELECT USING (true);

-- Note: Admin updates will be handled via Service Role or specific Auth policies.
-- For simplicity in this template, we'll assume the admin uses the Service Role key in the dashboard API routes
-- OR we can set up specific Auth policies if the user wants full Supabase Auth.
-- The user requested "100% working backend" and "admin dashboard".
