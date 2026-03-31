import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const controls = [
  {
    control_id: 'UCL-001',
    name: 'Encryption at Rest',
    description: 'Personal data and AI training data must be encrypted at rest using AES-256 or equivalent. Encryption keys managed separately from data.',
    domain: 'Data Security',
    status: 'Compliant',
    owner: 'IT Security',
    last_attested: '2026-02-15',
    re_attest_due: '2026-08-15',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.32' },
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'ISO 42001', article_clause: 'Cl.8' },
      { framework: 'UAE PDPL', article_clause: 'General' }
    ]
  },
  {
    control_id: 'UCL-002',
    name: 'Encryption in Transit',
    description: 'All data transmission must use TLS 1.2 or higher. End-to-end encryption required for sensitive personal data transfers.',
    domain: 'Data Security',
    status: 'Compliant',
    owner: 'IT Security',
    last_attested: '2026-02-15',
    re_attest_due: '2026-08-15',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.32' },
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'ISO 42001', article_clause: 'Cl.8' }
    ]
  },
  {
    control_id: 'UCL-003',
    name: 'Role-Based Access Control',
    description: 'Access to personal data and AI systems must be controlled through RBAC. Principle of least privilege enforced.',
    domain: 'Data Security',
    status: 'Compliant',
    owner: 'IT Security',
    last_attested: '2026-01-10',
    re_attest_due: '2026-07-10',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.32' },
      { framework: 'NIST AI RMF', article_clause: 'Govern' },
      { framework: 'ISO 42001', article_clause: 'Cl.8' },
      { framework: 'EU AI Act', article_clause: 'Art.14' }
    ]
  },
  {
    control_id: 'UCL-004',
    name: 'Multi-Factor Authentication',
    description: 'MFA required for all access to systems processing personal data or AI systems. Exception process documented.',
    domain: 'Data Security',
    status: 'Needs Attention',
    owner: 'IT Security',
    last_attested: '2026-01-10',
    re_attest_due: '2026-07-10',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.32' },
      { framework: 'NIST AI RMF', article_clause: 'Govern' },
      { framework: 'ISO 42001', article_clause: 'Cl.8' }
    ]
  },
  {
    control_id: 'UCL-005',
    name: 'Audit Logging & Monitoring',
    description: 'Comprehensive audit logs maintained for all access to personal data and AI system operations. Logs retained for 24 months.',
    domain: 'Data Security',
    status: 'Compliant',
    owner: 'IT Security',
    last_attested: '2026-02-20',
    re_attest_due: '2026-08-20',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.32' },
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'EU AI Act', article_clause: 'Art.12' },
      { framework: 'ISO 42001', article_clause: 'Cl.9' }
    ]
  },
  {
    control_id: 'UCL-006',
    name: 'AI Governance Policy',
    description: 'Comprehensive AI governance policy covering development, deployment, monitoring and retirement of AI systems.',
    domain: 'AI Accountability',
    status: 'Needs Attention',
    owner: 'Compliance',
    last_attested: '2026-01-05',
    re_attest_due: '2026-07-05',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Govern' },
      { framework: 'ISO 42001', article_clause: 'Cl.5' },
      { framework: 'EU AI Act', article_clause: 'Art.9' }
    ]
  },
  {
    control_id: 'UCL-007',
    name: 'Bias & Fairness Testing',
    description: 'All AI systems undergo bias and fairness testing before deployment and quarterly thereafter. Testing methodology documented.',
    domain: 'AI Accountability',
    status: 'Drifting',
    owner: 'IT Security',
    last_attested: '2025-09-01',
    re_attest_due: '2026-03-01',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'EU AI Act', article_clause: 'Art.15' },
      { framework: 'ISO 42001', article_clause: 'Cl.9' }
    ]
  },
  {
    control_id: 'UCL-008',
    name: 'Human Oversight of AI Decisions',
    description: 'Human oversight required for AI decisions with significant impact on individuals. Override mechanism in place.',
    domain: 'AI Accountability',
    status: 'Needs Attention',
    owner: 'Compliance',
    last_attested: '2026-02-15',
    re_attest_due: '2026-08-15',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.22' },
      { framework: 'NIST AI RMF', article_clause: 'Manage' },
      { framework: 'EU AI Act', article_clause: 'Art.14' }
    ]
  },
  {
    control_id: 'UCL-009',
    name: 'AI Incident Response Plan',
    description: 'Documented incident response plan for AI system failures, bias incidents, and security breaches. Plan tested annually.',
    domain: 'AI Accountability',
    status: 'Drifting',
    owner: 'Compliance',
    last_attested: '2023-08-10',
    re_attest_due: '2024-02-10',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Manage' },
      { framework: 'ISO 42001', article_clause: 'Cl.10' }
    ]
  },
  {
    control_id: 'UCL-010',
    name: 'Model Performance Monitoring',
    description: 'Continuous monitoring of AI model performance, accuracy, and drift. Automated alerts for threshold breaches.',
    domain: 'AI Accountability',
    status: 'Compliant',
    owner: 'IT Security',
    last_attested: '2026-03-01',
    re_attest_due: '2026-09-01',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'ISO 42001', article_clause: 'Cl.9' },
      { framework: 'EU AI Act', article_clause: 'Art.12' }
    ]
  },
  {
    control_id: 'UCL-011',
    name: 'Right of Access Fulfilment',
    description: 'Process for fulfilling data subject access requests within 30 days. Automated retrieval systems in place.',
    domain: 'Privacy Rights',
    status: 'Compliant',
    owner: 'Legal',
    last_attested: '2026-01-20',
    re_attest_due: '2026-07-20',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.15' },
      { framework: 'UAE PDPL', article_clause: 'Art.12' }
    ]
  },
  {
    control_id: 'UCL-012',
    name: 'Right to Erasure Process',
    description: 'Process for handling erasure requests including backup systems. Verification and confirmation provided to data subjects.',
    domain: 'Privacy Rights',
    status: 'Needs Attention',
    owner: 'Legal',
    last_attested: '2026-01-20',
    re_attest_due: '2026-07-20',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.17' },
      { framework: 'UAE PDPL', article_clause: 'Art.14' }
    ]
  },
  {
    control_id: 'UCL-013',
    name: 'Consent Management',
    description: 'Consent management platform tracks opt-ins, withdrawals, and preferences. Granular consent options available.',
    domain: 'Privacy Rights',
    status: 'Compliant',
    owner: 'Legal',
    last_attested: '2026-02-01',
    re_attest_due: '2026-08-01',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.7' },
      { framework: 'UAE PDPL', article_clause: 'Art.9' }
    ]
  },
  {
    control_id: 'UCL-014',
    name: 'Standard Contractual Clauses',
    description: 'Standard Contractual Clauses in place for all international data transfers. Annual review and updates conducted.',
    domain: 'Cross-border Transfers',
    status: 'Compliant',
    owner: 'Legal',
    last_attested: '2026-02-10',
    re_attest_due: '2026-08-10',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.46' },
      { framework: 'UAE PDPL', article_clause: 'Art.26' }
    ]
  },
  {
    control_id: 'UCL-015',
    name: 'Transfer Impact Assessment',
    description: 'Transfer impact assessments conducted for all transfers to third countries. Supplementary measures identified.',
    domain: 'Cross-border Transfers',
    status: 'Drifting',
    owner: 'Legal',
    last_attested: '2026-03-15',
    re_attest_due: '2026-09-15',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.46' },
      { framework: 'UAE PDPL', article_clause: 'Art.26' },
      { framework: 'NIST AI RMF', article_clause: 'Map' }
    ]
  },
  {
    control_id: 'UCL-016',
    name: 'Prompt Injection Controls',
    description: 'Prompt injection detection and prevention controls for LLM and generative AI systems. Input validation and output filtering implemented.',
    domain: 'AI Security',
    status: 'Needs Attention',
    owner: 'IT Security',
    last_attested: '2026-02-01',
    re_attest_due: '2026-08-01',
    frameworks: [
      { framework: 'OWASP LLM', article_clause: 'LLM01' },
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'EU AI Act', article_clause: 'Art.15' }
    ]
  },
  {
    control_id: 'UCL-017',
    name: 'Model Access & API Security',
    description: 'AI model APIs secured with authentication, rate limiting and access controls. Model files protected from unauthorized access.',
    domain: 'AI Security',
    status: 'Needs Attention',
    owner: 'IT Security',
    last_attested: '2026-02-01',
    re_attest_due: '2026-08-01',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Govern' },
      { framework: 'ISO 42001', article_clause: 'Cl.8' },
      { framework: 'GDPR', article_clause: 'Art.32' }
    ]
  },
  {
    control_id: 'UCL-018',
    name: 'Training Data Integrity',
    description: 'AI training data provenance documented. Data integrity verification and anomaly detection controls in place. Protection against data poisoning attacks.',
    domain: 'AI Security',
    status: 'Drifting',
    owner: 'IT Security',
    last_attested: '2025-06-01',
    re_attest_due: '2025-12-01',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Map' },
      { framework: 'ISO 42001', article_clause: 'Cl.8' },
      { framework: 'MITRE ATLAS', article_clause: 'AML.T0020' }
    ]
  },
  {
    control_id: 'UCL-019',
    name: 'Model Signing & Versioning',
    description: 'AI models cryptographically signed. Version control and rollback capability documented and tested.',
    domain: 'AI Security',
    status: 'Compliant',
    owner: 'IT Security',
    last_attested: '2026-01-15',
    re_attest_due: '2026-07-15',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Manage' },
      { framework: 'ISO 42001', article_clause: 'Cl.8' }
    ]
  },
  {
    control_id: 'UCL-020',
    name: 'AI Output Filtering',
    description: 'Output filtering and content safety controls for AI-generated content. PII detection before user delivery.',
    domain: 'AI Security',
    status: 'Needs Attention',
    owner: 'IT Security',
    last_attested: '2026-02-10',
    re_attest_due: '2026-08-10',
    frameworks: [
      { framework: 'OWASP LLM', article_clause: 'LLM06' },
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'EU AI Act', article_clause: 'Art.13' }
    ]
  },
  {
    control_id: 'UCL-021',
    name: 'Adversarial Input Detection',
    description: 'Detection of adversarial examples and evasion attacks. Input validation before model inference.',
    domain: 'AI Security',
    status: 'Drifting',
    owner: 'IT Security',
    last_attested: '2025-08-01',
    re_attest_due: '2026-02-01',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'EU AI Act', article_clause: 'Art.15' },
      { framework: 'MITRE ATLAS', article_clause: 'AML.T0015' }
    ]
  },
  {
    control_id: 'UCL-022',
    name: 'AI Supply Chain Due Diligence',
    description: 'Third-party AI components and foundation models assessed for security. Vendor contracts include security incident notification clauses.',
    domain: 'AI Security',
    status: 'Needs Attention',
    owner: 'Legal',
    last_attested: '2026-02-15',
    re_attest_due: '2026-08-15',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Map' },
      { framework: 'ISO 42001', article_clause: 'Cl.8' },
      { framework: 'EU AI Act', article_clause: 'Art.9' }
    ]
  },
  {
    control_id: 'UCL-023',
    name: 'Model Rollback Capability',
    description: 'AI model rollback procedures documented and tested. Capability to revert to previous model version in case of security compromise.',
    domain: 'AI Security',
    status: 'Compliant',
    owner: 'IT Security',
    last_attested: '2026-03-01',
    re_attest_due: '2026-09-01',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Manage' },
      { framework: 'ISO 42001', article_clause: 'Cl.10' }
    ]
  },
  {
    control_id: 'UCL-024',
    name: 'PII Leakage Prevention in AI',
    description: 'Controls to prevent AI models from leaking PII through model inversion or membership inference attacks. Differential privacy applied where applicable.',
    domain: 'AI Security',
    status: 'Drifting',
    owner: 'IT Security',
    last_attested: '2025-09-01',
    re_attest_due: '2026-03-01',
    frameworks: [
      { framework: 'GDPR', article_clause: 'Art.32' },
      { framework: 'UAE PDPL', article_clause: 'General' },
      { framework: 'OWASP LLM', article_clause: 'LLM06' },
      { framework: 'MITRE ATLAS', article_clause: 'AML.T0024' }
    ]
  },
  {
    control_id: 'UCL-025',
    name: 'AI Incident Detection',
    description: 'AI-specific incident detection covering model manipulation, adversarial attacks and data poisoning. SIEM configured for AI system anomalies.',
    domain: 'AI Security',
    status: 'Needs Attention',
    owner: 'Compliance',
    last_attested: '2026-02-10',
    re_attest_due: '2026-08-10',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Manage' },
      { framework: 'ISO 42001', article_clause: 'Cl.10' },
      { framework: 'EU AI Act', article_clause: 'Art.12' }
    ]
  },
  {
    control_id: 'UCL-026',
    name: 'Red Team Exercise Programme',
    description: 'Regular red team exercises for high-risk AI systems. Adversarial testing and security validation documented.',
    domain: 'AI Security',
    status: 'Drifting',
    owner: 'Compliance',
    last_attested: '2025-01-01',
    re_attest_due: '2025-07-01',
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'EU AI Act', article_clause: 'Art.15' }
    ]
  },
  {
    control_id: 'UCL-027',
    name: 'GenAI Hallucination Controls',
    description: 'Hallucination detection and grounding mechanisms for generative AI systems. Output validation before consequential actions.',
    domain: 'AI Security',
    status: 'Not Assessed',
    owner: 'IT Security',
    last_attested: null,
    re_attest_due: null,
    frameworks: [
      { framework: 'NIST AI RMF', article_clause: 'Measure' },
      { framework: 'EU AI Act', article_clause: 'Art.13' },
      { framework: 'UAE AI Ethics', article_clause: 'General' }
    ]
  }
];

async function seedControls() {
  console.log('Starting control library seed...');

  for (const control of controls) {
    const { frameworks, ...controlData } = control;

    const { data: insertedControl, error: controlError } = await supabase
      .from('controls')
      .insert(controlData)
      .select()
      .maybeSingle();

    if (controlError) {
      console.error(`Error inserting control ${control.control_id}:`, controlError);
      continue;
    }

    if (insertedControl) {
      console.log(`✓ Inserted control ${control.control_id}`);

      const frameworkMappings = frameworks.map(fw => ({
        control_id: insertedControl.id,
        framework: fw.framework,
        article_clause: fw.article_clause,
        satisfaction_level: 'Yes'
      }));

      const { error: frameworkError } = await supabase
        .from('control_frameworks')
        .insert(frameworkMappings);

      if (frameworkError) {
        console.error(`Error inserting frameworks for ${control.control_id}:`, frameworkError);
      } else {
        console.log(`  ✓ Added ${frameworks.length} framework mappings`);
      }

      const { error: attestationError } = await supabase
        .from('control_attestations')
        .insert({
          control_id: insertedControl.id,
          attested_by: 'System Administrator',
          status: control.status,
          notes: 'Initial attestation during system setup',
          attested_at: control.last_attested
        });

      if (attestationError) {
        console.error(`Error inserting attestation for ${control.control_id}:`, attestationError);
      } else {
        console.log(`  ✓ Added attestation record`);
      }
    }
  }

  console.log('\nControl library seed completed!');
  console.log(`Total controls seeded: ${controls.length}`);
}

seedControls().catch(console.error);
