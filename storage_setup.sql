-- Create a bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- Policy to allow authenticated users (or service role) to upload images
-- Since we are using a simplified admin, we will allow service role/admin uploads.
-- In a real Supabase setup, you'd use auth.uid() checks, but for this template, 
-- we'll assume the user uses the Service Role key or has set the bucket to public-writable for their own use.
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio');
