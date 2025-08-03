-- Insert AQA Mathematics topics
INSERT INTO topics (course_id, topic_name, subject, is_free) VALUES
((SELECT id FROM courses WHERE title = 'AQA Mathematics'), 'Algebra', NULL, true),
((SELECT id FROM courses WHERE title = 'AQA Mathematics'), 'Geometry and Measures', NULL, true),
((SELECT id FROM courses WHERE title = 'AQA Mathematics'), 'Number', NULL, false),
((SELECT id FROM courses WHERE title = 'AQA Mathematics'), 'Probability', NULL, false),
((SELECT id FROM courses WHERE title = 'AQA Mathematics'), 'Ratio, Proportion and Rates of Change', NULL, false),
((SELECT id FROM courses WHERE title = 'AQA Mathematics'), 'Statistics', NULL, false);