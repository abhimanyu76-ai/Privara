/*
  # Enhance DPIA Tables for Comprehensive Assessment

  1. Schema Changes
    - Add comprehensive impact analysis fields
    - Add data flow and lifecycle tracking
    - Add necessity and proportionality assessment
    - Add safeguards and mitigation measures
    - Add consultation and accountability fields
    - Add residual risk scoring
    - Add compliance mapping

  2. New Fields Added to `dpias`
    - `data_sources` (text) - Where data originates from
    - `data_recipients` (text) - Who receives the data
    - `data_lifecycle` (text) - Data retention and deletion process
    - `automated_decision_making` (boolean) - ADM flag
    - `adm_description` (text) - Description of automated decisions
    - `profiling_activities` (boolean) - Profiling flag
    - `profiling_description` (text) - Profiling details
    - `necessity_justification` (text) - Why processing is necessary
    - `proportionality_assessment` (text) - Proportionality analysis
    - `data_minimization_measures` (text) - How data is minimized
    - `rights_impact_assessment` (text) - Impact on data subject rights
    - `security_measures` (jsonb) - Technical and organizational measures
    - `breach_procedures` (text) - Data breach response plan
    - `dpo_consulted` (boolean) - DPO consultation flag
    - `dpo_advice` (text) - DPO recommendations
    - `data_subjects_consulted` (boolean) - Consultation flag
    - `consultation_summary` (text) - Consultation outcomes
    - `mitigation_measures` (jsonb) - Risk mitigation actions
    - `residual_risk_level` (text) - Risk after mitigation
    - `approval_required` (boolean) - Supervisory authority approval
    - `approved_by` (text) - Name of approver
    - `approval_date` (timestamptz) - Date of approval
    - `review_date` (timestamptz) - Next review date
    - `compliance_frameworks` (jsonb) - Applicable regulations
    
  3. Notes
    - Fields allow for comprehensive GDPR Article 35 compliance
    - Supports EDPB guidelines on DPIA
    - Enables tracking of accountability measures
    - Facilitates demonstration of compliance
*/

ALTER TABLE dpias 
ADD COLUMN IF NOT EXISTS data_sources text,
ADD COLUMN IF NOT EXISTS data_recipients text,
ADD COLUMN IF NOT EXISTS data_lifecycle text,
ADD COLUMN IF NOT EXISTS automated_decision_making boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS adm_description text,
ADD COLUMN IF NOT EXISTS profiling_activities boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS profiling_description text,
ADD COLUMN IF NOT EXISTS necessity_justification text,
ADD COLUMN IF NOT EXISTS proportionality_assessment text,
ADD COLUMN IF NOT EXISTS data_minimization_measures text,
ADD COLUMN IF NOT EXISTS rights_impact_assessment text,
ADD COLUMN IF NOT EXISTS security_measures jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS breach_procedures text,
ADD COLUMN IF NOT EXISTS dpo_consulted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS dpo_advice text,
ADD COLUMN IF NOT EXISTS data_subjects_consulted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS consultation_summary text,
ADD COLUMN IF NOT EXISTS mitigation_measures jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS residual_risk_level text,
ADD COLUMN IF NOT EXISTS approval_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_by text,
ADD COLUMN IF NOT EXISTS approval_date timestamptz,
ADD COLUMN IF NOT EXISTS review_date timestamptz,
ADD COLUMN IF NOT EXISTS compliance_frameworks jsonb DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_dpias_residual_risk ON dpias(residual_risk_level);
CREATE INDEX IF NOT EXISTS idx_dpias_review_date ON dpias(review_date);
CREATE INDEX IF NOT EXISTS idx_dpias_approval_required ON dpias(approval_required);
