/*
  # Create DPIA Management Tables

  1. New Tables
    - `dpias`
      - `id` (uuid, primary key)
      - `reference_number` (text, unique) - Format: DPIA-2026-XXX
      - `assessment_name` (text) - Name of the DPIA
      - `department` (text) - Department conducting DPIA
      - `processing_activity` (text) - Description of processing activity
      - `data_controller_name` (text) - Name of data controller
      - `purpose_of_processing` (text) - Purpose description
      - `legal_basis` (text) - Legal basis for processing
      - `personal_data_types` (jsonb) - Array of data types
      - `number_of_subjects` (text) - Range of data subjects
      - `retention_period` (text) - Data retention period
      - `third_party_sharing` (boolean) - Whether data is shared
      - `third_party_names` (text) - Names of third parties
      - `international_transfers` (boolean) - International transfers flag
      - `transfer_countries` (text) - Countries for transfers
      - `risk_answers` (jsonb) - Array of risk assessment answers
      - `calculated_risk_level` (text) - High/Medium/Low
      - `status` (text) - Draft/In Review/Approved/Pending/Complete
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_by` (uuid) - User who created (nullable for now)

  2. Security
    - Enable RLS on `dpias` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public insert access (for demo purposes)
    
  3. Notes
    - Using public access policies since auth is not yet implemented
    - Will restrict to authenticated users when auth is added
*/

CREATE TABLE IF NOT EXISTS dpias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  assessment_name text NOT NULL,
  department text NOT NULL,
  processing_activity text NOT NULL,
  data_controller_name text NOT NULL,
  purpose_of_processing text NOT NULL,
  legal_basis text NOT NULL,
  personal_data_types jsonb DEFAULT '[]'::jsonb,
  number_of_subjects text NOT NULL,
  retention_period text NOT NULL,
  third_party_sharing boolean DEFAULT false,
  third_party_names text,
  international_transfers boolean DEFAULT false,
  transfer_countries text,
  risk_answers jsonb DEFAULT '[]'::jsonb,
  calculated_risk_level text NOT NULL,
  status text DEFAULT 'In Review',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);

ALTER TABLE dpias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to dpias"
  ON dpias
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to dpias"
  ON dpias
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_dpias_status ON dpias(status);
CREATE INDEX IF NOT EXISTS idx_dpias_department ON dpias(department);
CREATE INDEX IF NOT EXISTS idx_dpias_risk_level ON dpias(calculated_risk_level);
CREATE INDEX IF NOT EXISTS idx_dpias_created_at ON dpias(created_at DESC);
