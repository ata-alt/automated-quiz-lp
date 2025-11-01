-- Migration to add role column to automated_quiz_user table
-- Run this if the table already exists without the role column

-- Add role column if it doesn't exist
ALTER TABLE `automated_quiz_user`
ADD COLUMN IF NOT EXISTS `role` ENUM('admin','editor') NOT NULL DEFAULT 'editor' AFTER `full_name`;

-- Add index on role for better query performance
ALTER TABLE `automated_quiz_user`
ADD INDEX IF NOT EXISTS `role` (`role`);

-- Update existing users to have a default role if NULL
UPDATE `automated_quiz_user`
SET `role` = 'editor'
WHERE `role` IS NULL OR `role` = '';

-- Optional: Set the first user or a specific user as admin
-- UPDATE `automated_quiz_user` SET `role` = 'admin' WHERE `id` = 1;
-- Or by email:
-- UPDATE `automated_quiz_user` SET `role` = 'admin' WHERE `email` = 'admin@fcilondon.co.uk';
