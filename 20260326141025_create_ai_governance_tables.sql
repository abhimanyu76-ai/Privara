/*
  # AI Governance Module Tables

  1. New Tables
    - `ai_systems`
      - `id` (uuid, primary key)
      - `reference_number` (text, unique) - Auto-generated reference like AI-2026-001
      - `system_name` (text) - Name of the AI system
      - `department` (text) - Department owning the system
      - `ai_type` (text) - Type of AI system
      - `primary_purpose` (text) - Description of system purpose
      - `system_owner` (text) - Owner of the system
      - `vendor_type` (text) - In-house or third-party
      - `vendor_name` (text, nullable) - Vendor name if third-party
      - `deployment_date` (date) - When system was first deployed
      - `affects_individuals` (boolean) - Makes decisions affecting individuals
      - `customer_facing` (boolean) - Customer-facing system
      - `uses_personal_data` (boolean) - Uses personal data
      - `eu_ai_act_class` (text) - Minimal/Limited/High Risk/Unacceptable
      - `eu_prohibited_practices` (jsonb) - Screening questions
      - `eu_high_risk_requirements` (jsonb) - High risk checklist
      - `nist_scores` (jsonb) - NIST AI RMF scores
      - `nist_overall_score` (integer) - Overall NIST score
      - `iso42001_scores` (jsonb) - ISO 42001 assessment
      - `iso42001_overall_score` (integer) - Overall ISO score
      - `uae_scores` (jsonb) - UAE alignment scores
      - `uae_overall_score` (integer) - Overall UAE score
      - `overall_risk` (text) - Low/Medium/High
      - `gap_analysis` (jsonb) - Auto-generated gaps
      - `recommendations` (jsonb) - Auto-generated recommendations
      - `status` (text) - Draft/Active/Under Review/Suspended
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `ai_systems` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS ai_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  system_name text NOT NULL,
  department text NOT NULL,
  ai_type text NOT NULL,
  primary_purpose text NOT NULL,
  system_owner text NOT NULL,
  vendor_type text NOT NULL,
  vendor_name text,
  deployment_date date,
  affects_individuals boolean DEFAULT false,
  customer_facing boolean DEFAULT false,
  uses_personal_data boolean DEFAULT false,
  eu_ai_act_class text NOT NULL,
  eu_prohibited_practices jsonb DEFAULT '{}',
  eu_high_risk_requirements jsonb DEFAULT '{}',
  nist_scores jsonb DEFAULT '{}',
  nist_overall_score integer DEFAULT 0,
  iso42001_scores jsonb DEFAULT '{}',
  iso42001_overall_score integer DEFAULT 0,
  uae_scores jsonb DEFAULT '{}',
  uae_overall_score integer DEFAULT 0,
  overall_risk text NOT NULL,
  gap_analysis jsonb DEFAULT '[]',
  recommendations jsonb DEFAULT '[]',
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users"
  ON ai_systems
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read for anonymous users"
  ON ai_systems
  FOR SELECT
  TO anon
  USING (true);
