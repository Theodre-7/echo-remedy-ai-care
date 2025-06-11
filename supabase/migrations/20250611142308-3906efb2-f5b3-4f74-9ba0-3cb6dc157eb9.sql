
-- Update symptom_scans table to include more detailed fields
ALTER TABLE public.symptom_scans 
ADD COLUMN IF NOT EXISTS wound_classification TEXT,
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(5,4),
ADD COLUMN IF NOT EXISTS home_remedies JSONB,
ADD COLUMN IF NOT EXISTS medications JSONB;

-- Update RLS policies for symptom_scans to ensure users can insert their own scans
DROP POLICY IF EXISTS "Users can create their own scans" ON public.symptom_scans;
CREATE POLICY "Users can create their own scans" 
  ON public.symptom_scans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Ensure user_id column is not nullable for proper RLS
ALTER TABLE public.symptom_scans 
ALTER COLUMN user_id SET NOT NULL;

-- Add storage policies if they don't exist
DO $$
BEGIN
    -- Check if policies exist before creating them
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Users can upload their own images'
    ) THEN
        CREATE POLICY "Users can upload their own images" 
        ON storage.objects 
        FOR INSERT 
        WITH CHECK (bucket_id = 'symptom-images' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Users can view their own images'
    ) THEN
        CREATE POLICY "Users can view their own images" 
        ON storage.objects 
        FOR SELECT 
        USING (bucket_id = 'symptom-images' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Anyone can view symptom images'
    ) THEN
        CREATE POLICY "Anyone can view symptom images" 
        ON storage.objects 
        FOR SELECT 
        USING (bucket_id = 'symptom-images');
    END IF;
END
$$;
