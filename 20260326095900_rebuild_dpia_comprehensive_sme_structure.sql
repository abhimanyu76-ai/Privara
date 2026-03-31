/*
  # Rebuild DPIA Tables for SME-Grade Assessment

  1. Schema Changes
    - Add Step 1 fields: legal basis, UAE PDPL basis, high risk flag
    - Add Step 2 fields: legitimate interest balancing test (conditional)
    - Add Step 3 fields: enhanced data inventory with special categories
    - Add Step 4 fields: third party processors table, transfers
    - Add Step 5 fields: technical/organisational measures checklist
    - Add Step 6 fields: data subject rights assessment
    - Add Step 7 fields: Art.35 triggers, DPO consultation, risk calculation
    - Add review and approval workflow fields

  2. New Fields Added to `dpias`
    Step 1:
    - `legal_basis_gdpr` (text) - GDPR Art.6 legal basis
    - `legal_basis_uae` (text) - UAE PDPL legal basis
    - `high_risk_processing` (boolean) - High risk flag
    - `lia_required` (boolean) - Legitimate Interest Assessment required
    
    Step 2 (Balancing Test):
    - `legitimate_interest_pursued` (text) - Specific legitimate interest
    - `necessity_test_passed` (boolean) - Could less intrusive method work
    - `necessity_alternative_explanation` (text) - Why alternative rejected
    - `balancing_data_sensitivity` (integer) - 1-5 scale
    - `balancing_expectations` (integer) - 1-5 scale
    - `balancing_impact` (integer) - 1-5 scale
    - `balancing_opt_out_available` (boolean) - Can subjects opt out
    - `balancing_opt_out_mechanism` (text) - How to opt out
    - `balancing_conclusion` (text) - Balancing test conclusion
    
    Step 3 (Data Inventory):
    - `special_category_data` (boolean) - Processing special categories
    - `children_data` (boolean) - Processing children's data
    - `data_minimisation_compliant` (text) - Yes/No/Partial
    - `purpose_limitation_compliant` (text) - Stated purpose only / Secondary use
    - `secondary_use_description` (text) - Secondary use details
    - `retention_legal_basis` (text) - Legal basis for retention
    - `active_deletion_process` (boolean) - Deletion at end of retention
    
    Step 4 (Transfers):
    - `third_party_processors` (jsonb) - Array of processor details
    - `dpas_in_place` (text) - Yes/No/In progress
    - `cross_border_transfers` (boolean) - Transfers outside UAE/EEA
    - `transfer_mechanism` (text) - Adequacy/SCCs/BCRs etc
    - `destination_countries` (jsonb) - Array of countries
    - `tia_conducted` (text) - Yes/No/Not Required
    - `sub_processors_documented` (boolean) - Sub-processors approved
    
    Step 5 (Security Controls):
    - `security_controls` (jsonb) - Checklist with Yes/No/Partial
    - `controls_maturity_score` (integer) - Percentage score
    
    Step 6 (Data Subject Rights):
    - `dsr_assessment` (jsonb) - Rights assessment checklist
    - `dpo_contact_name` (text) - DPO name
    - `dpo_contact_email` (text) - DPO email
    - `privacy_notice_date` (date) - When notice provided
    
    Step 7 (Art.35 & Risk):
    - `art35_triggers` (jsonb) - Array of triggered criteria
    - `dpo_consulted_step7` (boolean) - DPO reviewed DPIA
    - `data_subjects_consulted_step7` (text) - Yes/No/Not Feasible
    - `dpo_signoff_name` (text) - DPO sign-off
    - `business_owner_signoff` (text) - Business owner sign-off
    - `dpia_approval_date` (date) - Approval date
    - `overall_risk_score` (text) - HIGH/MEDIUM/LOW
    - `risk_calculation_details` (jsonb) - Breakdown of risk factors

  3. Notes
    - Supports GDPR Art.6, Art.9, Art.35, Art.36
    - Supports UAE PDPL compliance
    - Conditional Step 2 based on legitimate interest
    - Comprehensive risk calculation across all steps
    - Full audit trail and approval workflow
*/

ALTER TABLE dpias 
ADD COLUMN IF NOT EXISTS legal_basis_gdpr text,
ADD COLUMN IF NOT EXISTS legal_basis_uae text,
ADD COLUMN IF NOT EXISTS high_risk_processing boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS lia_required boolean DEFAULT false,

ADD COLUMN IF NOT EXISTS legitimate_interest_pursued text,
ADD COLUMN IF NOT EXISTS necessity_test_passed boolean,
ADD COLUMN IF NOT EXISTS necessity_alternative_explanation text,
ADD COLUMN IF NOT EXISTS balancing_data_sensitivity integer,
ADD COLUMN IF NOT EXISTS balancing_expectations integer,
ADD COLUMN IF NOT EXISTS balancing_impact integer,
ADD COLUMN IF NOT EXISTS balancing_opt_out_available boolean,
ADD COLUMN IF NOT EXISTS balancing_opt_out_mechanism text,
ADD COLUMN IF NOT EXISTS balancing_conclusion text,

ADD COLUMN IF NOT EXISTS special_category_data boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS children_data boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS data_minimisation_compliant text,
ADD COLUMN IF NOT EXISTS purpose_limitation_compliant text,
ADD COLUMN IF NOT EXISTS secondary_use_description text,
ADD COLUMN IF NOT EXISTS retention_legal_basis text,
ADD COLUMN IF NOT EXISTS active_deletion_process boolean,

ADD COLUMN IF NOT EXISTS third_party_processors jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS dpas_in_place text,
ADD COLUMN IF NOT EXISTS cross_border_transfers boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS transfer_mechanism text,
ADD COLUMN IF NOT EXISTS destination_countries jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tia_conducted text,
ADD COLUMN IF NOT EXISTS sub_processors_documented boolean,

ADD COLUMN IF NOT EXISTS security_controls jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS controls_maturity_score integer,

ADD COLUMN IF NOT EXISTS dsr_assessment jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS dpo_contact_name text,
ADD COLUMN IF NOT EXISTS dpo_contact_email text,
ADD COLUMN IF NOT EXISTS privacy_notice_date date,

ADD COLUMN IF NOT EXISTS art35_triggers jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS dpo_consulted_step7 boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS data_subjects_consulted_step7 text,
ADD COLUMN IF NOT EXISTS dpo_signoff_name text,
ADD COLUMN IF NOT EXISTS business_owner_signoff text,
ADD COLUMN IF NOT EXISTS dpia_approval_date date,
ADD COLUMN IF NOT EXISTS overall_risk_score text,
ADD COLUMN IF NOT EXISTS risk_calculation_details jsonb DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_dpias_overall_risk ON dpias(overall_risk_score);
CREATE INDEX IF NOT EXISTS idx_dpias_high_risk ON dpias(high_risk_processing);
CREATE INDEX IF NOT EXISTS idx_dpias_approval_date ON dpias(dpia_approval_date);
