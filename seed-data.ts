import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dpiaData = [
  {
    reference_number: 'DPIA-2026-001',
    assessment_name: 'Employee Performance Monitoring System',
    department: 'HR',
    processing_activity: 'Systematic monitoring of employee productivity through computer usage tracking, application monitoring, keystroke logging and periodic screen capture',
    purpose_of_processing: 'Monitor and evaluate employee productivity levels, identify underperformance, support performance review processes and ensure compliance with remote working policies',
    legal_basis_gdpr: 'Legitimate Interest',
    legal_basis_uae: 'Legitimate Interest',
    high_risk_processing: true,
    calculated_risk_level: 'HIGH',
    status: 'In Review',
    created_at: '2026-03-12T09:00:00Z',
    legitimate_interest_pursued: 'Operational efficiency and management of workforce performance to maintain business competitiveness and ensure fair performance evaluation',
    necessity_test_passed: false,
    necessity_alternative_explanation: 'Less intrusive alternatives such as output-based measurement were considered but deemed insufficient for roles requiring compliance monitoring',
    balancing_data_sensitivity: 4,
    balancing_expectations: 2,
    balancing_impact: 3,
    balancing_opt_out_available: false,
    balancing_opt_out_mechanism: '',
    balancing_conclusion: 'Legitimate interest is pursued but data subjects may not reasonably expect keystroke logging. Scope of monitoring should be limited and employees must be clearly informed via updated employment contracts and privacy notice',
    personal_data_types: ['Behavioural & Profiling Data', 'Location & Movement Data'],
    number_of_subjects: '1000 to 10000',
    data_minimisation_compliant: 'Partially',
    purpose_limitation_compliant: 'Stated purpose only',
    retention_period: '12 months from collection, deleted upon termination of employment',
    retention_legal_basis: 'Legitimate interest — performance management records',
    active_deletion_process: true,
    children_data: false,
    third_party_sharing: true,
    third_party_processors: [
      { name: 'WorkTrack Analytics Ltd', role: 'Processor', dataShared: 'Application usage and productivity metrics', country: 'United Kingdom', dpaInPlace: 'Yes' },
      { name: 'SecureCloud ME', role: 'Processor', dataShared: 'Encrypted data storage', country: 'UAE', dpaInPlace: 'Yes' }
    ],
    dpas_in_place: 'Yes',
    cross_border_transfers: true,
    transfer_mechanism: 'Standard Contractual Clauses',
    destination_countries: ['United Kingdom'],
    tia_conducted: 'Yes',
    sub_processors_documented: false,
    security_controls: {
      encryptionRest: { status: 'Yes', notes: '' },
      encryptionTransit: { status: 'Yes', notes: '' },
      e2eEncryption: { status: 'Partial', notes: 'Applied for data in transit, not for archived monitoring logs' },
      pseudonymisation: { status: 'Partial', notes: 'Employee IDs used in analytics dashboards, names visible to HR managers only' },
      rbac: { status: 'Yes', notes: '' },
      mfa: { status: 'Yes', notes: '' },
      auditLogging: { status: 'Yes', notes: '' },
      pentesting: { status: 'Yes', notes: 'Last conducted November 2025' },
      backupRecovery: { status: 'Yes', notes: '' },
      staffTraining: { status: 'Yes', notes: 'Completed January 2026' },
      incidentPlan: { status: 'Yes', notes: '' },
      privacyByDesign: { status: 'Partial', notes: 'Monitoring scope not fully minimised at design stage' },
    },
    controls_maturity_score: 83,
    dsr_assessment: {
      access: 'Yes',
      rectification: 'Yes',
      erasure: 'Partial',
      restriction: 'Yes',
      portability: 'No',
      object: 'No',
      automatedDecisions: 'Yes',
    },
    dpo_contact_name: 'Sarah Al Mansouri',
    dpo_contact_email: 'dpo@meridiangroup.ae',
    privacy_notice_date: '2026-02-01',
    art35_triggers: ['Systematic and extensive profiling with automated decision-making', 'Systematic monitoring of publicly accessible areas'],
    dpo_consulted_step7: true,
    data_subjects_consulted_step7: 'No',
    residual_risk_level: 'Medium — Additional controls required',
    dpo_signoff_name: 'Sarah Al Mansouri',
    business_owner_signoff: 'Khalid Al Rashidi, VP Human Resources',
    dpia_approval_date: '2026-03-18',
    overall_risk_score: 'HIGH',
  },
  {
    reference_number: 'DPIA-2026-002',
    assessment_name: 'Customer Behavioural Analytics Platform',
    department: 'Marketing',
    processing_activity: 'Collection and analysis of customer browsing behaviour, purchase history, demographic data and inferred preferences to build customer profiles for targeted marketing campaigns',
    purpose_of_processing: 'Personalise marketing communications, improve customer experience, increase conversion rates through targeted product recommendations',
    legal_basis_gdpr: 'Consent',
    legal_basis_uae: 'Consent',
    high_risk_processing: true,
    calculated_risk_level: 'MEDIUM',
    status: 'Approved',
    created_at: '2026-03-08T10:30:00Z',
    personal_data_types: ['Name & Contact Details', 'Behavioural & Profiling Data', 'Financial & Payment Data'],
    number_of_subjects: '10000 to 100000',
    data_minimisation_compliant: 'Yes',
    purpose_limitation_compliant: 'Stated purpose only',
    retention_period: '24 months from last interaction, then anonymised for aggregate analytics',
    active_deletion_process: true,
    children_data: false,
    third_party_sharing: true,
    third_party_processors: [
      { name: 'Adobe Experience Cloud', role: 'Processor', dataShared: 'Marketing analytics and campaign management', country: 'United States', dpaInPlace: 'Yes' },
      { name: 'Salesforce Inc', role: 'Processor', dataShared: 'CRM and customer data management', country: 'United States', dpaInPlace: 'Yes' }
    ],
    dpas_in_place: 'Yes',
    cross_border_transfers: true,
    transfer_mechanism: 'Standard Contractual Clauses',
    tia_conducted: 'Yes',
    controls_maturity_score: 79,
    dpo_contact_name: 'Sarah Al Mansouri',
    dpo_contact_email: 'dpo@meridiangroup.ae',
    privacy_notice_date: '2026-02-15',
    art35_triggers: ['Large-scale processing of special category data', 'Systematic and extensive profiling with automated decision-making'],
    dpo_consulted_step7: true,
    data_subjects_consulted_step7: 'Not Feasible',
    residual_risk_level: 'Acceptable / Low — Monitor',
    dpo_signoff_name: 'Sarah Al Mansouri',
    business_owner_signoff: 'Fatima Al Zaabi, Chief Marketing Officer',
    dpia_approval_date: '2026-03-10',
    overall_risk_score: 'MEDIUM',
  },
  {
    reference_number: 'DPIA-2026-003',
    assessment_name: 'Biometric Access Control System',
    department: 'Facilities',
    processing_activity: 'Fingerprint and facial recognition scanning for physical access control across all Meridian Group office premises and restricted areas',
    purpose_of_processing: 'Secure physical access to office premises, restrict access to sensitive areas, maintain audit trail of physical entry and exit for security and compliance purposes',
    legal_basis_gdpr: 'Consent',
    legal_basis_uae: 'Consent',
    high_risk_processing: true,
    calculated_risk_level: 'HIGH',
    status: 'Pending Approval',
    created_at: '2026-03-18T14:00:00Z',
    personal_data_types: ['Biometric Data (special category)', 'Name & Contact Details'],
    special_category_data: true,
    number_of_subjects: '1000 to 10000',
    data_minimisation_compliant: 'Yes',
    retention_period: 'Duration of employment plus 30 days',
    retention_legal_basis: 'Legitimate interest — security audit trail',
    active_deletion_process: true,
    third_party_sharing: true,
    third_party_processors: [
      { name: 'SecureEntry Systems LLC', role: 'Processor', dataShared: 'Biometric data processing and access management software', country: 'UAE', dpaInPlace: 'Yes' }
    ],
    dpas_in_place: 'Yes',
    cross_border_transfers: false,
    controls_maturity_score: 88,
    dpo_contact_name: 'Sarah Al Mansouri',
    dpo_contact_email: 'dpo@meridiangroup.ae',
    privacy_notice_date: '2026-03-01',
    art35_triggers: ['Systematic monitoring of publicly accessible areas', 'Large-scale processing of special category data', 'Processing using new or innovative technologies'],
    dpo_consulted_step7: true,
    data_subjects_consulted_step7: 'No',
    residual_risk_level: 'Medium — Additional controls required',
    dpo_signoff_name: 'Sarah Al Mansouri',
    business_owner_signoff: 'Hassan Al Nuaimi, Head of Facilities',
    overall_risk_score: 'HIGH',
  },
  {
    reference_number: 'DPIA-2026-004',
    assessment_name: 'Vendor Data Sharing — Logistics Partner',
    department: 'Procurement',
    processing_activity: 'Transfer of supplier and logistics partner employee contact data, delivery scheduling data and performance metrics to third-party logistics management platform',
    purpose_of_processing: 'Manage logistics operations, track deliveries, evaluate vendor performance and ensure contractual obligations are met',
    legal_basis_gdpr: 'Contract',
    legal_basis_uae: 'Contract',
    high_risk_processing: false,
    calculated_risk_level: 'MEDIUM',
    status: 'In Progress',
    created_at: '2026-03-15T11:20:00Z',
    personal_data_types: ['Name & Contact Details', 'Behavioural & Profiling Data'],
    number_of_subjects: '100 to 1000',
    data_minimisation_compliant: 'Yes',
    retention_period: 'Duration of vendor contract plus 7 years for financial records',
    active_deletion_process: false,
    third_party_sharing: true,
    third_party_processors: [
      { name: 'LogiTrack MENA', role: 'Processor', dataShared: 'Logistics and delivery management', country: 'Saudi Arabia', dpaInPlace: 'No' }
    ],
    dpas_in_place: 'In progress',
    cross_border_transfers: true,
    transfer_mechanism: 'Standard Contractual Clauses',
    controls_maturity_score: 71,
    dpo_contact_name: 'Sarah Al Mansouri',
    dpo_contact_email: 'dpo@meridiangroup.ae',
    overall_risk_score: 'MEDIUM',
  },
  {
    reference_number: 'DPIA-2026-005',
    assessment_name: 'Cloud Migration — Finance Data',
    department: 'IT',
    processing_activity: 'Migration of financial records, payroll data and accounts payable information from on-premise servers to cloud infrastructure hosted by Microsoft Azure UAE North region',
    purpose_of_processing: 'Modernise IT infrastructure, improve data availability and disaster recovery capability, reduce operational costs while maintaining compliance with UAE data residency requirements',
    legal_basis_gdpr: 'Legal Obligation',
    legal_basis_uae: 'Legal Obligation',
    high_risk_processing: false,
    calculated_risk_level: 'LOW',
    status: 'Complete',
    created_at: '2026-03-01T08:00:00Z',
    personal_data_types: ['Financial & Payment Data', 'Name & Contact Details'],
    number_of_subjects: '1000 to 10000',
    data_minimisation_compliant: 'Yes',
    retention_period: '7 years per UAE Commercial Companies Law',
    retention_legal_basis: 'Legal Obligation',
    active_deletion_process: true,
    third_party_sharing: true,
    third_party_processors: [
      { name: 'Microsoft Azure', role: 'Processor', dataShared: 'Cloud infrastructure and data storage', country: 'UAE (North region)', dpaInPlace: 'Yes' }
    ],
    dpas_in_place: 'Yes',
    cross_border_transfers: false,
    controls_maturity_score: 91,
    dpo_contact_name: 'Sarah Al Mansouri',
    dpo_contact_email: 'dpo@meridiangroup.ae',
    privacy_notice_date: '2026-02-15',
    art35_triggers: [],
    dpo_consulted_step7: true,
    data_subjects_consulted_step7: 'Not Feasible',
    residual_risk_level: 'Acceptable / Low — Monitor',
    dpo_signoff_name: 'Sarah Al Mansouri',
    business_owner_signoff: 'Mohammed Al Ketbi, Chief Financial Officer',
    dpia_approval_date: '2026-03-10',
    overall_risk_score: 'LOW',
  },
  {
    reference_number: 'DPIA-2026-006',
    assessment_name: 'AI-Powered Recruitment Screening',
    department: 'HR',
    processing_activity: 'Automated screening and scoring of job applications using AI algorithms that analyse CVs, cover letters and psychometric assessment results to shortlist candidates',
    purpose_of_processing: 'Improve efficiency of recruitment process, reduce time-to-hire, ensure consistent evaluation criteria across all applications',
    legal_basis_gdpr: 'Legitimate Interest',
    legal_basis_uae: 'Legitimate Interest',
    high_risk_processing: true,
    calculated_risk_level: 'HIGH',
    status: 'In Review',
    created_at: '2026-03-20T15:30:00Z',
    personal_data_types: ['Name & Contact Details', 'Behavioural & Profiling Data', 'Political Opinions (special category)'],
    special_category_data: true,
    number_of_subjects: '1000 to 10000',
    data_minimisation_compliant: 'Partially',
    active_deletion_process: false,
    controls_maturity_score: 55,
    dpo_contact_name: 'Sarah Al Mansouri',
    dpo_contact_email: 'dpo@meridiangroup.ae',
    art35_triggers: ['Systematic and extensive profiling with automated decision-making', 'Automated decision-making with legal or similarly significant effect', 'Processing using new or innovative technologies'],
    dpo_consulted_step7: true,
    residual_risk_level: 'High — DPA consultation required',
    dpo_signoff_name: 'Sarah Al Mansouri',
    business_owner_signoff: 'Layla Al Suwaidi, HR Director',
    overall_risk_score: 'HIGH',
  },
];

const aiSystemData = [
  {
    reference_number: 'AI-SYS-2026-001',
    system_name: 'Predictive Maintenance Model',
    department: 'Operations',
    ai_type: 'Predictive AI',
    primary_purpose: 'Analyses sensor data from industrial equipment to predict maintenance requirements and equipment failures before they occur, reducing downtime and maintenance costs',
    system_owner: 'Ahmed Al Hamdan, Head of Operations',
    vendor_type: 'In-house',
    vendor_name: '',
    deployment_date: '2024-06-15',
    affects_individuals: false,
    customer_facing: false,
    uses_personal_data: false,
    eu_ai_act_class: 'Limited',
    status: 'Active',
    nist_overall_score: 82,
    iso42001_overall_score: 97,
    uae_overall_score: 95,
    overall_risk: 'Low',
    created_at: '2024-06-15T09:00:00Z',
    eu_prohibited_practices: [false, false, false, false, false, false, false, false],
    nist_scores: {
      govern: [4, 3, 4, 3, 4],
      map: [3, 4, 3, 4, 3],
      measure: [4, 3, 3, 4, 4],
      manage: [3, 4, 3, 4, 3],
    },
    iso42001_scores: {
      clause4: ['Yes', 'Yes', 'Yes'],
      clause5: ['Yes', 'Yes', 'Yes'],
      clause6: ['Yes', 'Yes'],
      clause8: ['Yes', 'Yes', 'Yes', 'Yes'],
      clause9: ['Yes', 'Partial', 'Yes'],
      clause10: ['Yes', 'Yes'],
    },
    uae_scores: {
      ethics: [4, 4, 4, 4, 3, 4],
      strategy: [true, false, false, true],
      tdra: [false, false, true],
    },
    gap_analysis: [
      { framework: 'ISO 42001', description: 'Clause 9 internal audit partially complete — schedule annual audit', severity: 'Minor' },
      { framework: 'NIST', description: 'NIST Measure — consider third-party model validation', severity: 'Minor' }
    ],
    recommendations: [
      { priority: 'Low', title: 'Maintain current governance standard', frameworks: ['All'], effort: 'Low' },
      { priority: 'Low', title: 'Schedule annual reassessment', frameworks: ['NIST', 'ISO 42001'], effort: 'Low' }
    ],
  },
  {
    reference_number: 'AI-SYS-2026-002',
    system_name: 'HR Recruitment Screening AI',
    department: 'HR',
    ai_type: 'Decision Support',
    primary_purpose: 'Screens and scores job applications automatically by analysing CV content, work history patterns and psychometric assessment results. Generates a shortlist score for each candidate that HR managers use in recruitment decisions',
    system_owner: 'Layla Al Suwaidi, HR Director',
    vendor_type: 'Third-party',
    vendor_name: 'TalentSift AI',
    deployment_date: '2026-01-03',
    affects_individuals: true,
    customer_facing: false,
    uses_personal_data: true,
    eu_ai_act_class: 'High Risk',
    status: 'Active',
    nist_overall_score: 61,
    iso42001_overall_score: 55,
    uae_overall_score: 60,
    overall_risk: 'High',
    created_at: '2026-01-03T10:00:00Z',
    eu_prohibited_practices: [false, false, false, false, false, false, false, false],
    eu_high_risk_requirements: {
      techDoc: 'In Progress',
      logging: 'Yes',
      transparency: 'No',
      oversight: 'Partial',
      testing: 'Partial',
      conformity: 'No',
      registration: 'No',
    },
    nist_scores: {
      govern: [2, 2, 3, 2, 2],
      map: [2, 3, 2, 3, 2],
      measure: [2, 2, 3, 2, 3],
      manage: [3, 3, 2, 3, 2],
    },
    iso42001_scores: {
      clause4: ['Yes', 'Yes', 'Partial'],
      clause5: ['Partial', 'No', 'Yes'],
      clause6: ['Partial', 'Yes'],
      clause8: ['Yes', 'Yes', 'Partial', 'Yes'],
      clause9: ['Partial', 'No', 'Partial'],
      clause10: ['Yes', 'Partial'],
    },
    uae_scores: {
      ethics: [2, 1, 3, 3, 3, 2],
      strategy: [false, false, true, false],
      tdra: [false, false, false],
    },
    gap_analysis: [
      { framework: 'EU AI Act', description: 'Candidates must be informed AI is used in recruitment (Art.13). Automatic rejection without human review likely non-compliant with Art.14 human oversight requirements', severity: 'Critical' },
      { framework: 'NIST', description: 'No bias or fairness testing conducted. Risk of discriminatory outcomes based on gender, nationality or age cannot be ruled out. Immediate bias audit required', severity: 'Critical' },
      { framework: 'ISO 42001', description: 'No AI-specific policy for recruitment system. General AI policy insufficient for High Risk EU AI Act system', severity: 'Major' },
      { framework: 'UAE', description: 'Fairness principle not met. Transparency principle not met — UAE TDRA guidelines require disclosure of AI use in consequential decisions', severity: 'Major' },
      { framework: 'EU AI Act', description: 'Technical documentation (Art.11) not complete. Conformity assessment not conducted. EU AI Act database registration outstanding', severity: 'Major' }
    ],
    recommendations: [
      { priority: 'Critical', title: 'Immediately implement human review for ALL AI rejection decisions', frameworks: ['EU AI Act Art.14', 'UAE Ethics'], effort: 'Low' },
      { priority: 'Critical', title: 'Conduct bias audit across gender, nationality and age dimensions', frameworks: ['NIST Measure', 'UAE Fairness'], effort: 'Medium' },
      { priority: 'High', title: 'Update candidate communications to disclose AI use in screening', frameworks: ['EU AI Act Art.13'], effort: 'Low' },
      { priority: 'High', title: 'Complete technical documentation and conformity assessment', frameworks: ['EU AI Act Art.11'], effort: 'High' },
      { priority: 'Medium', title: 'Develop recruitment-specific AI governance policy', frameworks: ['ISO Clause 5', 'NIST Govern'], effort: 'Low' }
    ],
  },
  {
    reference_number: 'AI-SYS-2026-003',
    system_name: 'Customer Churn Prediction Model',
    department: 'Marketing',
    ai_type: 'Predictive AI',
    primary_purpose: 'Analyses customer transaction history, engagement patterns and service usage to predict likelihood of churn within next 90 days. Outputs a churn probability score used by account managers to prioritise retention outreach',
    system_owner: 'Fatima Al Zaabi, CMO',
    vendor_type: 'In-house',
    vendor_name: '',
    deployment_date: '2024-09-22',
    affects_individuals: true,
    customer_facing: false,
    uses_personal_data: true,
    eu_ai_act_class: 'Limited',
    status: 'Active',
    nist_overall_score: 78,
    iso42001_overall_score: 72,
    uae_overall_score: 80,
    overall_risk: 'Medium',
    created_at: '2024-09-22T11:30:00Z',
    eu_prohibited_practices: [false, false, false, false, false, false, false, false],
    gap_analysis: [
      { framework: 'NIST', description: 'NIST Manage — no formal process to handle cases where churn model is wrong', severity: 'Minor' }
    ],
    recommendations: [
      { priority: 'Medium', title: 'Implement model performance review quarterly and feedback loop from account managers', frameworks: ['NIST Manage'], effort: 'Medium' }
    ],
  },
  {
    reference_number: 'AI-SYS-2026-004',
    system_name: 'Fraud Detection Engine',
    department: 'Finance',
    ai_type: 'Automated Decision Making',
    primary_purpose: 'Real-time analysis of financial transactions to detect and automatically block potentially fraudulent activity. System flags suspicious transactions and in high-confidence cases automatically freezes the transaction pending manual review',
    system_owner: 'Mohammed Al Ketbi, CFO',
    vendor_type: 'Third-party',
    vendor_name: 'FraudShield Technologies',
    deployment_date: '2023-08-10',
    affects_individuals: true,
    customer_facing: true,
    uses_personal_data: true,
    eu_ai_act_class: 'High Risk',
    status: 'Active',
    nist_overall_score: 55,
    iso42001_overall_score: 48,
    uae_overall_score: 58,
    overall_risk: 'High',
    created_at: '2023-08-10T08:00:00Z',
    eu_prohibited_practices: [false, false, false, false, false, false, false, false],
    gap_analysis: [
      { framework: 'NIST', description: 'False positive rate not monitored. Customers incorrectly blocked suffer financial harm. Requires immediate false positive tracking and SLA for resolution', severity: 'Critical' },
      { framework: 'UAE', description: 'Accountability gap — when system incorrectly blocks a legitimate transaction, no clear accountability path exists for customer redress', severity: 'Critical' },
      { framework: 'ISO 42001', description: 'Third-party vendor (FraudShield) AI model is a black box — internal team cannot explain individual decisions. Explainability requirement not met', severity: 'Major' },
      { framework: 'EU AI Act', description: 'High Risk classification requires conformity assessment and technical documentation. Neither complete', severity: 'Major' }
    ],
    recommendations: [
      { priority: 'Critical', title: 'Implement false positive monitoring dashboard — track rate weekly, set maximum acceptable threshold of 2%', frameworks: ['NIST Measure'], effort: 'Medium' },
      { priority: 'Critical', title: 'Establish clear customer redress process for incorrect blocks with resolution SLA of 4 hours', frameworks: ['UAE Ethics'], effort: 'Low' },
      { priority: 'High', title: 'Request model explainability documentation from FraudShield — contractual right to explanation', frameworks: ['ISO 42001'], effort: 'Low' }
    ],
  },
  {
    reference_number: 'AI-SYS-2026-005',
    system_name: 'Legal Document Classifier',
    department: 'Legal',
    ai_type: 'Natural Language Processing',
    primary_purpose: 'Automatically classifies and routes incoming legal documents, contracts and correspondence to the appropriate legal team member based on document type, jurisdiction and subject matter',
    system_owner: 'Omar Al Mazrouei, General Counsel',
    vendor_type: 'In-house',
    vendor_name: '',
    deployment_date: '2025-03-14',
    affects_individuals: false,
    customer_facing: false,
    uses_personal_data: false,
    eu_ai_act_class: 'Minimal',
    status: 'Active',
    nist_overall_score: 90,
    iso42001_overall_score: 88,
    uae_overall_score: 92,
    overall_risk: 'Low',
    created_at: '2025-03-14T13:00:00Z',
    eu_prohibited_practices: [false, false, false, false, false, false, false, false],
    gap_analysis: [],
    recommendations: [
      { priority: 'Low', title: 'Document model retraining schedule formally and conduct annual third-party validation', frameworks: ['All'], effort: 'Low' }
    ],
  },
  {
    reference_number: 'AI-SYS-2026-006',
    system_name: 'Biometric Access Vision System',
    department: 'Facilities',
    ai_type: 'Computer Vision',
    primary_purpose: 'Facial recognition system for employee access control at Meridian Group headquarters and two satellite offices. System matches facial scan against registered employee database to grant or deny physical access',
    system_owner: 'Hassan Al Nuaimi, Head of Facilities',
    vendor_type: 'Third-party',
    vendor_name: 'VisionAccess Gulf LLC',
    deployment_date: '2025-11-01',
    affects_individuals: true,
    customer_facing: false,
    uses_personal_data: true,
    eu_ai_act_class: 'Unacceptable',
    status: 'Active',
    nist_overall_score: 48,
    iso42001_overall_score: 42,
    uae_overall_score: 50,
    overall_risk: 'High',
    created_at: '2025-11-01T07:00:00Z',
    eu_prohibited_practices: [false, false, false, true, false, false, false, false],
    gap_analysis: [
      { framework: 'EU AI Act', description: 'PROHIBITED — Prohibited use screening triggered. Facial recognition in publicly accessible common areas may be prohibited under Art.5(1)(h). Legal review required immediately', severity: 'Critical' },
      { framework: 'NIST', description: 'No AI governance policy covers biometric systems specifically. No ethical review conducted prior to deployment', severity: 'Critical' },
      { framework: 'UAE', description: 'Biometric processing without explicit informed consent for all employees may violate UAE PDPL and ethical principles. Consent obtained at onboarding but not specific to facial recognition', severity: 'Critical' }
    ],
    recommendations: [
      { priority: 'Critical', title: 'Immediate legal review required — possible prohibited AI practice under EU AI Act Art.5', frameworks: ['EU AI Act'], effort: 'High' },
      { priority: 'Critical', title: 'Obtain explicit consent from all employees specifically for facial recognition processing', frameworks: ['UAE PDPL'], effort: 'Medium' },
      { priority: 'High', title: 'Develop biometric AI-specific governance policy with ethical review', frameworks: ['NIST Govern'], effort: 'Medium' }
    ],
  },
];

async function seedDatabase() {
  console.log('Starting database seed...');

  console.log('Inserting DPIAs...');
  for (const dpia of dpiaData) {
    const { error } = await supabase
      .from('dpias')
      .insert(dpia);

    if (error) {
      console.error(`Error inserting DPIA ${dpia.reference_number}:`, error);
    } else {
      console.log(`✓ Inserted DPIA ${dpia.reference_number}`);
    }
  }

  console.log('Inserting AI Systems...');
  for (const system of aiSystemData) {
    const { error } = await supabase
      .from('ai_systems')
      .insert(system);

    if (error) {
      console.error(`Error inserting AI System ${system.reference_number}:`, error);
    } else {
      console.log(`✓ Inserted AI System ${system.reference_number}`);
    }
  }

  console.log('Database seed complete!');
}

seedDatabase().catch(console.error);
