import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DPIA = {
  id: string;
  reference_number: string;
  assessment_name: string;
  department: string;
  processing_activity: string;
  data_controller_name: string;
  purpose_of_processing: string;
  legal_basis: string;
  personal_data_types: string[];
  number_of_subjects: string;
  retention_period: string;
  third_party_sharing: boolean;
  third_party_names: string | null;
  international_transfers: boolean;
  transfer_countries: string | null;
  data_sources: string | null;
  data_recipients: string | null;
  data_lifecycle: string | null;
  automated_decision_making: boolean;
  adm_description: string | null;
  profiling_activities: boolean;
  profiling_description: string | null;
  necessity_justification: string | null;
  proportionality_assessment: string | null;
  data_minimization_measures: string | null;
  rights_impact_assessment: string | null;
  security_measures: Array<{ category: string; measures: string[] }>;
  breach_procedures: string | null;
  dpo_consulted: boolean;
  dpo_advice: string | null;
  data_subjects_consulted: boolean;
  consultation_summary: string | null;
  risk_answers: Array<{ question: number; answer: string; score: number }>;
  calculated_risk_level: string;
  mitigation_measures: Array<{ risk: string; action: string; owner: string; timeline: string }>;
  residual_risk_level: string | null;
  approval_required: boolean;
  approved_by: string | null;
  approval_date: string | null;
  review_date: string | null;
  compliance_frameworks: string[];
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export type NewDPIAData = Omit<DPIA, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
