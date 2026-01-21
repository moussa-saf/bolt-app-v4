import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DocumentType = {
  id: string;
  name_fr: string;
  name_ar: string;
  icon: string;
  display_order: number;
  created_at: string;
};

export type Wilaya = {
  id: number;
  code: string;
  name_fr: string;
  name_ar: string;
  created_at: string;
};

export type FoundDocument = {
  id: string;
  document_type_id: string;
  wilaya_id: number;
  document_number: string | null;
  owner_name: string;
  found_date: string;
  found_location: string;
  additional_info: string;
  finder_contact: string;
  image_url: string | null;
  original_image_url: string | null;
  image_needs_blur: boolean;
  cgu_accepted: boolean;
  status: 'available' | 'claimed' | 'returned';
  testimonial_submitted: boolean;
  case_number: string | null;
  is_approved: boolean;
  is_deleted: boolean;
  approved_at: string | null;
  approved_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  document_types?: DocumentType;
  wilayas?: Wilaya;
};

export type DocumentClaim = {
  id: string;
  found_document_id: string;
  claimer_contact: string;
  verification_info: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
};

export type Testimonial = {
  id: string;
  found_document_id: string;
  claimer_name: string;
  message: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
};

export type DuplicateDocument = {
  id: string;
  case_number: string | null;
  owner_name: string;
  found_date: string;
  status: string;
};

export async function checkDuplicateDocument(
  documentTypeId: string,
  documentNumber: string | null,
  wilayaId: number
): Promise<DuplicateDocument[]> {
  if (!documentNumber) {
    return [];
  }

  const { data, error } = await supabase.rpc('check_duplicate_document', {
    p_document_type_id: documentTypeId,
    p_document_number: documentNumber,
    p_wilaya_id: wilayaId,
  });

  if (error) {
    console.error('Error checking duplicates:', error);
    return [];
  }

  return data || [];
}