-- Create private bucket for health record uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('health-records', 'health-records', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies: users can manage files in their own folder (prefix = auth.uid())
CREATE POLICY "Users view own health record files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own health record files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own health record files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own health record files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);