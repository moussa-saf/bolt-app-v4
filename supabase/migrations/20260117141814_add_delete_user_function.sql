/*
  # Add User Data Deletion Function

  1. New Functions
    - `delete_user()` - Allows users to delete their own account and all associated data
  
  2. Security
    - Function is executable by authenticated users only
    - Users can only delete their own data
    - Ensures all related records are deleted in the correct order
  
  3. Data Cleanup
    - Deletes user's documents
    - Deletes user's testimonials
    - Deletes user profile
    - Deletes auth user account
*/

-- Create function to allow users to delete their own account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user's documents
  DELETE FROM found_documents WHERE created_by = auth.uid();
  
  -- Delete user's testimonials
  DELETE FROM testimonials WHERE user_id = auth.uid();
  
  -- Delete user profile
  DELETE FROM user_profiles WHERE id = auth.uid();
  
  -- Delete auth user
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
