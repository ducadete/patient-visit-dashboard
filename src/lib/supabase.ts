
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tsmawjghuhphrcpkkigp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWF3amdodWhwaHJjcGtraWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNDg2MDUsImV4cCI6MjA1ODgyNDYwNX0.cxj2u-vdlDUR5B8M88InysUlra9KN3me64Nla2lyRuc';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export type Professional = {
  id: string;
  name: string;
  specialty: string;
  active: boolean;
  created_at: string;
}

export type Patient = {
  id: string;
  name: string;
  birth_date: string;
  created_at: string;
}

export type Visit = {
  id: string;
  patient_id: string;
  professional_id: string;
  visit_date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  created_at: string;
  updated_at: string;
}

export type VitalSigns = {
  id: string;
  visit_id: string;
  temperature: string | null;
  heart_rate: string | null;
  respiratory_rate: string | null;
  blood_pressure: string | null;
  oxygen_saturation: string | null;
  weight: string | null;
  blood_glucose: string | null;
  created_at: string;
}

// Helper to get the full patient name from the database
export const getPatientName = async (patientId: string): Promise<string> => {
  const { data, error } = await supabase
    .from('patients')
    .select('name')
    .eq('id', patientId)
    .single();
  
  if (error) {
    console.error('Error fetching patient name:', error);
    return 'Unknown Patient';
  }
  
  return data?.name || 'Unknown Patient';
};

// Helper to get the full professional name from the database
export const getProfessionalName = async (professionalId: string): Promise<string> => {
  const { data, error } = await supabase
    .from('professionals')
    .select('name')
    .eq('id', professionalId)
    .single();
  
  if (error) {
    console.error('Error fetching professional name:', error);
    return 'Unknown Professional';
  }
  
  return data?.name || 'Unknown Professional';
};
