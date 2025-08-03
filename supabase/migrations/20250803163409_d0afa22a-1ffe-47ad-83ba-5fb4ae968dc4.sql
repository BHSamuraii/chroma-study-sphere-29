-- Create topics table to store course topics and subjects
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL,
  subject TEXT NULL, -- For science courses (Biology, Chemistry, Physics)
  topic_name TEXT NOT NULL,
  is_free BOOLEAN NOT NULL DEFAULT false, -- Whether this topic is free for logged out users
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing topics
CREATE POLICY "Anyone can view topics" 
ON public.topics 
FOR SELECT 
USING (true);

-- Add foreign key constraint
ALTER TABLE public.topics 
ADD CONSTRAINT topics_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_topics_course_id ON public.topics(course_id);
CREATE INDEX idx_topics_subject ON public.topics(subject);

-- Insert sample topics for AQA Mathematics
INSERT INTO public.topics (course_id, topic_name, is_free) 
SELECT id, 'Algebra', true FROM public.courses WHERE title = 'AQA Mathematics'
UNION ALL
SELECT id, 'Geometry and Measures', false FROM public.courses WHERE title = 'AQA Mathematics'
UNION ALL
SELECT id, 'Number', true FROM public.courses WHERE title = 'AQA Mathematics'
UNION ALL
SELECT id, 'Probability', false FROM public.courses WHERE title = 'AQA Mathematics'
UNION ALL
SELECT id, 'Ratio, Proportion and Rates of Change', false FROM public.courses WHERE title = 'AQA Mathematics'
UNION ALL
SELECT id, 'Statistics', false FROM public.courses WHERE title = 'AQA Mathematics';

-- Insert sample topics for science courses (AQA Triple Science as example)
INSERT INTO public.topics (course_id, subject, topic_name, is_free)
SELECT id, 'Biology', 'Cell Biology', true FROM public.courses WHERE title ILIKE '%AQA%' AND title ILIKE '%Triple%'
UNION ALL
SELECT id, 'Biology', 'Organisation', false FROM public.courses WHERE title ILIKE '%AQA%' AND title ILIKE '%Triple%'
UNION ALL
SELECT id, 'Chemistry', 'Atomic Structure', true FROM public.courses WHERE title ILIKE '%AQA%' AND title ILIKE '%Triple%'
UNION ALL
SELECT id, 'Chemistry', 'Bonding', false FROM public.courses WHERE title ILIKE '%AQA%' AND title ILIKE '%Triple%'
UNION ALL
SELECT id, 'Physics', 'Forces', true FROM public.courses WHERE title ILIKE '%AQA%' AND title ILIKE '%Triple%'
UNION ALL
SELECT id, 'Physics', 'Energy', false FROM public.courses WHERE title ILIKE '%AQA%' AND title ILIKE '%Triple%';

-- Insert sample topics for OCR Computer Science
INSERT INTO public.topics (course_id, topic_name, is_free)
SELECT id, 'Computer Systems', true FROM public.courses WHERE title = 'OCR Computer Science'
UNION ALL
SELECT id, 'Algorithms', true FROM public.courses WHERE title = 'OCR Computer Science'
UNION ALL
SELECT id, 'Programming', false FROM public.courses WHERE title = 'OCR Computer Science'
UNION ALL
SELECT id, 'Data Representation', false FROM public.courses WHERE title = 'OCR Computer Science';