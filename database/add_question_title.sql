-- Migration: Add question_title column to automated_quiz_questions table
-- Run this SQL to add the question_title field

USE automated_quiz;

-- Add question_title column to automated_quiz_questions table
ALTER TABLE automated_quiz_questions
ADD COLUMN question_title VARCHAR(255) DEFAULT '' AFTER question_order;

-- Update existing questions to have empty title (backward compatible)
UPDATE automated_quiz_questions SET question_title = '' WHERE question_title IS NULL;
