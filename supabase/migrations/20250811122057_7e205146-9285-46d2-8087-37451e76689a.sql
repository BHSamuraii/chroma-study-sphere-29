-- Add optional image URL for quiz questions
ALTER TABLE public.quiz_questions
ADD COLUMN IF NOT EXISTS image_url TEXT;