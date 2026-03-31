import { useState } from 'react';

interface AISystem {
  id: string;
  name: string;
  department: string;
  type: string;
  securityScore: number;
  topThreat: string;
  topThreatLevel: string;
  redTeamStatus: string;
  overallRisk: string;
  deploymentEnv: string;
  publicApi: boolean;
  acceptsUserInput: boolean;
  inputTypes: string[];
  inputValidated: string;
  automatedOutputs: boolean;
  trainingPipelineExposed: boolean;
  userCount: string;
  attackSurfaceLevel: string;
  adversarialThreats: {
    name: string;
    reference: string;
    description: string;
    likelihood: number;
    impact: number;
    riskScore: number;
    notes: string;
  }[];
  trainingDataControls: { control: string; status: string; notes: string }[];
  trainingDataScore: number;
  modelSecurityControls: { control: string; status: string; notes: string }[];
  modelSecurityScore: number;
  supplyChain: {
    component: string;
    type: string;
    provider: string;
    securityAssessed: string;
    modelCard: string;
    licenceReview: string;
    sla24h: string;
    auditRight: string;
    vulnScan: string;
  }[];
  supplyChainScore: number;
  criticalFindings: {
    severity: string;
    title: string;
    description: string;
    reference: string;
    uclControl: string;
    action: string;
  }[];
  recommendations: {
    priority: string;
    action: string;
    description: string;
    effort: string;
    owner: string;
    uclControl: string;
  }[];
  lastAssessed: string;
}

const systems: AISystem[] = [
  {
    id: 'AI-SYS-001',
    name: 'Predictive Maintenance Model',
    department: 'Operations',
    type: 'Predictive AI',
    securityScore: 85,
    topThreat: 'Data Poisoning',
    topThreatLevel: 'Low',
    redTeamStatus: 'Not Required',
    overallRisk: 'LOW',
    deploymentEnv: 'On-premise',
    publicApi: false,
    acceptsUserInput: false,
    inputTypes: ['Structured data'],
    inputValidated: 'Yes',
    automatedOutputs: false,
    trainingPipelineExposed: false,
    userCount: '10 to 100',
    attackSurfaceLevel: 'LOW',
    adversarialThreats: [
      { name: 'Prompt Injection', reference: 'OWASP LLM01', description: 'Not applicable - system does not accept natural language inputs', likelihood: 1, impact: 1, riskScore: 1, notes: 'Not applicable for sensor data model' },
      { name: 'Model Inversion', reference: 'MITRE ATLAS AML.T0024', description: 'Reconstructing training data from model outputs', likelihood: 1, impact: 2, riskScore: 2, notes: 'Training data is sensor readings - no PII involved' },
      { name: 'Data Poisoning', reference: 'MITRE ATLAS AML.T0020', description: 'Corrupting sensor data inputs to degrade predictions', likelihood: 2, impact: 2, riskScore: 4, notes: 'Sensor data from internal IoT network - limited external exposure' },
      { name: 'Evasion Attacks', reference: 'MITRE ATLAS AML.T0015', description: 'Crafted sensor readings to evade anomaly detection', likelihood: 1, impact: 2, riskScore: 2, notes: 'Physical access required to manipulate sensors - low likelihood' },
      { name: 'Model Theft', reference: 'MITRE ATLAS AML.T0035', description: 'Extracting proprietary maintenance prediction logic', likelihood: 1, impact: 2, riskScore: 2, notes: 'Internal API only - no external access' },
      { name: 'Backdoor Attacks', reference: 'MITRE ATLAS AML.T0018', description: 'Hidden triggers in training data causing false predictions', likelihood: 1, impact: 3, riskScore: 3, notes: 'In-house developed - training data provenance well documented' },
    ],
    trainingDataControls: [
      { control: 'Training data provenance fully documented', status: 'Yes', notes: 'All sensor data sources documented with collection timestamps and device IDs' },
      { control: 'Data integrity verification controls in place', status: 'Yes', notes: 'SHA-256 checksums verified on all training datasets before pipeline execution' },
      { control: 'Access to training datasets restricted', status: 'Yes', notes: 'Training data access limited to 3 ML engineers via RBAC' },
      { control: 'Training pipeline protected from external access', status: 'Yes', notes: 'Pipeline runs on air-gapped on-premise infrastructure' },
      { control: 'Anomaly detection in training data', status: 'Yes', notes: 'Statistical outlier detection applied - flags readings beyond 3 standard deviations' },
      { control: 'Data sanitisation applied before training', status: 'Yes', notes: 'Null values, duplicate readings and out-of-range values removed in preprocessing' },
      { control: 'Third party data reviewed for poisoning risk', status: 'Yes', notes: 'No third party data used - all data from internal IoT sensors' },
      { control: 'Training data legal basis documented', status: 'Yes', notes: 'No personal data - sensor readings only' },
      { control: 'Retraining triggers and processes documented', status: 'Yes', notes: 'Retraining triggered when model accuracy drops below 92% or quarterly' },
      { control: 'Backdoor detection testing conducted', status: 'Partial', notes: 'Manual review conducted but no automated backdoor detection tool deployed' },
    ],
    trainingDataScore: 95,
    modelSecurityControls: [
      { control: 'Model files stored with access controls', status: 'Yes', notes: 'Model artefacts stored in restricted internal repository' },
      { control: 'Model serialisation security', status: 'Yes', notes: 'ONNX format used - no pickle files in production' },
      { control: 'Model signing and integrity verification', status: 'Yes', notes: 'Model hash verified at deployment' },
      { control: 'Inference API requires authentication', status: 'Yes', notes: 'Internal API - certificate-based authentication' },
      { control: 'Rate limiting on inference API', status: 'Yes', notes: '1000 requests per minute limit per service account' },
      { control: 'Input validation before reaching model', status: 'Yes', notes: 'Schema validation enforced - only structured sensor readings accepted' },
      { control: 'Output filtering on responses', status: 'Yes', notes: 'Outputs bounded to valid maintenance recommendation categories' },
      { control: 'Adversarial input detection', status: 'Partial', notes: 'Statistical range checks in place but no dedicated adversarial detection' },
      { control: 'Model versioning and rollback capability', status: 'Yes', notes: 'MLflow version control - rollback tested quarterly' },
      { control: 'Inference request logging', status: 'Yes', notes: 'All predictions logged with input hash and timestamp' },
      { control: 'Differential privacy applied', status: 'No', notes: 'Not applicable - no personal data in training set' },
      { control: 'Performance monitoring for manipulation signs', status: 'Yes', notes: 'Real-time accuracy monitoring with alerting below 90%' },
    ],
    modelSecurityScore: 92,
    supplyChain: [
      { component: 'scikit-learn 1.3.0', type: 'Library', provider: 'Open Source', securityAssessed: 'Yes', modelCard: 'N/A', licenceReview: 'Yes', sla24h: 'N/A', auditRight: 'N/A', vulnScan: 'Yes' },
      { component: 'ONNX Runtime', type: 'Library', provider: 'Microsoft', securityAssessed: 'Yes', modelCard: 'N/A', licenceReview: 'Yes', sla24h: 'N/A', auditRight: 'N/A', vulnScan: 'Yes' },
    ],
    supplyChainScore: 95,
    criticalFindings: [
      { severity: 'LOW', title: 'Partial Backdoor Detection', description: 'Automated backdoor detection tool not deployed. Manual review only. Consider deploying Neural Cleanse or similar tool for periodic automated scanning.', reference: 'MITRE ATLAS AML.T0018', uclControl: 'UCL-018', action: 'Deploy automated backdoor detection tool - Neural Cleanse or Activation Clustering. Schedule quarterly scan.' },
    ],
    recommendations: [
      { priority: 'LOW', action: 'Deploy Automated Backdoor Detection', description: 'Implement Neural Cleanse or Activation Clustering for periodic automated backdoor scanning of production model.', effort: 'Medium', owner: 'IT Security', uclControl: 'UCL-018' },
    ],
    lastAssessed: '01 Mar 2026',
  },
  {
    id: 'AI-SYS-002',
    name: 'HR Recruitment Screening AI',
    department: 'HR',
    type: 'Automated Decision Making',
    securityScore: 45,
    topThreat: 'Model Inversion',
    topThreatLevel: 'Critical',
    redTeamStatus: 'Planned',
    overallRisk: 'HIGH',
    deploymentEnv: 'Cloud-hosted SaaS',
    publicApi: true,
    acceptsUserInput: true,
    inputTypes: ['Free text', 'File uploads', 'Structured data'],
    inputValidated: 'Partial',
    automatedOutputs: true,
    trainingPipelineExposed: false,
    userCount: '10 to 100',
    attackSurfaceLevel: 'HIGH',
    adversarialThreats: [
      { name: 'Prompt Injection', reference: 'OWASP LLM01', description: 'Candidates craft CVs with hidden instructions to manipulate AI scoring - invisible white text telling model to score applicant highly', likelihood: 3, impact: 3, riskScore: 9, notes: 'CV text processed directly by NLP component - prompt injection via CV content is a realistic attack vector. No detection in place.' },
      { name: 'Model Inversion', reference: 'MITRE ATLAS AML.T0024', description: 'Systematic querying of scoring API to reconstruct what training data looks like - could reveal characteristics of historically successful candidates', likelihood: 3, impact: 4, riskScore: 12, notes: 'API accessible to all applicants. No rate limiting. 10,000+ candidate records in training. CRITICAL - personal data reconstruction possible.' },
      { name: 'Membership Inference', reference: 'MITRE ATLAS AML.T0024', description: 'Determine whether specific individuals were in training dataset - could confirm whether past employee data was used', likelihood: 3, impact: 3, riskScore: 9, notes: 'High likelihood given large personal data training set and no differential privacy.' },
      { name: 'Evasion Attacks', reference: 'MITRE ATLAS AML.T0015', description: 'Candidates craft CVs specifically designed to score highly regardless of actual qualifications', likelihood: 4, impact: 3, riskScore: 12, notes: 'Adversarial CV crafting services already exist commercially. High likelihood for senior roles.' },
      { name: 'Model Theft', reference: 'MITRE ATLAS AML.T0035', description: 'Reconstruct the scoring algorithm by systematic applications - steal TalentSift proprietary model', likelihood: 2, impact: 3, riskScore: 6, notes: 'No rate limiting makes systematic extraction feasible. Proprietary scoring algorithm at risk.' },
      { name: 'Data Poisoning', reference: 'MITRE ATLAS AML.T0020', description: 'Poisoning retraining data by submitting carefully crafted applications to shift model bias', likelihood: 2, impact: 4, riskScore: 8, notes: 'If model retrained on new applications, poisoning attack possible over time.' },
      { name: 'Backdoor Attacks', reference: 'MITRE ATLAS AML.T0018', description: 'TalentSift model may contain backdoors - specific CV keywords triggering high scores regardless of merit', likelihood: 2, impact: 4, riskScore: 8, notes: 'Third party black box model - no visibility into training process.' },
    ],
    trainingDataControls: [
      { control: 'Training data provenance fully documented', status: 'No', notes: 'TalentSift has not provided training data provenance documentation.' },
      { control: 'Data integrity verification controls in place', status: 'No', notes: 'No visibility into TalentSift training pipeline' },
      { control: 'Access to training datasets restricted', status: 'No', notes: 'Handled by TalentSift - no contractual controls on training data access' },
      { control: 'Training pipeline protected from external access', status: 'No', notes: 'Unknown - TalentSift has not provided infrastructure documentation' },
      { control: 'Anomaly detection in training data', status: 'No', notes: 'Not documented by vendor' },
      { control: 'Data sanitisation applied', status: 'Partial', notes: 'Meridian Group candidate data sanitised before sharing. TalentSift processing unknown.' },
      { control: 'Third party data reviewed for poisoning risk', status: 'No', notes: 'TalentSift uses additional proprietary training data - not reviewed' },
      { control: 'Training data legal basis documented', status: 'Partial', notes: 'Candidate consent obtained for recruitment but not specifically for AI model training.' },
      { control: 'Retraining triggers documented', status: 'No', notes: 'TalentSift retraining schedule not disclosed' },
      { control: 'Backdoor detection testing conducted', status: 'No', notes: 'No backdoor testing conducted on TalentSift model' },
    ],
    trainingDataScore: 15,
    modelSecurityControls: [
      { control: 'Model files stored with access controls', status: 'No', notes: 'Hosted by TalentSift - no visibility into model storage security' },
      { control: 'Model serialisation security', status: 'No', notes: 'Unknown - vendor has not disclosed' },
      { control: 'Model signing and integrity verification', status: 'No', notes: 'No model integrity verification in place' },
      { control: 'Inference API requires authentication', status: 'Yes', notes: 'API key authentication implemented' },
      { control: 'Rate limiting on inference API', status: 'No', notes: 'CRITICAL - no rate limiting. Unlimited queries possible. Model extraction and inversion attacks feasible.' },
      { control: 'Input validation before reaching model', status: 'Partial', notes: 'File type validation only - no content validation. Adversarial CV content not filtered.' },
      { control: 'Output filtering', status: 'No', notes: 'Raw scores returned without filtering or sanity checks' },
      { control: 'Adversarial input detection', status: 'No', notes: 'No adversarial CV detection in place' },
      { control: 'Model versioning and rollback', status: 'Partial', notes: 'TalentSift manages versioning - no contractual right to rollback on our request' },
      { control: 'Inference request logging', status: 'Partial', notes: 'Application logs requests but TalentSift does not provide inference-level logging' },
      { control: 'Differential privacy applied', status: 'No', notes: 'Not implemented. Personal data of 10,000+ candidates without differential privacy.' },
      { control: 'Performance monitoring for manipulation', status: 'No', notes: 'No anomaly detection on scoring outputs' },
    ],
    modelSecurityScore: 25,
    supplyChain: [
      { component: 'TalentSift AI Scoring API', type: 'API', provider: 'TalentSift Technologies', securityAssessed: 'No', modelCard: 'No', licenceReview: 'Yes', sla24h: 'No', auditRight: 'No', vulnScan: 'No' },
      { component: 'OpenAI GPT-4 (CV parsing)', type: 'Foundation Model', provider: 'OpenAI', securityAssessed: 'Partial', modelCard: 'Yes', licenceReview: 'Yes', sla24h: 'Yes', auditRight: 'No', vulnScan: 'No' },
      { component: 'Python scikit-learn', type: 'Library', provider: 'Open Source', securityAssessed: 'Yes', modelCard: 'N/A', licenceReview: 'Yes', sla24h: 'N/A', auditRight: 'N/A', vulnScan: 'Yes' },
    ],
    supplyChainScore: 28,
    criticalFindings: [
      { severity: 'CRITICAL', title: 'Model Inversion - Personal Data Reconstruction Risk', description: 'No rate limiting on TalentSift API. System trained on 10,000+ candidate personal records without differential privacy. Systematic querying can reconstruct training data exposing PII of past candidates. This is a personal data breach risk under GDPR Art.32 and UAE PDPL.', reference: 'MITRE ATLAS AML.T0024 · GDPR Art.32', uclControl: 'UCL-018 · UCL-024', action: 'Implement API rate limiting immediately - max 50 requests per hour per IP. Request differential privacy implementation from TalentSift. Conduct model inversion penetration test.' },
      { severity: 'CRITICAL', title: 'Adversarial CV Evasion - No Detection', description: 'Recruitment screener accepts free text CV content with no adversarial input detection. Commercial adversarial CV crafting services exist. Candidates can systematically game the scoring algorithm.', reference: 'MITRE ATLAS AML.T0015 · OWASP LLM01', uclControl: 'UCL-021 · UCL-016', action: 'Implement adversarial CV detection - flag submissions with unusual keyword density patterns. Add human review trigger for outlier scores.' },
      { severity: 'CRITICAL', title: 'Third Party Black Box - No Visibility or Audit Right', description: 'TalentSift model is a complete black box. No training data provenance, no model card, no right to audit, no backdoor testing. Non-compliant with EU AI Act Art.9 technical documentation requirements.', reference: 'EU AI Act Art.9 · Art.14 · MITRE ATLAS AML.T0018', uclControl: 'UCL-022 · UCL-017', action: 'Renegotiate TalentSift contract to include model card disclosure, right to audit, training data provenance, security assessment report and incident notification within 24 hours.' },
      { severity: 'HIGH', title: 'No Rate Limiting - Model Theft Risk', description: 'Unlimited API queries enables systematic model extraction - proprietary TalentSift scoring algorithm can be reconstructed by a determined attacker.', reference: 'MITRE ATLAS AML.T0035', uclControl: 'UCL-017', action: 'Implement rate limiting at application layer immediately.' },
      { severity: 'HIGH', title: 'Candidate Consent Gap - AI Training Legal Basis', description: 'Candidate consent obtained for recruitment but not specifically for use of data to train AI models. Legal basis gap under GDPR Art.5 and UAE PDPL.', reference: 'GDPR Art.5 · UAE PDPL Art.9', uclControl: 'UCL-024 · UCL-013', action: 'Update candidate privacy notice to explicitly disclose AI use in screening. Obtain refreshed consent or identify alternative legal basis.' },
    ],
    recommendations: [
      { priority: 'CRITICAL', action: 'Implement API Rate Limiting Immediately', description: 'Maximum 50 requests per hour per IP on TalentSift API. No further recruitment cycles until this is in place.', effort: 'Low', owner: 'IT Security', uclControl: 'UCL-017' },
      { priority: 'CRITICAL', action: 'Request Differential Privacy from TalentSift', description: 'Contractually require TalentSift to implement differential privacy for any model trained on Meridian Group candidate data.', effort: 'Low', owner: 'Legal', uclControl: 'UCL-024' },
      { priority: 'CRITICAL', action: 'Renegotiate Vendor Contract for Audit Rights', description: 'Contract amendment required: model card, right to audit, training data provenance, security assessment report, 24h incident notification.', effort: 'Medium', owner: 'Legal', uclControl: 'UCL-022' },
      { priority: 'HIGH', action: 'Implement Adversarial CV Detection', description: 'Deploy keyword density anomaly detection to flag potentially adversarial CV submissions.', effort: 'Medium', owner: 'IT Security', uclControl: 'UCL-021' },
      { priority: 'HIGH', action: 'Plan Red Team Exercise', description: 'Commission external red team to test model inversion, adversarial CV evasion and membership inference attacks.', effort: 'High', owner: 'Compliance', uclControl: 'UCL-026' },
    ],
    lastAssessed: '15 Mar 2026',
  },
  {
    id: 'AI-SYS-003',
    name: 'Customer Churn Predictor',
    department: 'Marketing',
    type: 'Predictive AI',
    securityScore: 72,
    topThreat: 'Evasion Attack',
    topThreatLevel: 'Medium',
    redTeamStatus: 'Not Started',
    overallRisk: 'MEDIUM',
    deploymentEnv: 'Cloud-hosted SaaS',
    publicApi: false,
    acceptsUserInput: false,
    inputTypes: ['Structured data'],
    inputValidated: 'Yes',
    automatedOutputs: false,
    trainingPipelineExposed: false,
    userCount: '10 to 100',
    attackSurfaceLevel: 'MEDIUM',
    adversarialThreats: [
      { name: 'Model Inversion', reference: 'MITRE ATLAS AML.T0024', description: 'Reconstructing customer behaviour patterns from churn predictions', likelihood: 2, impact: 3, riskScore: 6, notes: 'Internal API only - limited exposure. Customer data in training set creates moderate risk.' },
      { name: 'Membership Inference', reference: 'MITRE ATLAS AML.T0024', description: 'Confirming whether specific customers are in high-churn risk segment', likelihood: 2, impact: 2, riskScore: 4, notes: 'Internal access only - low likelihood of external attack' },
      { name: 'Evasion Attacks', reference: 'MITRE ATLAS AML.T0015', description: 'Customers manipulating their behaviour to avoid churn prediction flags', likelihood: 3, impact: 2, riskScore: 6, notes: 'Theoretically possible if churn criteria become known.' },
      { name: 'Data Poisoning', reference: 'MITRE ATLAS AML.T0020', description: 'Poisoning customer behaviour data to degrade churn predictions', likelihood: 1, impact: 2, riskScore: 2, notes: 'Internal data pipeline - low external exposure' },
      { name: 'Model Theft', reference: 'MITRE ATLAS AML.T0035', description: 'Stealing proprietary customer churn prediction methodology', likelihood: 1, impact: 2, riskScore: 2, notes: 'Internal API only - low risk' },
    ],
    trainingDataControls: [
      { control: 'Training data provenance documented', status: 'Yes', notes: 'Customer transaction data sourced from Salesforce CRM - provenance documented' },
      { control: 'Data integrity verification', status: 'Yes', notes: 'Data quality checks run before each training cycle' },
      { control: 'Access restricted', status: 'Yes', notes: 'Training data access limited to data science team of 4' },
      { control: 'Pipeline protected from external access', status: 'Yes', notes: 'Azure ML pipeline with network isolation' },
      { control: 'Anomaly detection', status: 'Partial', notes: 'Basic statistical checks - no advanced anomaly detection' },
      { control: 'Data sanitisation', status: 'Yes', notes: 'PII minimised - customer IDs used instead of names' },
      { control: 'Third party data reviewed', status: 'Yes', notes: 'No third party data used' },
      { control: 'Legal basis documented', status: 'Yes', notes: 'Legitimate interest - customer retention. DPIA-2026-002 completed.' },
      { control: 'Retraining triggers documented', status: 'Yes', notes: 'Quarterly retraining on latest 18 months of transaction data' },
      { control: 'Backdoor detection', status: 'Partial', notes: 'In-house model - manual code review conducted but no automated backdoor detection' },
    ],
    trainingDataScore: 85,
    modelSecurityControls: [
      { control: 'Model files stored with access controls', status: 'Yes', notes: 'Azure Blob Storage with private endpoint' },
      { control: 'Model serialisation security', status: 'Yes', notes: 'joblib with signature verification' },
      { control: 'Model signing', status: 'Partial', notes: 'Hash verification but not cryptographic signing' },
      { control: 'API authentication', status: 'Yes', notes: 'Azure AD authentication required' },
      { control: 'Rate limiting', status: 'Yes', notes: '500 requests per minute - adequate for internal use' },
      { control: 'Input validation', status: 'Yes', notes: 'Schema validation on all inputs' },
      { control: 'Output filtering', status: 'Yes', notes: 'Scores bounded 0-1, invalid outputs rejected' },
      { control: 'Adversarial input detection', status: 'Partial', notes: 'Range checks only - no dedicated adversarial detection' },
      { control: 'Model versioning and rollback', status: 'Yes', notes: 'MLflow - 6 versions retained, rollback tested' },
      { control: 'Inference logging', status: 'Yes', notes: 'All predictions logged to Azure Log Analytics' },
      { control: 'Differential privacy', status: 'Partial', notes: 'Pseudonymisation applied but not full differential privacy' },
      { control: 'Performance monitoring', status: 'Yes', notes: 'Monthly performance review with accuracy tracking' },
    ],
    modelSecurityScore: 78,
    supplyChain: [
      { component: 'Azure Machine Learning', type: 'MLOps Tool', provider: 'Microsoft', securityAssessed: 'Yes', modelCard: 'N/A', licenceReview: 'Yes', sla24h: 'Yes', auditRight: 'Yes', vulnScan: 'Yes' },
      { component: 'scikit-learn 1.3.0', type: 'Library', provider: 'Open Source', securityAssessed: 'Yes', modelCard: 'N/A', licenceReview: 'Yes', sla24h: 'N/A', auditRight: 'N/A', vulnScan: 'Yes' },
    ],
    supplyChainScore: 88,
    criticalFindings: [
      { severity: 'MEDIUM', title: 'Partial Adversarial Input Detection', description: 'Range checks in place but no dedicated adversarial perturbation detection. Customers could craft transaction patterns to avoid churn flag.', reference: 'MITRE ATLAS AML.T0015', uclControl: 'UCL-021', action: 'Implement anomaly detection on input feature distributions. Flag inputs deviating significantly from training distribution.' },
      { severity: 'MEDIUM', title: 'Differential Privacy Not Fully Implemented', description: 'Pseudonymisation applied but full differential privacy not implemented. Model inversion attacks could still reconstruct customer behavioural patterns.', reference: 'MITRE ATLAS AML.T0024 · GDPR Art.32', uclControl: 'UCL-024', action: 'Evaluate implementation of differential privacy using TensorFlow Privacy or PyTorch Opacus. Target epsilon below 10.' },
    ],
    recommendations: [
      { priority: 'MEDIUM', action: 'Implement Full Differential Privacy', description: 'Deploy TensorFlow Privacy or PyTorch Opacus for next model retraining cycle. Target epsilon below 10.', effort: 'Medium', owner: 'IT Security', uclControl: 'UCL-024' },
      { priority: 'MEDIUM', action: 'Adversarial Input Distribution Monitoring', description: 'Monitor input feature distributions at inference time - flag inputs deviating significantly from training distribution.', effort: 'Low', owner: 'IT Security', uclControl: 'UCL-021' },
    ],
    lastAssessed: '20 Mar 2026',
  },
  {
    id: 'AI-SYS-004',
    name: 'Fraud Detection Engine',
    department: 'Finance',
    type: 'Automated Decision Making',
    securityScore: 38,
    topThreat: 'Adversarial Examples',
    topThreatLevel: 'Critical',
    redTeamStatus: 'In Progress',
    overallRisk: 'HIGH',
    deploymentEnv: 'Cloud-hosted SaaS',
    publicApi: true,
    acceptsUserInput: true,
    inputTypes: ['Structured data'],
    inputValidated: 'Partial',
    automatedOutputs: true,
    trainingPipelineExposed: true,
    userCount: 'Over 1000',
    attackSurfaceLevel: 'CRITICAL',
    adversarialThreats: [
      { name: 'Evasion Attacks - Adversarial Examples', reference: 'MITRE ATLAS AML.T0015', description: 'Carefully crafted transaction patterns mimicking legitimate behaviour to evade fraud detection. Organised fraud groups systematically probe detection boundaries.', likelihood: 4, impact: 4, riskScore: 16, notes: 'CRITICAL - organised fraud groups actively probe financial ML systems. No adversarial robustness testing conducted.' },
      { name: 'Model Inversion', reference: 'MITRE ATLAS AML.T0024', description: 'Reconstructing fraud detection rules by observing which transactions are flagged or blocked.', likelihood: 4, impact: 4, riskScore: 16, notes: 'CRITICAL - every blocked transaction reveals model decision boundary information.' },
      { name: 'Data Poisoning', reference: 'MITRE ATLAS AML.T0020', description: 'Poisoning fraud labelling data by processing fraudulent transactions appearing legitimate.', likelihood: 3, impact: 4, riskScore: 12, notes: 'FraudShield training pipeline accessible from internet - significant data poisoning risk.' },
      { name: 'Model Theft', reference: 'MITRE ATLAS AML.T0035', description: 'Systematic querying to reconstruct FraudShield detection algorithm.', likelihood: 3, impact: 4, riskScore: 12, notes: 'No rate limiting on fraud check API - systematic extraction feasible at scale.' },
      { name: 'Backdoor Attacks', reference: 'MITRE ATLAS AML.T0018', description: 'Hidden triggers in FraudShield model allowing specific transaction patterns to bypass fraud detection.', likelihood: 2, impact: 4, riskScore: 8, notes: 'Third party black box model - cannot verify absence of backdoors.' },
      { name: 'Membership Inference', reference: 'MITRE ATLAS AML.T0024', description: 'Confirming whether specific customer transactions were used in fraud model training.', likelihood: 2, impact: 3, riskScore: 6, notes: 'Training data includes historical fraud cases' },
    ],
    trainingDataControls: [
      { control: 'Training data provenance documented', status: 'No', notes: 'FraudShield has not provided training data provenance. Training data includes data from multiple financial institutions.' },
      { control: 'Data integrity verification', status: 'No', notes: 'Not disclosed by FraudShield' },
      { control: 'Access restricted', status: 'No', notes: 'FraudShield training pipeline accessible from internet - critical finding' },
      { control: 'Pipeline protected from external access', status: 'No', notes: 'CRITICAL - FraudShield cloud training environment has known internet exposure' },
      { control: 'Anomaly detection', status: 'No', notes: 'Not documented' },
      { control: 'Data sanitisation', status: 'No', notes: 'Unknown - vendor has not disclosed' },
      { control: 'Third party data reviewed', status: 'No', notes: 'FraudShield uses data from multiple financial institutions - not reviewed for poisoning' },
      { control: 'Legal basis documented', status: 'Partial', notes: 'Customer consent for fraud prevention documented but not for cross-institution model training' },
      { control: 'Retraining triggers documented', status: 'No', notes: 'FraudShield retraining schedule not disclosed' },
      { control: 'Backdoor detection', status: 'No', notes: 'No backdoor testing on FraudShield model' },
    ],
    trainingDataScore: 10,
    modelSecurityControls: [
      { control: 'Model files stored with access controls', status: 'No', notes: 'FraudShield managed - no visibility' },
      { control: 'Model serialisation security', status: 'No', notes: 'Unknown' },
      { control: 'Model signing', status: 'No', notes: 'Not implemented' },
      { control: 'API authentication', status: 'Yes', notes: 'API key authentication in place' },
      { control: 'Rate limiting', status: 'No', notes: 'CRITICAL - no rate limiting on fraud check API. Systematic probing and model extraction possible.' },
      { control: 'Input validation', status: 'Partial', notes: 'Transaction schema validation only - no adversarial transaction pattern detection' },
      { control: 'Output filtering', status: 'Partial', notes: 'Block/allow decision filtered but confidence scores exposed - reveals model decision boundary' },
      { control: 'Adversarial input detection', status: 'No', notes: 'No adversarial transaction detection in place' },
      { control: 'Model versioning and rollback', status: 'Partial', notes: 'FraudShield manages versioning - no contractual right to rollback on request' },
      { control: 'Inference logging', status: 'Yes', notes: 'All fraud checks logged for audit trail' },
      { control: 'Differential privacy', status: 'No', notes: 'Not implemented by FraudShield' },
      { control: 'Performance monitoring', status: 'Partial', notes: 'False positive rate not monitored - only overall accuracy tracked' },
    ],
    modelSecurityScore: 22,
    supplyChain: [
      { component: 'FraudShield Detection API', type: 'API', provider: 'FraudShield Technologies', securityAssessed: 'No', modelCard: 'No', licenceReview: 'Yes', sla24h: 'No', auditRight: 'No', vulnScan: 'No' },
      { component: 'AWS SageMaker', type: 'MLOps Tool', provider: 'Amazon', securityAssessed: 'Yes', modelCard: 'N/A', licenceReview: 'Yes', sla24h: 'Yes', auditRight: 'Yes', vulnScan: 'Yes' },
      { component: 'XGBoost 1.7.0', type: 'Library', provider: 'Open Source', securityAssessed: 'Yes', modelCard: 'N/A', licenceReview: 'Yes', sla24h: 'N/A', auditRight: 'N/A', vulnScan: 'Yes' },
    ],
    supplyChainScore: 35,
    criticalFindings: [
      { severity: 'CRITICAL', title: 'Adversarial Evasion - Active Fraud Risk', description: 'Fraud detection model shows no adversarial robustness testing. FraudShield has been compromised by adversarial transaction patterns at peer institutions. Organised fraud groups actively probe financial ML systems. Every declined transaction reveals model boundary information.', reference: 'MITRE ATLAS AML.T0015', uclControl: 'UCL-021', action: 'Emergency: Commission adversarial robustness red team exercise within 30 days. Implement transaction pattern anomaly detection. Stop exposing confidence scores in API response.' },
      { severity: 'CRITICAL', title: 'Training Pipeline Internet Accessible - Data Poisoning Risk', description: 'FraudShield cloud training environment has documented internet exposure. This creates a data poisoning attack surface - adversaries could potentially influence fraud labelling in future training runs.', reference: 'MITRE ATLAS AML.T0020', uclControl: 'UCL-018', action: 'Require FraudShield to provide evidence of network isolation for training environment within 30 days. Escalate to CSO if not resolved.' },
      { severity: 'CRITICAL', title: 'No Rate Limiting - Model Extraction at Scale', description: 'Unlimited fraud check API queries enable systematic model extraction. Fraud networks can reconstruct detection rules at industrial scale and sell evasion playbooks.', reference: 'MITRE ATLAS AML.T0035', uclControl: 'UCL-017', action: 'Implement rate limiting immediately at application layer - max 100 fraud checks per second per merchant.' },
      { severity: 'HIGH', title: 'Confidence Scores Exposed - Decision Boundary Leakage', description: 'API response includes fraud confidence scores. Each response reveals exactly how close a transaction was to the detection threshold - providing a roadmap for crafting evasion attacks.', reference: 'MITRE ATLAS AML.T0015 · AML.T0024', uclControl: 'UCL-020', action: 'Remove confidence scores from API response immediately. Return block/allow decision only.' },
      { severity: 'HIGH', title: 'False Positive Rate Not Monitored - Customer Impact', description: 'Performance monitoring tracks overall accuracy only. False positive rate not tracked. Customer harm from incorrect blocking cannot be quantified.', reference: 'UCL-025 · UAE Ethics', uclControl: 'UCL-025', action: 'Implement false positive rate monitoring dashboard. Set maximum acceptable threshold of 2%.' },
    ],
    recommendations: [
      { priority: 'CRITICAL', action: 'Emergency Red Team Exercise', description: 'Commission external red team to test adversarial evasion against fraud detection within 30 days.', effort: 'High', owner: 'Compliance', uclControl: 'UCL-026' },
      { priority: 'CRITICAL', action: 'Implement Rate Limiting Immediately', description: 'Maximum 100 fraud checks per second per merchant at application layer.', effort: 'Low', owner: 'IT Security', uclControl: 'UCL-017' },
      { priority: 'CRITICAL', action: 'Remove Confidence Scores from API Response', description: 'Return block/allow decision only - no confidence scores. This alone significantly reduces decision boundary leakage.', effort: 'Low', owner: 'IT Security', uclControl: 'UCL-020' },
      { priority: 'CRITICAL', action: 'Require Training Pipeline Network Isolation Evidence', description: 'FraudShield must provide evidence of network isolation for training environment within 30 days.', effort: 'Low', owner: 'Legal', uclControl: 'UCL-018' },
      { priority: 'HIGH', action: 'Implement False Positive Monitoring', description: 'Track false positive rate daily. Set threshold at 2%. Implement customer redress process with 4-hour SLA.', effort: 'Medium', owner: 'IT Security', uclControl: 'UCL-025' },
    ],
    lastAssessed: '22 Mar 2026',
  },
  {
    id: 'AI-SYS-005',
    name: 'Legal Document Classifier',
    department: 'Legal',
    type: 'NLP',
    securityScore: 88,
    topThreat: 'Prompt Injection',
    topThreatLevel: 'Low',
    redTeamStatus: 'Completed',
    overallRisk: 'LOW',
    deploymentEnv: 'On-premise',
    publicApi: false,
    acceptsUserInput: true,
    inputTypes: ['Free text', 'File uploads'],
    inputValidated: 'Yes',
    automatedOutputs: false,
    trainingPipelineExposed: false,
    userCount: 'Under 10',
    attackSurfaceLevel: 'LOW',
    adversarialThreats: [
      { name: 'Prompt Injection', reference: 'OWASP LLM01', description: 'Injecting malicious instructions into document content to manipulate classification', likelihood: 2, impact: 2, riskScore: 4, notes: 'Input validation in place. Access limited to 6 legal team members. Low likelihood.' },
      { name: 'Model Inversion', reference: 'MITRE ATLAS AML.T0024', description: 'Reconstructing training documents from model outputs', likelihood: 1, impact: 2, riskScore: 2, notes: 'Internal only access. Training data is internal legal documents.' },
      { name: 'Evasion Attacks', reference: 'MITRE ATLAS AML.T0015', description: 'Documents crafted to be misclassified and routed to wrong team', likelihood: 1, impact: 2, riskScore: 2, notes: 'Low impact - misclassification causes routing delay, not security breach.' },
      { name: 'Data Poisoning', reference: 'MITRE ATLAS AML.T0020', description: 'Poisoning training corpus to degrade classification accuracy', likelihood: 1, impact: 2, riskScore: 2, notes: 'Air-gapped training pipeline. Very low risk.' },
    ],
    trainingDataControls: [
      { control: 'Training data provenance documented', status: 'Yes', notes: 'All training documents catalogued with source, date and classification label' },
      { control: 'Data integrity verification', status: 'Yes', notes: 'Document hashes verified before training' },
      { control: 'Access restricted', status: 'Yes', notes: 'Training corpus access: General Counsel + 1 ML engineer only' },
      { control: 'Pipeline protected from external access', status: 'Yes', notes: 'On-premise air-gapped pipeline' },
      { control: 'Anomaly detection', status: 'Yes', notes: 'Unexpected document types flagged before training inclusion' },
      { control: 'Data sanitisation', status: 'Yes', notes: 'Client PII redacted from training corpus before model training' },
      { control: 'Third party data reviewed', status: 'Yes', notes: 'Hugging Face BERT base model - model card reviewed, no PII in pre-training corpus' },
      { control: 'Legal basis documented', status: 'Yes', notes: 'Internal legal documents - no personal data of clients in training set' },
      { control: 'Retraining triggers documented', status: 'Yes', notes: 'Retraining when accuracy drops below 95% or semi-annually' },
      { control: 'Backdoor detection', status: 'Yes', notes: 'Red team exercise completed March 2026 - no backdoors identified' },
    ],
    trainingDataScore: 98,
    modelSecurityControls: [
      { control: 'Model files stored with access controls', status: 'Yes', notes: 'On-premise secure file server - 2 authorised users' },
      { control: 'Model serialisation security', status: 'Yes', notes: 'SafeTensors format - no pickle vulnerabilities' },
      { control: 'Model signing', status: 'Yes', notes: 'Cryptographic signing implemented at deployment' },
      { control: 'API authentication', status: 'Yes', notes: 'Certificate-based authentication - internal network only' },
      { control: 'Rate limiting', status: 'Yes', notes: '50 classifications per minute per user - adequate for internal workflow' },
      { control: 'Input validation', status: 'Yes', notes: 'File type whitelist, size limits, content scanning' },
      { control: 'Output filtering', status: 'Yes', notes: 'Classification outputs validated against known category list' },
      { control: 'Adversarial input detection', status: 'Yes', notes: 'Confidence threshold - low confidence classifications flagged for human review' },
      { control: 'Model versioning and rollback', status: 'Yes', notes: '5 versions retained - rollback tested and documented' },
      { control: 'Inference logging', status: 'Yes', notes: 'All classifications logged with document hash' },
      { control: 'Differential privacy', status: 'Yes', notes: 'Not required - no personal data in training set' },
      { control: 'Performance monitoring', status: 'Yes', notes: 'Weekly accuracy report - alert if below 95%' },
    ],
    modelSecurityScore: 96,
    supplyChain: [
      { component: 'Hugging Face BERT Base', type: 'Foundation Model', provider: 'Hugging Face', securityAssessed: 'Yes', modelCard: 'Yes', licenceReview: 'Yes', sla24h: 'No', auditRight: 'No', vulnScan: 'Yes' },
      { component: 'spaCy 3.6.0', type: 'Library', provider: 'Open Source', securityAssessed: 'Yes', modelCard: 'N/A', licenceReview: 'Yes', sla24h: 'N/A', auditRight: 'N/A', vulnScan: 'Yes' },
    ],
    supplyChainScore: 92,
    criticalFindings: [
      { severity: 'LOW', title: 'Hugging Face No SLA for Security Incidents', description: 'BERT base model sourced from Hugging Face. No SLA for security incident notification. If a vulnerability is found in the base model, notification timeline is unclear.', reference: 'UCL-022', uclControl: 'UCL-022', action: 'Subscribe to Hugging Face security advisories. Implement model version pinning and vulnerability monitoring.' },
    ],
    recommendations: [
      { priority: 'LOW', action: 'Subscribe to Hugging Face Security Advisories', description: 'Monitor for vulnerabilities in BERT base model. Pin model version and test updates in staging before production deployment.', effort: 'Low', owner: 'IT Security', uclControl: 'UCL-022' },
    ],
    lastAssessed: '10 Mar 2026',
  },
  {
    id: 'AI-SYS-006',
    name: 'Biometric Access Vision System',
    department: 'Facilities',
    type: 'Computer Vision',
    securityScore: 31,
    topThreat: 'Model Inversion',
    topThreatLevel: 'High',
    redTeamStatus: 'Not Started',
    overallRisk: 'CRITICAL',
    deploymentEnv: 'On-premise',
    publicApi: false,
    acceptsUserInput: true,
    inputTypes: ['Images'],
    inputValidated: 'No',
    automatedOutputs: true,
    trainingPipelineExposed: false,
    userCount: 'Over 1000',
    attackSurfaceLevel: 'HIGH',
    adversarialThreats: [
      { name: 'Evasion Attacks - Physical Adversarial', reference: 'MITRE ATLAS AML.T0015', description: 'Physical adversarial attacks against facial recognition - printed photographs, 3D printed masks, infrared bypass, deepfake video injection. Well-documented attack class with commercially available tools.', likelihood: 3, impact: 4, riskScore: 12, notes: 'CRITICAL - physical adversarial bypass of facial recognition is well-documented and commercially accessible. No liveness detection confirmed.' },
      { name: 'Model Inversion - Biometric Reconstruction', reference: 'MITRE ATLAS AML.T0024', description: 'Reconstructing facial templates from model outputs - could enable creation of synthetic faces that bypass authentication', likelihood: 2, impact: 4, riskScore: 8, notes: 'Biometric data is special category under GDPR Art.9 and UAE PDPL. Model inversion would constitute a catastrophic personal data breach.' },
      { name: 'Data Poisoning - Enrolment Attack', reference: 'MITRE ATLAS AML.T0020', description: 'Enrolling a fraudulent facial template to gain access - particularly relevant if enrolment process has weak identity verification', likelihood: 2, impact: 4, riskScore: 8, notes: 'Enrolment process relies on HR onboarding - identity verification strength not documented.' },
      { name: 'Backdoor Attacks', reference: 'MITRE ATLAS AML.T0018', description: 'VisionAccess model may contain backdoors - specific visual patterns triggering access grant regardless of identity', likelihood: 2, impact: 4, riskScore: 8, notes: 'Third party model - no visibility into training. VisionAccess has not provided model card or security documentation.' },
      { name: 'Membership Inference', reference: 'MITRE ATLAS AML.T0024', description: 'Determining whether a specific person is enrolled in the access control system', likelihood: 2, impact: 3, riskScore: 6, notes: 'Could reveal employee presence or absence information to adversaries' },
    ],
    trainingDataControls: [
      { control: 'Training data provenance documented', status: 'No', notes: 'VisionAccess has not disclosed training data sources for facial recognition model' },
      { control: 'Data integrity verification', status: 'No', notes: 'Not disclosed' },
      { control: 'Access restricted', status: 'No', notes: 'Unknown - VisionAccess has not provided documentation' },
      { control: 'Pipeline protected from external access', status: 'No', notes: 'Unknown' },
      { control: 'Anomaly detection', status: 'No', notes: 'Not documented' },
      { control: 'Data sanitisation', status: 'No', notes: 'Unknown whether consent was obtained for all faces in training corpus' },
      { control: 'Third party data reviewed', status: 'No', notes: 'VisionAccess training data not reviewed - potential use of scraped facial images without consent' },
      { control: 'Legal basis documented', status: 'No', notes: 'CRITICAL - specific informed consent for facial recognition not obtained. General employment consent insufficient under UAE PDPL and GDPR Art.9' },
      { control: 'Retraining triggers documented', status: 'No', notes: 'Not disclosed by VisionAccess' },
      { control: 'Backdoor detection', status: 'No', notes: 'No backdoor testing on VisionAccess model. No red team exercise conducted.' },
    ],
    trainingDataScore: 5,
    modelSecurityControls: [
      { control: 'Model files stored with access controls', status: 'Partial', notes: 'On-premise hardware - physical access controls in place but model file permissions not documented' },
      { control: 'Model serialisation security', status: 'No', notes: 'Unknown - VisionAccess proprietary format' },
      { control: 'Model signing', status: 'No', notes: 'Not implemented' },
      { control: 'API authentication', status: 'Yes', notes: 'Local network authentication - not internet exposed' },
      { control: 'Rate limiting', status: 'Yes', notes: 'Hardware-limited - physical camera capture rate is the natural limit' },
      { control: 'Input validation', status: 'No', notes: 'CRITICAL - no liveness detection confirmed. Photo attacks not mitigated.' },
      { control: 'Output filtering', status: 'Yes', notes: 'Access grant/deny only - no confidence scores exposed' },
      { control: 'Adversarial input detection', status: 'No', notes: 'No liveness detection or adversarial image detection in place' },
      { control: 'Model versioning and rollback', status: 'Partial', notes: 'VisionAccess manages updates - limited rollback capability' },
      { control: 'Inference logging', status: 'Yes', notes: 'All access attempts logged with timestamp and match confidence' },
      { control: 'Differential privacy', status: 'No', notes: 'Not applicable to inference - relevant to enrolment data storage' },
      { control: 'Performance monitoring', status: 'Partial', notes: 'False rejection rate monitored - false acceptance rate not separately tracked' },
    ],
    modelSecurityScore: 32,
    supplyChain: [
      { component: 'VisionAccess Facial Recognition Engine', type: 'API', provider: 'VisionAccess Gulf LLC', securityAssessed: 'No', modelCard: 'No', licenceReview: 'Yes', sla24h: 'No', auditRight: 'No', vulnScan: 'No' },
    ],
    supplyChainScore: 15,
    criticalFindings: [
      { severity: 'CRITICAL', title: 'No Liveness Detection - Physical Adversarial Attack Unmitigated', description: 'Facial recognition system has no confirmed liveness detection. Physical adversarial attacks using printed photographs, 3D masks or video replay are well-documented and use commercially available tools costing under $50. An attacker could gain physical access to any Meridian Group office using a photograph of any enrolled employee.', reference: 'MITRE ATLAS AML.T0015', uclControl: 'UCL-021', action: 'IMMEDIATE: Confirm whether VisionAccess has liveness detection enabled. If not, suspend facial recognition and revert to badge access until liveness detection is active.' },
      { severity: 'CRITICAL', title: 'EU AI Act - Possible Prohibited Use in Common Areas', description: 'Real-time facial recognition in publicly accessible common areas may be prohibited under EU AI Act Art.5(1)(h). The workplace exemption is narrow and conditions are strict. System currently operating without legal review confirming exemption applies.', reference: 'EU AI Act Art.5(1)(h)', uclControl: 'UCL-016', action: 'IMMEDIATE: Engage legal counsel to assess Art.5(1)(h) workplace exemption applicability. Consider restricting facial recognition to secure areas only.' },
      { severity: 'CRITICAL', title: 'Biometric Consent Deficiency - UAE PDPL and GDPR Art.9', description: 'Specific, informed consent for facial recognition biometric processing has not been obtained. General employment onboarding consent is insufficient for special category biometric data under GDPR Art.9 and UAE PDPL.', reference: 'GDPR Art.9 · UAE PDPL', uclControl: 'UCL-013 · UCL-024', action: 'IMMEDIATE: Obtain specific, freely given, informed consent from all enrolled employees for facial recognition processing. Provide clear opt-out alternative (badge access).' },
      { severity: 'CRITICAL', title: 'Third Party Model - No Visibility, No Audit Right, No Model Card', description: 'VisionAccess has provided no model card, no training data provenance, no security assessment and no right to audit. Non-compliant with EU AI Act Art.9 technical documentation requirements.', reference: 'EU AI Act Art.9 · MITRE ATLAS AML.T0018', uclControl: 'UCL-022', action: 'Renegotiate VisionAccess contract or terminate and replace. Minimum requirements: model card, right to audit, training data provenance, penetration test report, 24h security incident notification.' },
      { severity: 'HIGH', title: 'False Acceptance Rate Not Tracked', description: 'False rejection rate monitored but false acceptance rate is not separately tracked. This is the most security-critical metric for an access control system.', reference: 'UCL-025', uclControl: 'UCL-025', action: 'Immediately begin tracking false acceptance rate. Set maximum acceptable threshold of 0.01%.' },
    ],
    recommendations: [
      { priority: 'CRITICAL', action: 'Confirm Liveness Detection Status Immediately', description: 'Contact VisionAccess today to confirm liveness detection status. If not active, suspend facial recognition and revert to badge access.', effort: 'Low', owner: 'IT Security', uclControl: 'UCL-021' },
      { priority: 'CRITICAL', action: 'Legal Review of EU AI Act Art.5 Compliance', description: 'Engage legal counsel within 5 days to assess prohibited use risk. System may need to be partially suspended pending review.', effort: 'Low', owner: 'Legal', uclControl: 'UCL-016' },
      { priority: 'CRITICAL', action: 'Obtain Specific Biometric Consent', description: 'Issue biometric consent forms to all enrolled employees. Provide badge access as alternative. Update privacy notice and employment contracts.', effort: 'Medium', owner: 'Legal', uclControl: 'UCL-013' },
      { priority: 'CRITICAL', action: 'Renegotiate or Terminate VisionAccess Contract', description: 'Contract must include: model card, right to audit, training data provenance, security assessment, 24h incident notification. Set 30-day deadline.', effort: 'Medium', owner: 'Legal', uclControl: 'UCL-022' },
      { priority: 'HIGH', action: 'Commission Red Team Exercise', description: 'Test physical adversarial attacks, liveness bypass and enrolment attack scenarios using external specialist in computer vision security.', effort: 'High', owner: 'Compliance', uclControl: 'UCL-026' },
    ],
    lastAssessed: '25 Mar 2026',
  },
];

const riskColor = (r: string) => r === 'LOW' ? '#059669' : r === 'MEDIUM' ? '#D97706' : r === 'HIGH' ? '#DC2626' : '#7C0000';
const threatColor = (t: string) => t === 'Low' ? '#059669' : t === 'Medium' ? '#D97706' : t === 'High' ? '#DC2626' : '#7C0000';
const scoreColor = (s: number) => s >= 75 ? '#059669' : s >= 50 ? '#D97706' : '#DC2626';
const severityColor = (s: string) => s === 'CRITICAL' ? '#7C0000' : s === 'HIGH' ? '#DC2626' : s === 'MEDIUM' ? '#D97706' : '#059669';
const priorityColor = (p: string) => p === 'CRITICAL' ? '#7C0000' : p === 'HIGH' ? '#DC2626' : p === 'MEDIUM' ? '#D97706' : '#059669';

interface FormData {
  systemName: string;
  department: string;
  systemType: string;
  purpose: string;
  systemOwner: string;
  vendor: string;
  vendorName: string;
  deployedDate: string;
  affectsIndividuals: string;
  customerFacing: string;
  usesPersonalData: string;
  deploymentEnv: string;
  publicApi: string;
  acceptsUserInput: string;
  inputTypes: string[];
  inputValidated: string;
  automatedOutputs: string;
  trainingPipelineExposed: string;
  userCount: string;
  threats: Record<string, { likelihood: number; impact: number; notes: string }>;
  trainingControls: Record<string, string>;
  trainingNotes: Record<string, string>;
  modelControls: Record<string, string>;
  modelNotes: Record<string, string>;
  supplyChainComponents: {
    name: string;
    type: string;
    provider: string;
    securityAssessed: string;
    modelCard: string;
    licenceReview: string;
    sla24h: string;
    auditRight: string;
    vulnScan: string;
  }[];
}

export default function AISecurity() {
  const [showWizard, setShowWizard] = useState(false);
  const [selected, setSelected] = useState<AISystem | null>(null);
  const [viewSystem, setViewSystem] = useState<AISystem | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    systemName: '', department: '', systemType: '', purpose: '', systemOwner: '',
    vendor: '', vendorName: '', deployedDate: '', affectsIndividuals: '',
    customerFacing: '', usesPersonalData: '', deploymentEnv: '', publicApi: '',
    acceptsUserInput: '', inputTypes: [], inputValidated: '', automatedOutputs: '',
    trainingPipelineExposed: '', userCount: '',
    threats: {}, trainingControls: {}, trainingNotes: {}, modelControls: {}, modelNotes: {},
    supplyChainComponents: [],
  });

  const avg = Math.round(systems.reduce((a, s) => a + s.securityScore, 0) / systems.length);
  const critical = systems.filter(s => s.topThreatLevel === 'Critical').length;
  const high = systems.filter(s => s.overallRisk === 'HIGH' || s.overallRisk === 'CRITICAL').length;

  const openWizard = (sys: AISystem | null) => {
    setSelected(sys);
    setStep(1);
    setFormData({
      systemName: sys?.name || '', department: sys?.department || '',
      systemType: sys?.type || '', purpose: '', systemOwner: '',
      vendor: '', vendorName: '', deployedDate: '', affectsIndividuals: '',
      customerFacing: '', usesPersonalData: '', deploymentEnv: sys?.deploymentEnv || '',
      publicApi: '', acceptsUserInput: '', inputTypes: [], inputValidated: '',
      automatedOutputs: '', trainingPipelineExposed: '', userCount: sys?.userCount || '',
      threats: {}, trainingControls: {}, trainingNotes: {}, modelControls: {}, modelNotes: {},
      supplyChainComponents: [],
    });
    setShowWizard(true);
  };

  const cardStyle = (bg: string): React.CSSProperties => ({
    background: bg, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px'
  });

  const inputStyle: React.CSSProperties = {
    width: '100%', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px',
    padding: '0 12px', fontSize: '13px', color: '#0F172A', background: 'var(--bg-primary, #fff)',
    boxSizing: 'border-box'
  };

  const selectStyle: React.CSSProperties = {
    width: '100%', height: '40px', border: '1px solid #E5E7EB', borderRadius: '8px',
    padding: '0 12px', fontSize: '13px', color: '#0F172A', background: 'var(--bg-primary, #fff)'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px'
  };

  const radioGroupStyle: React.CSSProperties = { display: 'flex', gap: '16px', marginTop: '4px' };

  const radioLabel = (active: boolean, color: string): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer',
    padding: '4px 10px', borderRadius: '6px',
    background: active ? color + '15' : 'transparent',
    border: `1px solid ${active ? color : '#E5E7EB'}`,
    color: active ? color : '#6B7280'
  });

  const stepLabels = ['System Profile', 'Attack Surface', 'Adversarial Threats', 'Training Data', 'Model Security', 'GenAI Controls', 'Supply Chain'];

  const attackSurfaceScore = () => {
    let score = 0;
    if (formData.publicApi === 'Yes') score += 2;
    if (formData.trainingPipelineExposed === 'Yes') score += 3;
    if (formData.automatedOutputs === 'Yes') score += 1;
    if (formData.inputValidated === 'No') score += 2;
    return score >= 5 ? 'CRITICAL' : score >= 3 ? 'HIGH' : score >= 1 ? 'MEDIUM' : 'LOW';
  };

  const attackSurfaceColor = () => {
    const s = attackSurfaceScore();
    return s === 'CRITICAL' ? '#7C0000' : s === 'HIGH' ? '#DC2626' : s === 'MEDIUM' ? '#D97706' : '#059669';
  };

  if (viewSystem) {
    return (
      <div style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-primary, #F8F9FA)' }}>
        <button onClick={() => setViewSystem(null)} style={{ background: 'transparent', border: 'none', color: '#7C3AED', fontSize: '13px', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
          ← Back to AI Security Registry
        </button>

        <div style={{ ...cardStyle('var(--bg-card, #fff)'), marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>{viewSystem.name}</h1>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: '#F3F4F6', color: '#6B7280' }}>{viewSystem.department}</span>
                <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: '#F3F4F6', color: '#6B7280' }}>{viewSystem.type}</span>
                <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: riskColor(viewSystem.overallRisk) + '20', color: riskColor(viewSystem.overallRisk), fontWeight: 600 }}>{viewSystem.overallRisk} RISK</span>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Last assessed: {viewSystem.lastAssessed}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>Security Score</div>
              <div style={{ fontSize: '40px', fontWeight: 700, color: scoreColor(viewSystem.securityScore) }}>{viewSystem.securityScore}%</div>
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ background: 'transparent', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}>Download Report</button>
            <button onClick={() => { setViewSystem(null); openWizard(viewSystem); }} style={{ background: '#7C3AED', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'white' }}>Run New Assessment</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Attack Surface', value: viewSystem.attackSurfaceLevel, isText: true },
            { label: 'Training Data Security', value: viewSystem.trainingDataScore, isText: false },
            { label: 'Model Security', value: viewSystem.modelSecurityScore, isText: false },
            { label: 'Supply Chain Security', value: viewSystem.supplyChainScore, isText: false },
          ].map(item => (
            <div key={item.label} style={cardStyle('var(--bg-card, #fff)')}>
              <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{item.label}</div>
              {item.isText ? (
                <div style={{ fontSize: '18px', fontWeight: 700, color: riskColor(item.value as string) }}>{item.value}</div>
              ) : (
                <>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: scoreColor(item.value as number), marginBottom: '6px' }}>{item.value}%</div>
                  <div style={{ height: '4px', background: '#F3F4F6', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${item.value}%`, background: scoreColor(item.value as number), borderRadius: '2px' }} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{ ...cardStyle('var(--bg-card, #fff)'), marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '14px' }}>Adversarial Threat Assessment</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  {['Attack', 'Reference', 'Likelihood', 'Impact', 'Risk Score', 'Notes'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {viewSystem.adversarialThreats.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>{t.name}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '6px', background: '#F3F4F6', color: '#6B7280' }}>{t.reference}</span></td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#374151', textAlign: 'center' }}>{t.likelihood}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#374151', textAlign: 'center' }}>{t.impact}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: (t.riskScore >= 13 ? '#7C0000' : t.riskScore >= 9 ? '#DC2626' : t.riskScore >= 5 ? '#D97706' : '#059669') + '20', color: t.riskScore >= 13 ? '#7C0000' : t.riskScore >= 9 ? '#DC2626' : t.riskScore >= 5 ? '#D97706' : '#059669', fontWeight: 600 }}>
                        {t.riskScore} — {t.riskScore >= 13 ? 'Critical' : t.riskScore >= 9 ? 'High' : t.riskScore >= 5 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: '#6B7280', maxWidth: '240px' }}>{t.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...cardStyle('var(--bg-card, #fff)'), marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '14px' }}>Critical Findings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {viewSystem.criticalFindings.map((f, i) => (
              <div key={i} style={{ border: `1px solid ${severityColor(f.severity)}40`, borderLeft: `4px solid ${severityColor(f.severity)}`, borderRadius: '8px', padding: '14px 16px', background: severityColor(f.severity) + '08' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '20px', background: severityColor(f.severity) + '20', color: severityColor(f.severity), fontWeight: 700 }}>{f.severity}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{f.title}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6', marginBottom: '10px' }}>{f.description}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', background: '#F3F4F6', color: '#6B7280' }}>{f.reference}</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', background: '#EDE9FE', color: '#7C3AED' }}>{f.uclControl}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 500 }}>Recommended action: <span style={{ fontWeight: 400, color: '#374151' }}>{f.action}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle('var(--bg-card, #fff)')}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '14px' }}>Remediation Roadmap</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {viewSystem.recommendations.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: priorityColor(r.priority) + '20', color: priorityColor(r.priority), fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>{r.priority}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '3px' }}>{r.action}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{r.description}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: '#F3F4F6', color: '#6B7280' }}>Effort: {r.effort}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: '#F3F4F6', color: '#6B7280' }}>Owner: {r.owner}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: '#EDE9FE', color: '#7C3AED' }}>{r.uclControl}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showWizard) {
    return (
      <div style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-primary, #F8F9FA)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A', margin: 0 }}>AI Security Assessment</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>Step {step} of 7 — {stepLabels[step - 1]}</p>
          </div>
          <button onClick={() => setShowWizard(false)} style={{ background: 'transparent', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: '#6B7280' }}>✕ Close</button>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i + 1 === step ? '#7C3AED' : i + 1 < step ? '#7C3AED' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: i + 1 <= step ? 'white' : '#9CA3AF', flexShrink: 0 }}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '10px', color: i + 1 === step ? '#7C3AED' : '#9CA3AF', display: window.innerWidth > 768 ? 'block' : 'none' }}>{label}</span>
              {i < 6 && <div style={{ width: '16px', height: '2px', background: i + 1 < step ? '#7C3AED' : '#E5E7EB', flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: '#1E40AF' }}>
            Assessing: <strong>{selected.name}</strong> — {selected.department} — {selected.type}
          </div>
        )}

        <div style={{ ...cardStyle('var(--bg-card, #fff)'), marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', margin: 0 }}>{stepLabels[step - 1]}</h3>
            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: '#F3F4F6', color: '#6B7280' }}>
              {['System Profile', 'MITRE ATLAS · STRIDE', 'OWASP LLM Top 10 · MITRE ATLAS', 'NIST AI RMF Map · ISO 42001 Cl.8', 'NIST AI RMF · ISO 42001 Cl.8', 'OWASP LLM Top 10', 'NIST AI RMF · EU AI Act Art.9'][step - 1]}
            </span>
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>System Name <span style={{ color: '#DC2626' }}>*</span></label>
                  <input value={formData.systemName} onChange={e => setFormData(p => ({ ...p, systemName: e.target.value }))} placeholder="e.g. Customer Churn Prediction Model" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Department <span style={{ color: '#DC2626' }}>*</span></label>
                  <select value={formData.department} onChange={e => setFormData(p => ({ ...p, department: e.target.value }))} style={selectStyle}>
                    <option value="">Select department</option>
                    {['HR', 'IT', 'Finance', 'Legal', 'Marketing', 'Operations', 'Facilities', 'Procurement', 'Customer Service', 'Compliance', 'Executive'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>AI System Type <span style={{ color: '#DC2626' }}>*</span></label>
                  <select value={formData.systemType} onChange={e => setFormData(p => ({ ...p, systemType: e.target.value }))} style={selectStyle}>
                    <option value="">Select type</option>
                    {['Predictive AI', 'Decision Support', 'Automated Decision Making', 'Natural Language Processing', 'Computer Vision', 'Recommendation Engine', 'Generative AI / LLM', 'Robotic Process Automation', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>System Owner</label>
                  <input value={formData.systemOwner} onChange={e => setFormData(p => ({ ...p, systemOwner: e.target.value }))} placeholder="e.g. Ahmed Al Hamdan, Head of Operations" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Primary Purpose <span style={{ color: '#DC2626' }}>*</span></label>
                <textarea value={formData.purpose} onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))} placeholder="Describe what this AI system does, its intended outputs, and how results are used in business decisions..." rows={3} style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#0F172A', background: 'var(--bg-primary, #fff)', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={labelStyle}>Vendor / Developer</label>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                  {['In-house developed', 'Third-party vendor'].map(v => (
                    <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                      <input type="radio" name="vendor" value={v} checked={formData.vendor === v} onChange={e => setFormData(p => ({ ...p, vendor: e.target.value }))} />
                      {v}
                    </label>
                  ))}
                </div>
                {formData.vendor === 'Third-party vendor' && (
                  <input value={formData.vendorName} onChange={e => setFormData(p => ({ ...p, vendorName: e.target.value }))} placeholder="Vendor name e.g. TalentSift Technologies" style={inputStyle} />
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Date First Deployed</label>
                  <input type="date" value={formData.deployedDate} onChange={e => setFormData(p => ({ ...p, deployedDate: e.target.value }))} style={inputStyle} />
                </div>
                {[
                  { key: 'affectsIndividuals', label: 'Decisions affect individuals?' },
                  { key: 'customerFacing', label: 'Customer-facing?' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <div style={radioGroupStyle}>
                      {['Yes', 'No'].map(v => (
                        <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                          <input type="radio" name={key} value={v} checked={formData[key as keyof FormData] === v} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label style={labelStyle}>Does this system use personal data?</label>
                <div style={radioGroupStyle}>
                  {['Yes', 'No'].map(v => (
                    <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                      <input type="radio" name="usesPersonalData" value={v} checked={formData.usesPersonalData === v} onChange={e => setFormData(p => ({ ...p, usesPersonalData: e.target.value }))} />
                      {v}
                    </label>
                  ))}
                </div>
                {formData.usesPersonalData === 'Yes' && (
                  <div style={{ marginTop: '10px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#1E40AF' }}>
                    This system uses personal data. A Data Protection Impact Assessment (DPIA) may be required. Check the DPIA Manager module.
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Deployment Environment <span style={{ color: '#DC2626' }}>*</span></label>
                  <select value={formData.deploymentEnv} onChange={e => setFormData(p => ({ ...p, deploymentEnv: e.target.value }))} style={selectStyle}>
                    <option value="">Select environment</option>
                    {['Cloud-hosted SaaS', 'On-premise', 'Hybrid', 'Edge deployment', 'API-only', 'Embedded in application'].map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Number of users with access to model outputs</label>
                  <select value={formData.userCount} onChange={e => setFormData(p => ({ ...p, userCount: e.target.value }))} style={selectStyle}>
                    <option value="">Select range</option>
                    {['Under 10', '10 to 100', '100 to 1000', 'Over 1000', 'Public-facing'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              {[
                { key: 'publicApi', label: 'Is the model API publicly accessible?', warning: { condition: 'Yes', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: 'Publicly accessible AI APIs have significantly higher attack surface. Additional controls are mandatory.' } },
                { key: 'automatedOutputs', label: 'Does the system produce outputs acted upon automatically without human review?', warning: null },
                { key: 'trainingPipelineExposed', label: 'Is the training pipeline accessible from the internet?', warning: { condition: 'Yes', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', text: 'Internet-accessible training pipelines are a critical attack surface. Data poisoning risk is significantly elevated.' } },
              ].map(({ key, label, warning }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <div style={radioGroupStyle}>
                    {['Yes', 'No', 'Not Applicable'].map(v => (
                      <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                        <input type="radio" name={key} value={v} checked={formData[key as keyof FormData] === v} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} />
                        {v}
                      </label>
                    ))}
                  </div>
                  {warning && formData[key as keyof FormData] === warning.condition && (
                    <div style={{ marginTop: '8px', background: warning.bg, border: `1px solid ${warning.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: warning.color }}>{warning.text}</div>
                  )}
                </div>
              ))}
              <div>
                <label style={labelStyle}>Does the system accept user-provided inputs?</label>
                <div style={{ ...radioGroupStyle, marginBottom: '12px' }}>
                  {['Yes', 'No'].map(v => (
                    <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                      <input type="radio" name="acceptsUserInput" value={v} checked={formData.acceptsUserInput === v} onChange={e => setFormData(p => ({ ...p, acceptsUserInput: e.target.value }))} />
                      {v}
                    </label>
                  ))}
                </div>
                {formData.acceptsUserInput === 'Yes' && (
                  <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>Input types accepted (select all that apply)</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Free text', 'File uploads', 'Images', 'Audio', 'Structured data', 'Code'].map(type => (
                          <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#374151', cursor: 'pointer', background: formData.inputTypes.includes(type) ? '#EDE9FE' : '#fff', border: `1px solid ${formData.inputTypes.includes(type) ? '#7C3AED' : '#E5E7EB'}`, borderRadius: '6px', padding: '6px 12px' }}>
                            <input type="checkbox" checked={formData.inputTypes.includes(type)} onChange={e => setFormData(p => ({ ...p, inputTypes: e.target.checked ? [...p.inputTypes, type] : p.inputTypes.filter(t => t !== type) }))} style={{ accentColor: '#7C3AED' }} />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Is input validated and sanitised before reaching the model?</label>
                      <div style={radioGroupStyle}>
                        {['Yes', 'No', 'Partial'].map(v => (
                          <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                            <input type="radio" name="inputValidated" value={v} checked={formData.inputValidated === v} onChange={e => setFormData(p => ({ ...p, inputValidated: e.target.value }))} />
                            {v}
                          </label>
                        ))}
                      </div>
                      {formData.inputValidated === 'No' && (
                        <div style={{ marginTop: '8px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#DC2626' }}>
                          Unvalidated inputs reaching AI models are a critical security risk. Prompt injection, adversarial examples and data poisoning attacks are significantly more likely.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#7C3AED' }}>Calculated Attack Surface Exposure</span>
                <span style={{ fontSize: '22px', fontWeight: 700, color: attackSurfaceColor() }}>{attackSurfaceScore()}</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#7C3AED', marginBottom: '10px' }}>Rating Scale Guide</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Likelihood — how likely is this attack?</div>
                    {[
                      { score: 1, label: 'Very Unlikely', desc: 'No known capability or motivation. Would require significant resources and expertise.' },
                      { score: 2, label: 'Unlikely', desc: 'Theoretically possible but no evidence of attempts. Limited attacker motivation.' },
                      { score: 3, label: 'Possible', desc: 'Could realistically occur. Known attack techniques exist and are within reach of motivated attackers.' },
                      { score: 4, label: 'Likely', desc: 'Probable given the threat landscape. Attackers have capability and motivation. Similar systems have been targeted.' },
                      { score: 5, label: 'Almost Certain', desc: 'Expected to occur. Active exploitation observed in the wild. High attacker interest in this system type.' },
                    ].map(s => (
                      <div key={s.score} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: '1px solid #EDE9FE' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', minWidth: '14px' }}>{s.score}</span>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>{s.label}</span>
                          <span style={{ fontSize: '11px', color: '#6B7280' }}> — {s.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Impact — what is the consequence if it succeeds?</div>
                    {[
                      { score: 1, label: 'Negligible', desc: 'Minimal effect. No personal data exposed. No operational disruption. Easily recoverable.' },
                      { score: 2, label: 'Minor', desc: 'Limited effect. Minor data exposure or degraded model accuracy. Short-term disruption.' },
                      { score: 3, label: 'Moderate', desc: 'Significant effect. Personal data at risk or material decision errors. Regulatory notification may be required.' },
                      { score: 4, label: 'Severe', desc: 'Major impact. Large-scale data breach, significant financial loss, or decisions causing harm to individuals.' },
                      { score: 5, label: 'Critical', desc: 'Catastrophic impact. Mass personal data breach, regulatory action, reputational damage, or safety risk to individuals.' },
                    ].map(s => (
                      <div key={s.score} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: '1px solid #EDE9FE' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', minWidth: '14px' }}>{s.score}</span>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>{s.label}</span>
                          <span style={{ fontSize: '11px', color: '#6B7280' }}> — {s.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: '10px', padding: '8px 12px', background: '#EDE9FE', borderRadius: '6px', fontSize: '11px', color: '#5B21B6' }}>
                  <strong>Risk Score = Likelihood × Impact.</strong> Score 1–5: Very Low. Score 6–10: Low. Score 11–15: Medium. Score 16–20: High. Score 21–25: Critical.
                </div>
              </div>

              {[
                { id: 'promptInjection', name: 'Prompt Injection', ref: 'OWASP LLM01', desc: 'Attackers craft malicious inputs to hijack AI behaviour — overriding instructions, extracting system prompts, or causing the model to perform unintended actions. Particularly critical for any system processing free text or instruction-following models.' },
                { id: 'jailbreak', name: 'Jailbreaking & Safety Bypass', ref: 'OWASP LLM01', desc: 'Techniques to bypass safety filters and content policies — roleplay scenarios, encoding tricks, token manipulation, fictional framing. Relevant for any model with safety guardrails or content restrictions.' },
                { id: 'modelInversion', name: 'Model Inversion', ref: 'MITRE ATLAS AML.T0024', desc: 'Adversary queries the model repeatedly to reconstruct training data — potentially exposing personal data of individuals whose information was used in training. Critical when personal or sensitive data was used.' },
                { id: 'membershipInference', name: 'Membership Inference', ref: 'MITRE ATLAS AML.T0024', desc: "Determines whether a specific individual's data was used in training — can confirm membership of sensitive datasets such as medical records, HR data, financial records or criminal history." },
                { id: 'dataPoisoning', name: 'Data Poisoning', ref: 'MITRE ATLAS AML.T0020', desc: 'Adversary corrupts training data to introduce backdoors, degrade model performance or shift model behaviour in a targeted direction. Critical for models retrained on user-provided or externally sourced data.' },
                { id: 'evasion', name: 'Evasion Attacks — Adversarial Examples', ref: 'MITRE ATLAS AML.T0015', desc: 'Carefully crafted inputs designed to fool the model — transactions that bypass fraud detection, images that fool classifiers, CVs crafted to score highly. Particularly critical for security-sensitive automated decision systems.' },
                { id: 'modelTheft', name: 'Model Theft & Extraction', ref: 'MITRE ATLAS AML.T0035', desc: 'Adversary reconstructs a functional copy of the model by querying it systematically — stealing proprietary model intellectual property and enabling development of targeted evasion techniques.' },
                { id: 'backdoor', name: 'Backdoor Attacks', ref: 'MITRE ATLAS AML.T0018', desc: 'Hidden triggers embedded during training that cause specific misclassification when a particular input pattern is present — model behaves normally in all other cases, making detection extremely difficult.' },
              ].map(threat => {
                const t = formData.threats[threat.id] || { likelihood: 0, impact: 0, notes: '' };
                const rs = t.likelihood * t.impact;
                const rc = rs >= 21 ? '#7C0000' : rs >= 16 ? '#DC2626' : rs >= 11 ? '#EA580C' : rs >= 6 ? '#D97706' : rs >= 1 ? '#059669' : '#9CA3AF';
                const rl = rs >= 21 ? 'Critical' : rs >= 16 ? 'High' : rs >= 11 ? 'Medium' : rs >= 6 ? 'Low' : rs >= 1 ? 'Very Low' : 'Not Rated';

                const likelihoodLabels: Record<number, string> = { 1: 'Very Unlikely', 2: 'Unlikely', 3: 'Possible', 4: 'Likely', 5: 'Almost Certain' };
                const impactLabels: Record<number, string> = { 1: 'Negligible', 2: 'Minor', 3: 'Moderate', 4: 'Severe', 5: 'Critical' };
                const scaleColors: Record<number, string> = { 1: '#059669', 2: '#65A30D', 3: '#D97706', 4: '#DC2626', 5: '#7C0000' };

                return (
                  <div key={threat.id} style={{ ...cardStyle('var(--bg-card, #fff)'), borderLeft: `4px solid ${rs >= 16 ? '#DC2626' : rs >= 11 ? '#EA580C' : rs >= 6 ? '#D97706' : rs >= 1 ? '#059669' : '#E5E7EB'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>{threat.name}</div>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: '#F3F4F6', color: '#6B7280' }}>{threat.ref}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '3px' }}>Risk Score</div>
                        <span style={{ fontSize: '16px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', background: rc + '15', color: rc }}>
                          {t.likelihood > 0 && t.impact > 0 ? `${rs} — ${rl}` : 'Not rated yet'}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.6', marginBottom: '16px' }}>{threat.desc}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '14px' }}>
                      {([
                        { key: 'likelihood' as const, label: 'Likelihood', labels: likelihoodLabels, question: 'How likely is this attack against this specific system?' },
                        { key: 'impact' as const, label: 'Impact', labels: impactLabels, question: 'What is the consequence if this attack succeeds?' },
                      ]).map(({ key, label, labels, question }) => (
                        <div key={key}>
                          <div style={{ marginBottom: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>{label}</div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{question}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3, 4, 5].map(score => {
                              const active = t[key] === score;
                              const col = scaleColors[score];
                              return (
                                <button
                                  key={score}
                                  onClick={() => setFormData(p => ({ ...p, threats: { ...p.threats, [threat.id]: { ...t, [key]: score } } }))}
                                  title={`${score} — ${labels[score]}`}
                                  style={{
                                    flex: 1,
                                    padding: '10px 4px',
                                    border: `2px solid ${active ? col : '#E5E7EB'}`,
                                    borderRadius: '8px',
                                    background: active ? col : 'transparent',
                                    color: active ? 'white' : '#9CA3AF',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '3px',
                                  }}
                                >
                                  <span style={{ fontSize: '15px', fontWeight: 700 }}>{score}</span>
                                  <span style={{ fontSize: '9px', fontWeight: active ? 600 : 400, color: active ? 'white' : '#9CA3AF', lineHeight: '1.2', textAlign: 'center' }}>{labels[score]}</span>
                                </button>
                              );
                            })}
                          </div>
                          {t[key] > 0 && (
                            <div style={{ marginTop: '6px', fontSize: '11px', color: scaleColors[t[key]], fontWeight: 500 }}>
                              Selected: {t[key]} — {labels[t[key]]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {t.likelihood > 0 && t.impact > 0 && (
                      <div style={{ marginBottom: '12px', padding: '10px 14px', background: rc + '10', border: `1px solid ${rc}30`, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#374151' }}>
                          <strong style={{ color: rc }}>Risk Score: {rs}</strong>
                          <span style={{ color: '#6B7280' }}> ({t.likelihood} likelihood × {t.impact} impact) — </span>
                          <strong style={{ color: rc }}>{rl}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(25)].map((_, i) => (
                            <div key={i} style={{ width: '6px', height: '14px', borderRadius: '2px', background: i < rs ? rc : '#E5E7EB' }} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                        Assessor Notes <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional — document specific context, evidence or rationale for your rating)</span>
                      </label>
                      <textarea
                        value={t.notes}
                        onChange={e => setFormData(p => ({ ...p, threats: { ...p.threats, [threat.id]: { ...t, notes: e.target.value } } }))}
                        placeholder={`e.g. "${threat.name} is ${t.likelihood > 3 ? 'elevated' : 'low'} risk for this system because..."`}
                        rows={2}
                        style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#0F172A', background: 'var(--bg-primary, #fff)', resize: 'vertical', boxSizing: 'border-box' as const }}
                      />
                    </div>
                  </div>
                );
              })}

              <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '10px', padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#7C3AED' }}>Overall Adversarial Risk Summary</span>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: '#7C3AED' }}>
                    {Object.values(formData.threats).filter(t => t.likelihood > 0 && t.impact > 0).length > 0
                      ? (Object.values(formData.threats).filter(t => t.likelihood > 0 && t.impact > 0).reduce((sum, t) => sum + t.likelihood * t.impact, 0) / Object.values(formData.threats).filter(t => t.likelihood > 0 && t.impact > 0).length).toFixed(1)
                      : '—'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {[
                    { label: 'Very Low', range: '1–5', color: '#059669' },
                    { label: 'Low', range: '6–10', color: '#65A30D' },
                    { label: 'Medium', range: '11–15', color: '#D97706' },
                    { label: 'High', range: '16–20', color: '#DC2626' },
                    { label: 'Critical', range: '21–25', color: '#7C0000' },
                  ].map(band => {
                    const count = Object.values(formData.threats).filter(t => {
                      const rs = t.likelihood * t.impact;
                      if (band.label === 'Very Low') return rs >= 1 && rs <= 5;
                      if (band.label === 'Low') return rs >= 6 && rs <= 10;
                      if (band.label === 'Medium') return rs >= 11 && rs <= 15;
                      if (band.label === 'High') return rs >= 16 && rs <= 20;
                      if (band.label === 'Critical') return rs >= 21;
                      return false;
                    }).length;
                    return (
                      <div key={band.label} style={{ textAlign: 'center', padding: '8px 4px', background: count > 0 ? band.color + '15' : 'transparent', border: `1px solid ${count > 0 ? band.color + '40' : '#E5E7EB'}`, borderRadius: '6px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: count > 0 ? band.color : '#9CA3AF' }}>{count}</div>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: count > 0 ? band.color : '#9CA3AF' }}>{band.label}</div>
                        <div style={{ fontSize: '9px', color: '#9CA3AF' }}>{band.range}</div>
                      </div>
                    );
                  })}
                </div>
                {Object.values(formData.threats).filter(t => t.likelihood === 0 || t.impact === 0).length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '11px', color: '#D97706' }}>
                    {Object.values(formData.threats).filter(t => t.likelihood === 0 || t.impact === 0).length} attack(s) not yet rated — select likelihood and impact above to complete the assessment.
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 6px' }}>Assess controls protecting the integrity and provenance of training data.</p>
              {[
                { id: 'provenance', label: 'Training data provenance is fully documented — sources, collection methods, dates and version history', ref: 'NIST AI RMF Map · ISO 42001 Cl.8' },
                { id: 'integrity', label: 'Data integrity verification controls in place — checksums, hashing or digital signatures verify data has not been tampered with', ref: 'NIST AI RMF Map' },
                { id: 'access', label: 'Access to training datasets restricted to authorised personnel only on a need-to-know basis', ref: 'ISO 42001 Cl.8 · GDPR Art.32' },
                { id: 'pipeline', label: 'Training pipeline is protected from external access — not internet-accessible', ref: 'MITRE ATLAS AML.T0020' },
                { id: 'anomaly', label: 'Anomaly detection in place to identify unusual patterns in training data', ref: 'NIST AI RMF Map' },
                { id: 'sanitisation', label: 'Data sanitisation and deduplication applied before training', ref: 'ISO 42001 Cl.8' },
                { id: 'thirdParty', label: 'Third party or scraped data reviewed for poisoning risk before inclusion in training', ref: 'MITRE ATLAS AML.T0020' },
                { id: 'legalBasis', label: 'Training data legal basis documented — where personal data is used, legal basis and consent status recorded', ref: 'GDPR Art.5 · UAE PDPL' },
                { id: 'retraining', label: 'Model retraining triggers and processes documented — criteria, frequency and responsible owner defined', ref: 'ISO 42001 Cl.8' },
                { id: 'backdoor', label: 'Backdoor detection testing conducted on training pipeline and resulting model', ref: 'MITRE ATLAS AML.T0018' },
              ].map(item => (
                <div key={item.id} style={{ ...cardStyle('var(--bg-card, #fff)'), borderLeft: `4px solid ${formData.trainingControls[item.id] === 'Yes' ? '#059669' : formData.trainingControls[item.id] === 'No' ? '#DC2626' : formData.trainingControls[item.id] === 'Partial' ? '#D97706' : '#E5E7EB'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#0F172A', marginBottom: '3px' }}>{item.label}</div>
                      <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '6px', background: '#F3F4F6', color: '#6B7280' }}>{item.ref}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {['Yes', 'Partial', 'No', 'N/A'].map(v => {
                        const vc = v === 'Yes' ? '#059669' : v === 'No' ? '#DC2626' : v === 'Partial' ? '#D97706' : '#9CA3AF';
                        const active = formData.trainingControls[item.id] === v;
                        return (
                          <label key={v} style={radioLabel(active, vc)}>
                            <input type="radio" name={`tr-${item.id}`} value={v} checked={active} onChange={e => setFormData(p => ({ ...p, trainingControls: { ...p.trainingControls, [item.id]: e.target.value } }))} style={{ display: 'none' }} />
                            {v}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  {(formData.trainingControls[item.id] === 'No' || formData.trainingControls[item.id] === 'Partial') && (
                    <input value={formData.trainingNotes[item.id] || ''} onChange={e => setFormData(p => ({ ...p, trainingNotes: { ...p.trainingNotes, [item.id]: e.target.value } }))} placeholder="Describe the gap or partial implementation..." style={{ ...inputStyle, height: '34px', marginTop: '10px' }} />
                  )}
                </div>
              ))}
              <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#7C3AED' }}>Training Data Security Score</span>
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#7C3AED' }}>{Math.round((Object.values(formData.trainingControls).filter(v => v === 'Yes').length / 10) * 100)}%</span>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 6px' }}>Assess security controls protecting the AI model — storage, API security, input/output controls and runtime monitoring.</p>
              {[
                { id: 'storage', label: 'Model files stored with access controls — not publicly accessible, access limited to authorised personnel', ref: 'ISO 42001 Cl.8' },
                { id: 'serialisation', label: 'Model serialisation security — safe formats used (ONNX, SafeTensors) rather than insecure formats such as unrestricted pickle', ref: 'NIST AI RMF Manage' },
                { id: 'signing', label: 'Model signing and integrity verification — cryptographic hash or signature verified at deployment', ref: 'UCL-019' },
                { id: 'apiAuth', label: 'Inference API requires authentication — no unauthenticated access to model endpoints', ref: 'ISO 42001 Cl.8 · GDPR Art.32' },
                { id: 'rateLimit', label: 'Rate limiting implemented on inference API to prevent systematic querying and model extraction attacks', ref: 'MITRE ATLAS AML.T0035 · UCL-017' },
                { id: 'inputVal', label: 'Input validation applied before inputs reach the model — length limits, format checks, content filtering', ref: 'OWASP LLM01 · UCL-021' },
                { id: 'outputFilter', label: 'Output filtering applied — model responses checked and sanitised before returning to users', ref: 'OWASP LLM · UCL-020' },
                { id: 'adversarialDetect', label: 'Adversarial input detection capability in place — inputs appearing designed to manipulate the model are flagged', ref: 'MITRE ATLAS AML.T0015 · UCL-021' },
                { id: 'versioning', label: 'Model versioning and rollback capability documented and tested — previous versions can be restored within defined RTO', ref: 'NIST AI RMF Manage · UCL-023' },
                { id: 'logging', label: 'All inference requests logged with sufficient detail — timestamp, user, input hash, output for audit and anomaly detection', ref: 'EU AI Act Art.12 · UCL-025' },
                { id: 'diffPrivacy', label: 'Differential privacy applied where personal data used in training — limiting information leakage from model outputs', ref: 'GDPR Art.32 · UCL-024' },
                { id: 'perfMonitor', label: 'Model performance monitored for signs of manipulation or degradation — alerts configured for accuracy drops or anomalies', ref: 'NIST AI RMF Measure · UCL-025' },
              ].map(item => (
                <div key={item.id} style={{ ...cardStyle('var(--bg-card, #fff)'), borderLeft: `4px solid ${formData.modelControls[item.id] === 'Yes' ? '#059669' : formData.modelControls[item.id] === 'No' ? '#DC2626' : formData.modelControls[item.id] === 'Partial' ? '#D97706' : '#E5E7EB'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#0F172A', marginBottom: '3px' }}>{item.label}</div>
                      <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '6px', background: '#F3F4F6', color: '#6B7280' }}>{item.ref}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {['Yes', 'Partial', 'No', 'N/A'].map(v => {
                        const vc = v === 'Yes' ? '#059669' : v === 'No' ? '#DC2626' : v === 'Partial' ? '#D97706' : '#9CA3AF';
                        const active = formData.modelControls[item.id] === v;
                        return (
                          <label key={v} style={radioLabel(active, vc)}>
                            <input type="radio" name={`mc-${item.id}`} value={v} checked={active} onChange={e => setFormData(p => ({ ...p, modelControls: { ...p.modelControls, [item.id]: e.target.value } }))} style={{ display: 'none' }} />
                            {v}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  {(formData.modelControls[item.id] === 'No' || formData.modelControls[item.id] === 'Partial') && (
                    <input value={formData.modelNotes[item.id] || ''} onChange={e => setFormData(p => ({ ...p, modelNotes: { ...p.modelNotes, [item.id]: e.target.value } }))} placeholder="Describe the gap or partial implementation..." style={{ ...inputStyle, height: '34px', marginTop: '10px' }} />
                  )}
                </div>
              ))}
              <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '8px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#7C3AED' }}>Model Security Score</span>
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#7C3AED' }}>{Math.round((Object.values(formData.modelControls).filter(v => v === 'Yes').length / 12) * 100)}%</span>
              </div>
            </div>
          )}

          {step === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(formData.systemType !== 'Generative AI / LLM' && formData.systemType !== 'Natural Language Processing') && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#059669' }}>
                  These controls are primarily for LLMs and Generative AI. Mark as N/A where not applicable to this system type.
                </div>
              )}
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Assess security controls specific to generative and language model AI — OWASP LLM Top 10 aligned.</p>
              {[
                { id: 'sysPrompt', label: 'System prompt protected from extraction — model cannot reveal its system instructions to users', ref: 'OWASP LLM01' },
                { id: 'piGuard', label: 'Prompt injection detection and filtering in place — malicious instructions embedded in user inputs detected and blocked', ref: 'OWASP LLM01' },
                { id: 'cleanData', label: 'Training data does not contain sensitive, PII or copyright-protected material without appropriate rights', ref: 'OWASP LLM02' },
                { id: 'contentFilter', label: 'Output content filtering active — harmful, illegal, discriminatory or inappropriate content filtered before returning to users', ref: 'OWASP LLM04' },
                { id: 'piiDetect', label: 'PII detection applied to model outputs before returning to users — personal data detected and redacted where not appropriate', ref: 'OWASP LLM06 · GDPR Art.32' },
                { id: 'copyright', label: 'Copyright screening applied to generated content — outputs checked for reproduction of copyrighted material', ref: 'OWASP LLM02' },
                { id: 'hallucination', label: 'Hallucination detection and grounding mechanisms in place — outputs verified against authoritative sources where available', ref: 'OWASP LLM09' },
                { id: 'agency', label: 'Excessive agency controls — model cannot take actions or access systems beyond its defined scope without human approval', ref: 'OWASP LLM08' },
                { id: 'plugins', label: 'Plugin and tool access limited to minimum required — unnecessary integrations and capabilities disabled', ref: 'OWASP LLM07' },
                { id: 'humanOversight', label: 'Human oversight required before model outputs trigger consequential real-world actions', ref: 'OWASP LLM08 · EU AI Act Art.14' },
              ].map(item => (
                <div key={item.id} style={cardStyle('var(--bg-card, #fff)')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#0F172A', marginBottom: '3px' }}>{item.label}</div>
                      <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '6px', background: '#F3F4F6', color: '#6B7280' }}>{item.ref}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {['Yes', 'Partial', 'No', 'N/A'].map(v => {
                        const vc = v === 'Yes' ? '#059669' : v === 'No' ? '#DC2626' : v === 'Partial' ? '#D97706' : '#9CA3AF';
                        const k = 'genai_' + item.id;
                        const active = formData.modelControls[k] === v;
                        return (
                          <label key={v} style={radioLabel(active, vc)}>
                            <input type="radio" name={`ga-${item.id}`} value={v} checked={active} onChange={e => setFormData(p => ({ ...p, modelControls: { ...p.modelControls, [k]: e.target.value } }))} style={{ display: 'none' }} />
                            {v}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Document all third party AI components — foundation models, APIs, libraries and MLOps tools used by this system.</p>
              <button onClick={() => setFormData(p => ({ ...p, supplyChainComponents: [...p.supplyChainComponents, { name: '', type: '', provider: '', securityAssessed: '', modelCard: '', licenceReview: '', sla24h: '', auditRight: '', vulnScan: '' }] }))} style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
                + Add Component
              </button>
              {formData.supplyChainComponents.length === 0 && (
                <div style={{ background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: '8px', padding: '32px', textAlign: 'center', fontSize: '13px', color: '#9CA3AF' }}>
                  No third party components added yet. Click Add Component to document your AI supply chain. If this system is fully in-house with no external dependencies, you may proceed.
                </div>
              )}
              {formData.supplyChainComponents.map((comp, i) => (
                <div key={i} style={cardStyle('var(--bg-card, #fff)')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Component {i + 1}</div>
                    <button onClick={() => setFormData(p => ({ ...p, supplyChainComponents: p.supplyChainComponents.filter((_, idx) => idx !== i) }))} style={{ background: 'transparent', border: 'none', color: '#DC2626', fontSize: '12px', cursor: 'pointer', padding: 0 }}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Component Name</label>
                      <input value={comp.name} onChange={e => { const c = [...formData.supplyChainComponents]; c[i] = { ...c[i], name: e.target.value }; setFormData(p => ({ ...p, supplyChainComponents: c })); }} placeholder="e.g. OpenAI GPT-4" style={{ ...inputStyle, height: '36px', fontSize: '12px' }} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Type</label>
                      <select value={comp.type} onChange={e => { const c = [...formData.supplyChainComponents]; c[i] = { ...c[i], type: e.target.value }; setFormData(p => ({ ...p, supplyChainComponents: c })); }} style={{ ...selectStyle, height: '36px', fontSize: '12px' }}>
                        <option value="">Select type</option>
                        {['Foundation Model', 'API', 'Library', 'Dataset', 'MLOps Tool'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Provider</label>
                      <input value={comp.provider} onChange={e => { const c = [...formData.supplyChainComponents]; c[i] = { ...c[i], provider: e.target.value }; setFormData(p => ({ ...p, supplyChainComponents: c })); }} placeholder="e.g. OpenAI" style={{ ...inputStyle, height: '36px', fontSize: '12px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                    {[
                      { key: 'securityAssessed', label: 'Security assessed' },
                      { key: 'modelCard', label: 'Model card reviewed' },
                      { key: 'licenceReview', label: 'Licence reviewed' },
                      { key: 'sla24h', label: 'SLA 24h incident' },
                      { key: 'auditRight', label: 'Right to audit' },
                      { key: 'vulnScan', label: 'Vuln scan done' },
                    ].map(({ key, label }) => {
                      const val = comp[key as keyof typeof comp];
                      return (
                        <div key={key} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '6px', lineHeight: '1.4' }}>{label}</div>
                          <select value={val} onChange={e => { const c = [...formData.supplyChainComponents]; c[i] = { ...c[i], [key]: e.target.value }; setFormData(p => ({ ...p, supplyChainComponents: c })); }} style={{ width: '100%', height: '30px', border: `1px solid ${val === 'Yes' ? '#059669' : val === 'No' ? '#DC2626' : '#E5E7EB'}`, borderRadius: '6px', padding: '0 2px', fontSize: '11px', color: val === 'Yes' ? '#059669' : val === 'No' ? '#DC2626' : '#0F172A', background: 'var(--bg-primary, #fff)' }}>
                            <option value="">—</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="N/A">N/A</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button onClick={() => step > 1 ? setStep(step - 1) : setShowWizard(false)} style={{ background: 'transparent', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
            {step === 1 ? 'Cancel' : '← Previous'}
          </button>
          <button onClick={() => step < 7 ? setStep(step + 1) : setShowWizard(false)} style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
            {step === 7 ? 'Complete Assessment ✓' : 'Next →'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-primary, #F8F9FA)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary, #0F172A)', margin: '0 0 4px' }}>AI Security Governance</h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Adversarial threat modelling · Model security assessment · OWASP LLM Top 10 · MITRE ATLAS · NIST AI RMF</p>
        </div>
        <button onClick={() => openWizard(null)} style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          + Run New Assessment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'AI Systems Assessed', value: systems.length, color: 'var(--text-primary, #0F172A)' },
          { label: 'Critical Vulnerabilities', value: critical, color: '#DC2626' },
          { label: 'High Risk Systems', value: high, color: '#DC2626' },
          { label: 'Avg Security Score', value: `${avg}%`, color: scoreColor(avg) },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                {['System Name', 'Department', 'Type', 'Security Score', 'Top Threat', 'Red Team', 'Risk', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.5px', whiteSpace: 'nowrap' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {systems.map(sys => (
                <tr key={sys.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary, #0F172A)' }}>{sys.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B7280' }}>{sys.department}</td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6B7280', whiteSpace: 'nowrap' as const }}>{sys.type}</td>
                  <td style={{ padding: '14px 16px', minWidth: '140px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#F3F4F6', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${sys.securityScore}%`, background: scoreColor(sys.securityScore), borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: scoreColor(sys.securityScore), minWidth: '36px' }}>{sys.securityScore}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: threatColor(sys.topThreatLevel) + '20', color: threatColor(sys.topThreatLevel), fontWeight: 600, whiteSpace: 'nowrap' as const }}>{sys.topThreat}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6B7280', whiteSpace: 'nowrap' as const }}>{sys.redTeamStatus}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: riskColor(sys.overallRisk) + '20', color: riskColor(sys.overallRisk), fontWeight: 600 }}>{sys.overallRisk}</span>
                  </td>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' as const }}>
                    <button onClick={() => openWizard(sys)} style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginRight: '6px' }}>Assess</button>
                    <button onClick={() => setViewSystem(sys)} style={{ background: 'transparent', color: '#7C3AED', border: '1px solid #7C3AED', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
