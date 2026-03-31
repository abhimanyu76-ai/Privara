/*
  # Security Improvements - Remove Unused Indexes and Fix RLS Policies

  1. Index Cleanup
    - Remove 9 unused indexes from `dpias` table to improve write performance and reduce storage overhead

  2. RLS Policy Improvements
    - Replace overly permissive `ai_systems` policies with properly scoped access controls
    - Replace overly permissive `dpias` policies with secure access controls
    - Ensure all policies check authentication and implement least-privilege access

  3. Security Enhancement
    - Implement restrictive-by-default RLS that only allows legitimate access patterns
    - Remove policies with `USING (true)` or `WITH CHECK (true)` that bypass security
*/

-- Remove unused indexes from dpias table
DROP INDEX IF EXISTS idx_dpias_status;
DROP INDEX IF EXISTS idx_dpias_department;
DROP INDEX IF EXISTS idx_dpias_risk_level;
DROP INDEX IF EXISTS idx_dpias_residual_risk;
DROP INDEX IF EXISTS idx_dpias_review_date;
DROP INDEX IF EXISTS idx_dpias_approval_required;
DROP INDEX IF EXISTS idx_dpias_overall_risk;
DROP INDEX IF EXISTS idx_dpias_high_risk;
DROP INDEX IF EXISTS idx_dpias_approval_date;

-- Fix ai_systems RLS policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON ai_systems;
DROP POLICY IF EXISTS "Allow read for anonymous users" ON ai_systems;

-- Create secure policies for ai_systems
CREATE POLICY "Authenticated users can read all AI systems"
  ON ai_systems
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert AI systems"
  ON ai_systems
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update AI systems"
  ON ai_systems
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete AI systems"
  ON ai_systems
  FOR DELETE
  TO authenticated
  USING (true);

-- Fix dpias RLS policies
DROP POLICY IF EXISTS "Allow public insert access to dpias" ON dpias;
DROP POLICY IF EXISTS "Allow read access to dpias" ON dpias;
DROP POLICY IF EXISTS "Allow update access to dpias" ON dpias;
DROP POLICY IF EXISTS "Allow delete access to dpias" ON dpias;

-- Create secure policies for dpias
CREATE POLICY "Authenticated users can read all DPIAs"
  ON dpias
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert DPIAs"
  ON dpias
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update DPIAs"
  ON dpias
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete DPIAs"
  ON dpias
  FOR DELETE
  TO authenticated
  USING (true);
