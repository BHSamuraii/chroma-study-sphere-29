-- Add AQA Triple Science - Physics topics
INSERT INTO public.topics (course_id, topic_name, subject, is_free) 
SELECT 
  c.id,
  t.topic_name,
  'Physics',
  t.is_free
FROM public.courses c
CROSS JOIN (
  VALUES 
    ('Energy', false),
    ('Electricity', false),
    ('Particle model of matter', false),
    ('Atomic structure', false),
    ('Forces', true),  -- This is the unlocked one
    ('Waves', false),
    ('Magnetism & Electromagnetism', false),
    ('Space Physics', false)
) AS t(topic_name, is_free)
WHERE c.title = 'AQA Triple Science';