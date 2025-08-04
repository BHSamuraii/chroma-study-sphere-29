-- First, delete existing OCR Computer Science topics
DELETE FROM topics WHERE course_id = (SELECT id FROM courses WHERE title = 'OCR Computer Science');

-- Get the course IDs for reference
DO $$
DECLARE
    ocr_cs_id UUID;
    aqa_math_id UUID;
BEGIN
    -- Get OCR Computer Science course ID
    SELECT id INTO ocr_cs_id FROM courses WHERE title = 'OCR Computer Science';
    
    -- Get AQA Mathematics course ID  
    SELECT id INTO aqa_math_id FROM courses WHERE title = 'AQA Mathematics';
    
    -- Insert new OCR Computer Science topics
    INSERT INTO topics (course_id, topic_name, subject, is_free) VALUES
    (ocr_cs_id, 'SLR 1.1 - Systems Architecture', 'Computer Science', true),
    (ocr_cs_id, 'SLR 1.2 - Memory and Storage', 'Computer Science', false),
    (ocr_cs_id, 'SLR 1.3 - Network Connections and Protocols', 'Computer Science', false),
    (ocr_cs_id, 'SLR 1.4 - Network Security', 'Computer Science', false),
    (ocr_cs_id, 'SLR 1.5 - Systems Software', 'Computer Science', false),
    (ocr_cs_id, 'SLR 1.6 - Ethical, Legal, Cultural issues', 'Computer Science', false),
    (ocr_cs_id, 'SLR 1.7 - Data Representation', 'Computer Science', false),
    (ocr_cs_id, 'SLR 2.1 - Algorithms', 'Computer Science', false),
    (ocr_cs_id, 'SLR 2.2 - Programming fundamentals', 'Computer Science', false),
    (ocr_cs_id, 'SLR 2.3 - Producing robust programs', 'Computer Science', false),
    (ocr_cs_id, 'SLR 2.4 - Computational Logic', 'Computer Science', false),
    (ocr_cs_id, 'SLR 2.5 - Translators and facilities of languages', 'Computer Science', false);
    
    -- Update AQA Mathematics to make Algebra free
    UPDATE topics 
    SET is_free = true 
    WHERE course_id = aqa_math_id AND topic_name = 'Algebra';
END $$;