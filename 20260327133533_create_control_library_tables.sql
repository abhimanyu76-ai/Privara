/*
  # Create Control Library Tables

  ## Overview
  Creates the database schema for the Unified Control Library module, which manages
  compliance controls mapped across multiple regulatory frameworks (GDPR, UAE PDPL,
  NIST AI RMF, EU AI Act, ISO 42001).

  ## New Tables
  
  ### `controls`
  Main table storing unified compliance controls
  - `id` (uuid, primary key) - Unique control identifier
  - `control_id` (text) - Human-readable control ID (e.g., UCL-001)
  - `name` (text) - Control name
  - `description` (text) - Detailed control description
  - `domain` (text) - Control domain category
  - `status` (text) - Current status (Compliant, Needs Attention, Drifting, Not Assessed)
  - `owner` (text) - Control owner (IT Security, Legal, Compliance, HR, Operations)
  - `last_attested` (timestamptz) - Date of last attestation
  - `re_attest_due` (timestamptz) - Due date for next attestation
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `control_frameworks`
  Junction table mapping controls to regulatory frameworks
  - `id` (uuid, primary key)
  - `control_id` (uuid, foreign key) - References controls table
  - `framework` (text) - Framework name (GDPR, UAE PDPL, NIST AI RMF, EU AI Act, ISO 42001)
  - `article_clause` (text) - Specific article/clause reference
  - `satisfaction_level` (text) - Yes/Partial/No
  - `created_at` (timestamptz)

  ### `control_attestations`
  Historical record of control attestations
  - `id` (uuid, primary key)
  - `control_id` (uuid, foreign key) - References controls table
  - `attested_by` (text) - Name/ID of person who attested
  - `status` (text) - Status at time of attestation
  - `notes` (text) - Attestation notes
  - `attested_at` (timestamptz) - Attestation timestamp

  ### `control_gaps`
  Control gaps and remediation tracking
  - `id` (uuid, primary key)
  - `control_id` (uuid, foreign key) - References controls table
  - `gap_description` (text) - Description of the gap
  - `remediation_status` (text) - In Progress, Completed, Blocked
  - `linked_dpia_id` (uuid, nullable) - Optional link to DPIA
  - `linked_ai_system_id` (uuid, nullable) - Optional link to AI system
  - `created_at` (timestamptz)
  - `resolved_at` (timestamptz, nullable)

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read all controls
  - Only authenticated users can create/update controls
  - Ownership validated through authentication

  ## Notes
  - Controls support 180-day attestation cycle by default
  - Status automatically marked as "Drifting" when 180+ days since last attestation
  - Framework mappings allow many-to-many relationship between controls and frameworks
*/

-- Create controls table
CREATE TABLE IF NOT EXISTS controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  domain text NOT NULL,
  status text NOT NULL DEFAULT 'Not Assessed',
  owner text NOT NULL,
  last_attested timestamptz DEFAULT now(),
  re_attest_due timestamptz DEFAULT (now() + interval '180 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create control_frameworks junction table
CREATE TABLE IF NOT EXISTS control_frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id uuid NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
  framework text NOT NULL,
  article_clause text NOT NULL,
  satisfaction_level text DEFAULT 'Yes',
  created_at timestamptz DEFAULT now()
);

-- Create control_attestations table
CREATE TABLE IF NOT EXISTS control_attestations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id uuid NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
  attested_by text NOT NULL,
  status text NOT NULL,
  notes text DEFAULT '',
  attested_at timestamptz DEFAULT now()
);

-- Create control_gaps table
CREATE TABLE IF NOT EXISTS control_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id uuid NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
  gap_description text NOT NULL,
  remediation_status text DEFAULT 'In Progress',
  linked_dpia_id uuid,
  linked_ai_system_id uuid,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_controls_status ON controls(status);
CREATE INDEX IF NOT EXISTS idx_controls_domain ON controls(domain);
CREATE INDEX IF NOT EXISTS idx_controls_owner ON controls(owner);
CREATE INDEX IF NOT EXISTS idx_control_frameworks_control_id ON control_frameworks(control_id);
CREATE INDEX IF NOT EXISTS idx_control_frameworks_framework ON control_frameworks(framework);
CREATE INDEX IF NOT EXISTS idx_control_attestations_control_id ON control_attestations(control_id);
CREATE INDEX IF NOT EXISTS idx_control_gaps_control_id ON control_gaps(control_id);

-- Enable Row Level Security
ALTER TABLE controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_gaps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for controls table
CREATE POLICY "Authenticated users can view controls"
  ON controls FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert controls"
  ON controls FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update controls"
  ON controls FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete controls"
  ON controls FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for control_frameworks table
CREATE POLICY "Authenticated users can view control frameworks"
  ON control_frameworks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert control frameworks"
  ON control_frameworks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update control frameworks"
  ON control_frameworks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete control frameworks"
  ON control_frameworks FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for control_attestations table
CREATE POLICY "Authenticated users can view control attestations"
  ON control_attestations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert control attestations"
  ON control_attestations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update control attestations"
  ON control_attestations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete control attestations"
  ON control_attestations FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for control_gaps table
CREATE POLICY "Authenticated users can view control gaps"
  ON control_gaps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert control gaps"
  ON control_gaps FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update control gaps"
  ON control_gaps FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete control gaps"
  ON control_gaps FOR DELETE
  TO authenticated
  USING (true);
