
-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table to track user course enrollments
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- RLS policies for courses (public read access)
CREATE POLICY "Anyone can view courses" 
  ON public.courses 
  FOR SELECT 
  USING (true);

-- RLS policies for enrollments (users can only see their own enrollments)
CREATE POLICY "Users can view their own enrollments" 
  ON public.enrollments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" 
  ON public.enrollments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own enrollments" 
  ON public.enrollments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Insert some sample courses
INSERT INTO public.courses (title, description, price, is_free, image_url) VALUES 
('Mathematics GCSE', 'Complete GCSE Mathematics course with interactive lessons and practice tests', 49.99, false, '/placeholder.svg'),
('Physics GCSE', 'Master GCSE Physics with comprehensive video lessons and experiments', 54.99, false, '/placeholder.svg'),
('Chemistry GCSE', 'Learn GCSE Chemistry through engaging content and virtual labs', 52.99, false, '/placeholder.svg'),
('English Literature GCSE', 'Explore classic texts and improve your analytical writing skills', 44.99, false, '/placeholder.svg'),
('Computer Science GCSE', 'Programming fundamentals and computational thinking for GCSE', 59.99, false, '/placeholder.svg'),
('Free Study Tips', 'Essential study techniques and time management strategies', 0, true, '/placeholder.svg');
