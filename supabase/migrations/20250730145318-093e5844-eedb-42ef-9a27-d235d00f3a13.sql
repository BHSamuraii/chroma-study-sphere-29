-- Add missing is_free column to courses table
ALTER TABLE courses ADD COLUMN is_free boolean NOT NULL DEFAULT false;

-- Insert AQA Triple Science course
INSERT INTO courses (title, description, price, image_url, is_free) VALUES (
  'AQA Triple Science',
  'Complete GCSE Triple Science course covering Biology, Chemistry, and Physics with separate qualifications for each subject.',
  29.99,
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
  false
);

-- Insert AQA Combined Science course
INSERT INTO courses (title, description, price, image_url, is_free) VALUES (
  'AQA Combined Science',
  'GCSE Combined Science course covering essential Biology, Chemistry, and Physics topics in an integrated approach.',
  24.99,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  false
);