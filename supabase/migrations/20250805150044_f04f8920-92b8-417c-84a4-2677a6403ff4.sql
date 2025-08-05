-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create enum for question types
CREATE TYPE public.question_type AS ENUM ('mcq', 'short_answer');

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    question_type public.question_type NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT, -- For MCQ questions
    option_b TEXT, -- For MCQ questions
    option_c TEXT, -- For MCQ questions
    option_d TEXT, -- For MCQ questions
    correct_answer TEXT NOT NULL, -- 'a', 'b', 'c', 'd' for MCQ or actual answer for short_answer
    explanation TEXT, -- Optional explanation for the answer
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only view questions for courses they are enrolled in
CREATE POLICY "Users can view questions for enrolled courses only" 
ON public.quiz_questions 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM public.enrollments 
        WHERE enrollments.user_id = auth.uid() 
        AND enrollments.course_id = quiz_questions.course_id
    )
);

-- Create indexes for better performance
CREATE INDEX idx_quiz_questions_course_id ON public.quiz_questions(course_id);
CREATE INDEX idx_quiz_questions_topic_id ON public.quiz_questions(topic_id);
CREATE INDEX idx_quiz_questions_course_topic ON public.quiz_questions(course_id, topic_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quiz_questions_updated_at
    BEFORE UPDATE ON public.quiz_questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add some sample quiz questions for testing
INSERT INTO public.quiz_questions (course_id, topic_id, question_type, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
-- Get the AQA Triple Science - Biology course and Cell Structure and Transport topic
((SELECT id FROM public.courses WHERE title = 'AQA Triple Science - Biology'), 
 (SELECT id FROM public.topics WHERE topic_name = 'Cell Structure and Transport' AND course_id = (SELECT id FROM public.courses WHERE title = 'AQA Triple Science - Biology')), 
 'mcq', 
 'What is the function of the cell membrane?', 
 'To control what enters and exits the cell', 
 'To store genetic material', 
 'To produce energy', 
 'To synthesize proteins', 
 'a', 
 'The cell membrane is selectively permeable and controls the movement of substances in and out of the cell.'),

((SELECT id FROM public.courses WHERE title = 'AQA Triple Science - Biology'), 
 (SELECT id FROM public.topics WHERE topic_name = 'Cell Structure and Transport' AND course_id = (SELECT id FROM public.courses WHERE title = 'AQA Triple Science - Biology')), 
 'short_answer', 
 'What is the powerhouse of the cell?', 
 NULL, NULL, NULL, NULL, 
 'mitochondria', 
 'Mitochondria are known as the powerhouse of the cell because they produce ATP through cellular respiration.');