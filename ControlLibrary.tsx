import { useState, useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';

interface Framework {
  name: string;
  satisfied: string;
}

interface AttestationHistory {
  date: string;
  attestedBy: string;
  status: string;
  notes: string;
}

interface Control {
  id: string;
  name: string;
  domain: string;
  description: string;
  frameworks: Framework[];
  owner: string;
  status: string;
  lastAttested: string;
  nextAttestation: string;
  attestationFrequency: number;
  linkedAssets: string[];
  attestationHistory: AttestationHistory[];
  gap?: string;
}

export default function ControlLibrary() {
  const [controls, setControls] = useState<Control[]>([
    {
      id: "UCL-001",
      name: "Encryption at Rest",
      domain: "Data Security",
      description: "Personal data and AI training data must be encrypted at rest using AES-256 or equivalent. Encryption keys must be managed separately from encrypted data and rotated annually.",
      frameworks: [
        { name: "GDPR Art.32", satisfied: "Yes" },
        { name: "NIST Measure", satisfied: "Yes" },
        { name: "ISO 42001 Cl.8", satisfied: "Yes" },
        { name: "UAE PDPL", satisfied: "Yes" }
      ],
      owner: "IT Security",
      status: "Compliant",
      lastAttested: "15 Feb 2026",
      nextAttestation: "15 Aug 2026",
      attestationFrequency: 180,
      linkedAssets: ["DPIA-2026-001", "DPIA-2026-003", "DPIA-2026-005", "AI-SYS-2026-002"],
      attestationHistory: [
        { date: "15 Feb 2026", attestedBy: "Tariq Al Mansoori", status: "Compliant", notes: "AES-256 confirmed across all production systems. Key rotation completed January 2026." },
        { date: "15 Aug 2025", attestedBy: "Tariq Al Mansoori", status: "Compliant", notes: "No changes to encryption configuration." },
        { date: "15 Feb 2025", attestedBy: "Sara Al Hashimi", status: "Compliant", notes: "Encryption verified post cloud migration." }
      ]
    },
    {
      id: "UCL-002",
      name: "Encryption in Transit",
      domain: "Data Security",
      description: "All personal data transmitted over networks must be encrypted using TLS 1.2 minimum. TLS 1.3 preferred. Unencrypted transmission of personal data is prohibited.",
      frameworks: [
        { name: "GDPR Art.32", satisfied: "Yes" },
        { name: "NIST Measure", satisfied: "Yes" },
        { name: "ISO 42001 Cl.8", satisfied: "Yes" }
      ],
      owner: "IT Security",
      status: "Compliant",
      lastAttested: "15 Feb 2026",
      nextAttestation: "15 Aug 2026",
      attestationFrequency: 180,
      linkedAssets: ["DPIA-2026-001", "DPIA-2026-002", "DPIA-2026-004"],
      attestationHistory: [
        { date: "15 Feb 2026", attestedBy: "Tariq Al Mansoori", status: "Compliant", notes: "TLS 1.3 enforced across all APIs. Legacy TLS 1.0 and 1.1 disabled." }
      ]
    },
    {
      id: "UCL-003",
      name: "Role-Based Access Control",
      domain: "Data Security",
      description: "Access to personal data and AI systems must be restricted to authorised personnel only on a need-to-know basis. Access rights must be reviewed quarterly and revoked immediately upon role change or departure.",
      frameworks: [
        { name: "GDPR Art.32", satisfied: "Yes" },
        { name: "NIST Govern", satisfied: "Yes" },
        { name: "ISO 27001 A.9", satisfied: "Yes" },
        { name: "EU AI Act Art.14", satisfied: "Yes" }
      ],
      owner: "IT Security",
      status: "Compliant",
      lastAttested: "10 Jan 2026",
      nextAttestation: "10 Jul 2026",
      attestationFrequency: 180,
      linkedAssets: ["DPIA-2026-001", "DPIA-2026-003", "AI-SYS-2026-002", "AI-SYS-2026-004"],
      attestationHistory: [
        { date: "10 Jan 2026", attestedBy: "Tariq Al Mansoori", status: "Compliant", notes: "Quarterly access review completed. 12 stale accounts deactivated." }
      ]
    },
    {
      id: "UCL-004",
      name: "Multi-Factor Authentication",
      domain: "Data Security",
      description: "MFA must be enforced for all systems processing personal data or hosting AI models. Acceptable MFA methods: authenticator app, hardware token, biometric. SMS OTP not acceptable for high-risk systems.",
      frameworks: [
        { name: "GDPR Art.32", satisfied: "Partial" },
        { name: "NIST Govern", satisfied: "Partial" },
        { name: "ISO 42001 Cl.8", satisfied: "Partial" }
      ],
      owner: "IT Security",
      status: "Needs Attention",
      gap: "MFA not enforced on legacy HR system (PeopleSoft v9.1). Remediation ticket raised — target completion 30 Apr 2026.",
      lastAttested: "10 Jan 2026",
      nextAttestation: "10 Apr 2026",
      attestationFrequency: 90,
      linkedAssets: ["DPIA-2026-001", "AI-SYS-2026-002"],
      attestationHistory: [
        { date: "10 Jan 2026", attestedBy: "Tariq Al Mansoori", status: "Needs Attention", notes: "MFA gap identified on PeopleSoft HR system. Modern systems compliant. Remediation in progress." },
        { date: "10 Oct 2025", attestedBy: "Tariq Al Mansoori", status: "Needs Attention", notes: "Gap first identified. Vendor contacted for upgrade path." }
      ]
    },
    {
      id: "UCL-005",
      name: "Audit Logging and Monitoring",
      domain: "Data Security",
      description: "All access to personal data and AI system inputs/outputs must be logged with timestamp, user identity, action performed and data accessed. Logs must be retained for minimum 12 months and protected from tampering.",
      frameworks: [
        { name: "GDPR Art.32", satisfied: "Yes" },
        { name: "NIST Measure", satisfied: "Yes" },
        { name: "EU AI Act Art.12", satisfied: "Yes" },
        { name: "ISO 42001 Cl.9", satisfied: "Yes" }
      ],
      owner: "IT Security",
      status: "Compliant",
      lastAttested: "20 Feb 2026",
      nextAttestation: "20 Aug 2026",
      attestationFrequency: 180,
      linkedAssets: ["AI-SYS-2026-002", "AI-SYS-2026-004", "DPIA-2026-001"],
      attestationHistory: [
        { date: "20 Feb 2026", attestedBy: "Tariq Al Mansoori", status: "Compliant", notes: "SIEM configured. Log retention confirmed at 13 months. Tamper protection enabled." }
      ]
    },
    {
      id: "UCL-006",
      name: "AI Governance Policy",
      domain: "AI Accountability",
      description: "A documented AI governance policy must exist covering: AI system inventory, accountability assignment, ethical principles, risk appetite, prohibited uses, and incident reporting. Policy must be reviewed annually and approved by senior leadership.",
      frameworks: [
        { name: "NIST Govern", satisfied: "Partial" },
        { name: "ISO 42001 Cl.5", satisfied: "Partial" },
        { name: "UAE AI Strategy", satisfied: "Partial" },
        { name: "EU AI Act Art.9", satisfied: "Partial" }
      ],
      owner: "Compliance",
      status: "Needs Attention",
      gap: "Current AI governance policy does not specifically address recruitment AI or biometric systems. Policy update required to cover High Risk EU AI Act systems individually.",
      lastAttested: "05 Jan 2026",
      nextAttestation: "05 Apr 2026",
      attestationFrequency: 90,
      linkedAssets: ["AI-SYS-2026-002", "AI-SYS-2026-006"],
      attestationHistory: [
        { date: "05 Jan 2026", attestedBy: "Sarah Al Mansouri", status: "Needs Attention", notes: "Policy reviewed. Gap identified — does not cover recruitment AI or biometric systems specifically." },
        { date: "05 Jan 2025", attestedBy: "Sarah Al Mansouri", status: "Compliant", notes: "Annual policy review completed and approved by CTO." }
      ]
    },
    {
      id: "UCL-007",
      name: "Bias and Fairness Testing",
      domain: "AI Accountability",
      description: "AI systems making decisions affecting individuals must undergo bias and fairness testing before deployment and at least annually thereafter. Testing must cover protected characteristics: gender, nationality, age, disability. Results must be documented and remediated where bias is found.",
      frameworks: [
        { name: "NIST Measure", satisfied: "No" },
        { name: "EU AI Act Art.15", satisfied: "No" },
        { name: "ISO 42001 Cl.9", satisfied: "No" },
        { name: "UAE AI Ethics", satisfied: "No" }
      ],
      owner: "IT Security",
      status: "Drifting",
      gap: "No bias or fairness testing has been conducted for HR Recruitment Screener (AI-SYS-2026-002) or Fraud Detection Engine (AI-SYS-2026-004). Last attestation over 180 days ago. This is a critical compliance gap.",
      lastAttested: "01 Sep 2025",
      nextAttestation: "01 Mar 2026",
      attestationFrequency: 180,
      linkedAssets: ["AI-SYS-2026-002", "AI-SYS-2026-004"],
      attestationHistory: [
        { date: "01 Sep 2025", attestedBy: "Tariq Al Mansoori", status: "Needs Attention", notes: "Bias testing planned for Q4 2025. Not yet executed." },
        { date: "01 Mar 2025", attestedBy: "Tariq Al Mansoori", status: "Needs Attention", notes: "Testing methodology being developed." }
      ]
    },
    {
      id: "UCL-008",
      name: "Human Oversight of AI Decisions",
      domain: "AI Accountability",
      description: "AI systems making decisions with significant effect on individuals must have meaningful human oversight. No individual should be subject to a decision based solely on automated processing without the ability to obtain human review. Human review must be documented and auditable.",
      frameworks: [
        { name: "GDPR Art.22", satisfied: "Partial" },
        { name: "NIST Manage", satisfied: "Partial" },
        { name: "EU AI Act Art.14", satisfied: "Partial" },
        { name: "UAE TDRA", satisfied: "Partial" }
      ],
      owner: "Compliance",
      status: "Needs Attention",
      gap: "HR Recruitment Screener automatically rejects 80% of candidates without human review. This is non-compliant with GDPR Art.22 and EU AI Act Art.14. Immediate process change required.",
      lastAttested: "15 Feb 2026",
      nextAttestation: "15 May 2026",
      attestationFrequency: 90,
      linkedAssets: ["AI-SYS-2026-002", "AI-SYS-2026-004"],
      attestationHistory: [
        { date: "15 Feb 2026", attestedBy: "Sarah Al Mansouri", status: "Needs Attention", notes: "Human oversight gap identified for recruitment AI. Escalated to HR Director." }
      ]
    },
    {
      id: "UCL-009",
      name: "AI Incident Response Plan",
      domain: "AI Accountability",
      description: "A documented AI incident response plan must exist covering: AI failure detection, escalation procedures, stakeholder notification, model rollback capability, post-incident review and regulatory notification where required. Plan must be tested annually.",
      frameworks: [
        { name: "NIST Manage", satisfied: "No" },
        { name: "ISO 42001 Cl.10", satisfied: "No" },
        { name: "UAE AI Strategy", satisfied: "No" }
      ],
      owner: "Compliance",
      status: "Drifting",
      gap: "AI incident response plan has not been updated or tested since Fraud Detection Engine deployment in August 2023. Over 900 days since last attestation. Critical drift.",
      lastAttested: "10 Aug 2023",
      nextAttestation: "10 Aug 2024",
      attestationFrequency: 365,
      linkedAssets: ["AI-SYS-2026-004", "AI-SYS-2026-006"],
      attestationHistory: [
        { date: "10 Aug 2023", attestedBy: "Omar Al Mazrouei", status: "Compliant", notes: "Plan documented at deployment. Annual review scheduled." }
      ]
    },
    {
      id: "UCL-010",
      name: "Model Performance Monitoring",
      domain: "AI Accountability",
      description: "Production AI models must have automated performance monitoring with defined thresholds. Alerts must trigger when accuracy, precision or recall drops below acceptable levels. Monthly performance reports required for High Risk AI Act systems.",
      frameworks: [
        { name: "NIST Measure", satisfied: "Yes" },
        { name: "ISO 42001 Cl.9", satisfied: "Yes" },
        { name: "EU AI Act Art.12", satisfied: "Yes" }
      ],
      owner: "IT Security",
      status: "Compliant",
      lastAttested: "01 Mar 2026",
      nextAttestation: "01 Jun 2026",
      attestationFrequency: 90,
      linkedAssets: ["AI-SYS-2026-001", "AI-SYS-2026-003", "AI-SYS-2026-005"],
      attestationHistory: [
        { date: "01 Mar 2026", attestedBy: "Tariq Al Mansoori", status: "Compliant", notes: "Monitoring dashboards active for all production models. Alerting configured." }
      ]
    },
    {
      id: "UCL-011",
      name: "Right of Access Fulfilment",
      domain: "Privacy Rights",
      description: "Processes must exist to fulfil data subject access requests within statutory timeframes: 30 days under UAE PDPL, 1 month under GDPR. Requests must be logged, tracked and responded to in a structured, machine-readable format where requested.",
      frameworks: [
        { name: "GDPR Art.15", satisfied: "Yes" },
        { name: "UAE PDPL Art.12", satisfied: "Yes" }
      ],
      owner: "Legal",
      status: "Compliant",
      lastAttested: "20 Jan 2026",
      nextAttestation: "20 Jul 2026",
      attestationFrequency: 180,
      linkedAssets: ["DPIA-2026-001", "DPIA-2026-002"],
      attestationHistory: [
        { date: "20 Jan 2026", attestedBy: "Sarah Al Mansouri", status: "Compliant", notes: "SAR process documented. Average response time 12 days. No overdue requests." }
      ]
    },
    {
      id: "UCL-012",
      name: "Right to Erasure Process",
      domain: "Privacy Rights",
      description: "A documented process must exist to fulfil erasure requests including deletion from primary systems, backups, and processor systems. Deletion from backup systems must occur within the next scheduled backup cycle. Timeline and scope must be communicated to the data subject.",
      frameworks: [
        { name: "GDPR Art.17", satisfied: "Partial" },
        { name: "UAE PDPL Art.14", satisfied: "Partial" }
      ],
      owner: "Legal",
      status: "Needs Attention",
      gap: "Erasure from backup systems currently takes up to 90 days due to monthly backup retention schedule. Best practice is 30 days maximum. Backup rotation policy review required.",
      lastAttested: "20 Jan 2026",
      nextAttestation: "20 Apr 2026",
      attestationFrequency: 90,
      linkedAssets: ["DPIA-2026-001", "DPIA-2026-002"],
      attestationHistory: [
        { date: "20 Jan 2026", attestedBy: "Sarah Al Mansouri", status: "Needs Attention", notes: "Erasure gap identified for backup systems. IT team reviewing backup rotation policy." }
      ]
    },
    {
      id: "UCL-013",
      name: "Consent Management",
      domain: "Privacy Rights",
      description: "Where consent is the legal basis for processing, consent must be freely given, specific, informed and unambiguous. Consent records must be maintained. Withdrawal must be as easy as giving consent and must be honoured without detriment.",
      frameworks: [
        { name: "GDPR Art.7", satisfied: "Yes" },
        { name: "UAE PDPL Art.9", satisfied: "Yes" }
      ],
      owner: "Legal",
      status: "Compliant",
      lastAttested: "01 Feb 2026",
      nextAttestation: "01 Aug 2026",
      attestationFrequency: 180,
      linkedAssets: ["DPIA-2026-002"],
      attestationHistory: [
        { date: "01 Feb 2026", attestedBy: "Sarah Al Mansouri", status: "Compliant", notes: "Consent management platform verified. Withdrawal mechanism tested and functional." }
      ]
    },
    {
      id: "UCL-014",
      name: "Standard Contractual Clauses",
      domain: "Cross-border Transfers",
      description: "Standard Contractual Clauses (SCCs) must be in place for all transfers of personal data to countries without an adequacy decision. SCCs must be the current approved versions. Transfer Impact Assessments must accompany SCCs for high-risk destination countries.",
      frameworks: [
        { name: "GDPR Art.46", satisfied: "Yes" },
        { name: "UAE PDPL Art.26", satisfied: "Yes" }
      ],
      owner: "Legal",
      status: "Compliant",
      lastAttested: "10 Feb 2026",
      nextAttestation: "10 Feb 2027",
      attestationFrequency: 365,
      linkedAssets: ["DPIA-2026-001", "DPIA-2026-002", "DPIA-2026-006"],
      attestationHistory: [
        { date: "10 Feb 2026", attestedBy: "Omar Al Mazrouei", status: "Compliant", notes: "2021 SCCs in place for all US and UK transfers. Reviewed post-UK adequacy confirmation." }
      ]
    },
    {
      id: "UCL-015",
      name: "Transfer Impact Assessment",
      domain: "Cross-border Transfers",
      description: "A Transfer Impact Assessment must be conducted for transfers to countries without an adequacy decision, assessing the legal framework of the destination country and its potential impact on the protection afforded by the SCCs.",
      frameworks: [
        { name: "GDPR Art.46", satisfied: "Partial" },
        { name: "UAE PDPL Art.26", satisfied: "Partial" },
        { name: "NIST Map", satisfied: "Partial" }
      ],
      owner: "Legal",
      status: "Drifting",
      gap: "TIA for LogiTrack MENA Saudi Arabia transfer (DPIA-2026-004) not completed. DPA also outstanding for this processor. Both required before data transfer commences.",
      lastAttested: "15 Mar 2026",
      nextAttestation: "15 Apr 2026",
      attestationFrequency: 30,
      linkedAssets: ["DPIA-2026-004"],
      attestationHistory: [
        { date: "15 Mar 2026", attestedBy: "Omar Al Mazrouei", status: "Drifting", notes: "TIA initiated for Saudi Arabia transfer. Awaiting legal team completion. Transfer on hold pending TIA." }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [frameworkFilter, setFrameworkFilter] = useState('All Frameworks');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [ownerFilter, setOwnerFilter] = useState('All Owners');

  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [showReattestModal, setShowReattestModal] = useState(false);
  const [reattestStatus, setReattestStatus] = useState('Compliant');
  const [reattestNotes, setReattestNotes] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');

  const filteredControls = useMemo(() => {
    let filtered = [...controls];

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (domainFilter !== 'All Domains') {
      filtered = filtered.filter(c => c.domain === domainFilter);
    }

    if (frameworkFilter !== 'All Frameworks') {
      filtered = filtered.filter(c =>
        c.frameworks.some(f => f.name.includes(frameworkFilter))
      );
    }

    if (statusFilter !== 'All Statuses') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (ownerFilter !== 'All Owners') {
      filtered = filtered.filter(c => c.owner === ownerFilter);
    }

    return filtered;
  }, [controls, searchTerm, domainFilter, frameworkFilter, statusFilter, ownerFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant':
        return { border: '#10B981', bg: '#D1FAE5', text: '#065F46' };
      case 'Needs Attention':
        return { border: '#F59E0B', bg: '#FEF3C7', text: '#92400E' };
      case 'Drifting':
        return { border: '#EF4444', bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { border: '#9CA3AF', bg: '#F3F4F6', text: '#374151' };
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'Data Security':
        return { bg: '#EDE9FE', text: '#5B21B6' };
      case 'AI Accountability':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'Privacy Rights':
        return { bg: '#FED7AA', text: '#9A3412' };
      case 'Cross-border Transfers':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'Governance & Oversight':
        return { bg: '#D1FAE5', text: '#065F46' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const getFrameworkColor = (framework: string) => {
    if (framework.includes('GDPR')) {
      return { bg: '#DBEAFE', text: '#1E40AF' };
    } else if (framework.includes('UAE PDPL')) {
      return { bg: '#FED7AA', text: '#9A3412' };
    } else if (framework.includes('NIST')) {
      return { bg: '#EDE9FE', text: '#5B21B6' };
    } else if (framework.includes('EU AI Act')) {
      return { bg: '#FEE2E2', text: '#991B1B' };
    } else if (framework.includes('ISO')) {
      return { bg: '#D1FAE5', text: '#065F46' };
    } else {
      return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const compliantCount = controls.filter(c => c.status === 'Compliant').length;
  const needsAttentionCount = controls.filter(c => c.status === 'Needs Attention').length;
  const driftingCount = controls.filter(c => c.status === 'Drifting').length;

  const mainFrameworks = ['GDPR', 'UAE PDPL', 'NIST AI RMF', 'EU AI Act', 'ISO 42001'];

  const hasFramework = (control: Control, framework: string) => {
    return control.frameworks.some(f => {
      if (framework === 'GDPR') return f.name.includes('GDPR');
      if (framework === 'UAE PDPL') return f.name.includes('UAE PDPL');
      if (framework === 'NIST AI RMF') return f.name.includes('NIST');
      if (framework === 'EU AI Act') return f.name.includes('EU AI Act');
      if (framework === 'ISO 42001') return f.name.includes('ISO');
      return false;
    });
  };

  const handleReattestClick = () => {
    setReattestStatus('Compliant');
    setReattestNotes('');
    setShowReattestModal(true);
  };

  const handleReattestSubmit = () => {
    if (!selectedControl) return;

    const today = new Date();
    const todayFormatted = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const updatedControls = controls.map(c => {
      if (c.id === selectedControl.id) {
        return {
          ...c,
          status: reattestStatus,
          lastAttested: todayFormatted,
          attestationHistory: [
            { date: todayFormatted, attestedBy: "AG", status: reattestStatus, notes: reattestNotes },
            ...c.attestationHistory
          ]
        };
      }
      return c;
    });

    setControls(updatedControls);
    const updatedControl = updatedControls.find(c => c.id === selectedControl.id);
    if (updatedControl) {
      setSelectedControl(updatedControl);
    }

    setShowReattestModal(false);
    setSuccessMessage(`${selectedControl.id} re-attested successfully`);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-[20px] font-['Sora'] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Unified Control Library
        </h1>
        <p className="text-[13px] mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          15 unified controls mapped across GDPR, UAE PDPL, NIST AI RMF, EU AI Act and ISO 42001. Assess once — satisfy multiple frameworks simultaneously.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
            <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>Total Controls:</span>
            <span className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{controls.length}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#D1FAE5' }}>
            <span className="text-[12px] font-medium text-[#065F46]">Compliant:</span>
            <span className="text-[14px] font-semibold text-[#065F46]">{compliantCount}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
            <span className="text-[12px] font-medium text-[#92400E]">Needs Attention:</span>
            <span className="text-[14px] font-semibold text-[#92400E]">{needsAttentionCount}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#FEE2E2' }}>
            <span className="text-[12px] font-medium text-[#991B1B]">Drifting:</span>
            <span className="text-[14px] font-semibold text-[#991B1B]">{driftingCount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search controls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg text-[13px]"
              style={{
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-card-border)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="h-10 px-3 pr-8 rounded-lg text-[13px] appearance-none cursor-pointer"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-card-border)',
              color: 'var(--color-text-primary)'
            }}
          >
            <option>All Domains</option>
            <option>Data Security</option>
            <option>AI Accountability</option>
            <option>Privacy Rights</option>
            <option>Cross-border Transfers</option>
            <option>Governance & Oversight</option>
          </select>

          <select
            value={frameworkFilter}
            onChange={(e) => setFrameworkFilter(e.target.value)}
            className="h-10 px-3 pr-8 rounded-lg text-[13px] appearance-none cursor-pointer"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-card-border)',
              color: 'var(--color-text-primary)'
            }}
          >
            <option>All Frameworks</option>
            <option>GDPR</option>
            <option>UAE PDPL</option>
            <option>NIST AI RMF</option>
            <option>EU AI Act</option>
            <option>ISO 42001</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 pr-8 rounded-lg text-[13px] appearance-none cursor-pointer"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-card-border)',
              color: 'var(--color-text-primary)'
            }}
          >
            <option>All Statuses</option>
            <option>Compliant</option>
            <option>Needs Attention</option>
            <option>Drifting</option>
            <option>Not Assessed</option>
          </select>

          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="h-10 px-3 pr-8 rounded-lg text-[13px] appearance-none cursor-pointer"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-card-border)',
              color: 'var(--color-text-primary)'
            }}
          >
            <option>All Owners</option>
            <option>IT Security</option>
            <option>Legal</option>
            <option>Compliance</option>
            <option>HR</option>
            <option>Operations</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
          <button
            onClick={() => setViewMode('cards')}
            className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
            style={{
              backgroundColor: viewMode === 'cards' ? '#D04A02' : 'transparent',
              color: viewMode === 'cards' ? 'white' : 'var(--color-text-secondary)'
            }}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
            style={{
              backgroundColor: viewMode === 'matrix' ? '#D04A02' : 'transparent',
              color: viewMode === 'matrix' ? 'white' : 'var(--color-text-secondary)'
            }}
          >
            Framework Coverage
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <>
          <div className="text-[12px] mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Showing {filteredControls.length} of {controls.length} controls
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3" style={{ contentVisibility: 'auto' }}>
            {filteredControls.map((control) => {
              const statusColors = getStatusColor(control.status);
              const domainColors = getDomainColor(control.domain);

              return (
                <div
                  key={control.id}
                  className="rounded-[10px] p-4 cursor-pointer hover:shadow-lg transition-all"
                  style={{
                    backgroundColor: 'var(--color-card-bg)',
                    border: '1px solid var(--color-card-border)',
                    borderLeft: `4px solid ${statusColors.border}`
                  }}
                  onClick={() => setSelectedControl(control)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{control.id}</span>
                    <div
                      className="px-2 py-0.5 rounded text-[10px] font-medium"
                      style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                    >
                      {control.status}
                    </div>
                  </div>

                  <h3 className="text-[14px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {control.name}
                  </h3>

                  <div
                    className="inline-block px-2 py-1 rounded text-[11px] font-medium mb-3"
                    style={{ backgroundColor: domainColors.bg, color: domainColors.text }}
                  >
                    {control.domain}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {control.frameworks.slice(0, 3).map((fw, idx) => {
                      const fwColors = getFrameworkColor(fw.name);
                      return (
                        <div
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{ backgroundColor: fwColors.bg, color: fwColors.text }}
                        >
                          {fw.name}
                        </div>
                      );
                    })}
                    {control.frameworks.length > 3 && (
                      <div className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                        +{control.frameworks.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[12px] pt-3 border-t" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}>
                    <span>{control.owner}</span>
                    <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                      {control.lastAttested}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
          <h3 className="text-[16px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Framework Coverage Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-card-border)' }}>
                  <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--color-text-primary)' }}>Control ID</th>
                  <th className="text-left py-3 px-2 font-semibold" style={{ color: 'var(--color-text-primary)' }}>Control Name</th>
                  {mainFrameworks.map(fw => (
                    <th key={fw} className="text-center py-3 px-2 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {fw}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredControls.map((control) => (
                  <tr key={control.id} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                    <td className="py-3 px-2" style={{ color: '#9CA3AF' }}>{control.id}</td>
                    <td className="py-3 px-2" style={{ color: 'var(--color-text-primary)' }}>{control.name}</td>
                    {mainFrameworks.map(fw => {
                      const hasF = hasFramework(control, fw);
                      return (
                        <td key={fw} className="text-center py-3 px-2">
                          {hasF ? (
                            <span className="text-green-600 font-bold">✓</span>
                          ) : (
                            <span style={{ color: '#D1D5DB' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-6" style={{ borderTop: '2px solid var(--color-card-border)' }}>
            <h4 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Framework Completion
            </h4>
            <div className="grid grid-cols-5 gap-4">
              {mainFrameworks.map(fw => {
                const controlsForFramework = controls.filter(c => hasFramework(c, fw));
                const compliantForFramework = controlsForFramework.filter(c => c.status === 'Compliant');
                const percentage = controlsForFramework.length > 0
                  ? Math.round((compliantForFramework.length / controlsForFramework.length) * 100)
                  : 0;

                return (
                  <div key={fw} className="text-center">
                    <div className="text-[24px] font-bold mb-1" style={{ color: '#D04A02' }}>
                      {percentage}%
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {fw}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedControl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end"
          onClick={() => { setSelectedControl(null); setShowReattestModal(false); }}
        >
          <div
            className="w-[480px] h-full overflow-y-auto slide-in-right"
            style={{ backgroundColor: 'var(--color-card-bg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-[11px] mb-1" style={{ color: '#9CA3AF' }}>
                    {selectedControl.id}
                  </div>
                  <h2 className="text-[20px] font-['Sora'] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {selectedControl.name}
                  </h2>
                </div>
                <button
                  onClick={() => { setSelectedControl(null); setShowReattestModal(false); }}
                  className="text-[24px] leading-none"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <div
                  className="inline-block px-3 py-1 rounded text-[12px] font-medium"
                  style={{
                    backgroundColor: getStatusColor(selectedControl.status).bg,
                    color: getStatusColor(selectedControl.status).text
                  }}
                >
                  {selectedControl.status}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[14px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Description
                </h3>
                <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedControl.description}
                </p>
              </div>

              {selectedControl.gap && (
                <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}>
                  <h3 className="text-[13px] font-semibold mb-1 text-[#92400E]">
                    Gap Identified
                  </h3>
                  <p className="text-[12px] text-[#92400E]">
                    {selectedControl.gap}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Framework Mapping
                </h3>
                <div className="space-y-2">
                  {selectedControl.frameworks.map((fw, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--color-header-bg)', border: '1px solid var(--color-card-border)' }}
                    >
                      <div>
                        <div className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {fw.name}
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                          Satisfied: {fw.satisfied}
                        </div>
                      </div>
                      <span className={fw.satisfied === 'Yes' ? 'text-green-600' : fw.satisfied === 'Partial' ? 'text-yellow-600' : 'text-red-600'} style={{ fontWeight: 'bold' }}>
                        {fw.satisfied === 'Yes' ? '✓' : fw.satisfied === 'Partial' ? '◐' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[14px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Control Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Owner</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{selectedControl.owner}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Domain</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{selectedControl.domain}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Last Attested</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{selectedControl.lastAttested}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Re-attest Due</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{selectedControl.nextAttestation}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Attestation History
                </h3>
                <div className="space-y-3">
                  {selectedControl.attestationHistory.map((history, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--color-header-bg)', border: '1px solid var(--color-card-border)' }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {history.attestedBy}
                        </div>
                        <div className="text-[11px]" style={{ color: '#9CA3AF' }}>
                          {history.date}
                        </div>
                      </div>
                      <div
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2"
                        style={{
                          backgroundColor: getStatusColor(history.status).bg,
                          color: getStatusColor(history.status).text
                        }}
                      >
                        {history.status}
                      </div>
                      <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                        {history.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {!showReattestModal ? (
                <button
                  onClick={handleReattestClick}
                  className="w-full h-11 rounded-lg text-white font-semibold text-[14px]"
                  style={{ backgroundColor: '#D04A02' }}
                >
                  Re-attest Control
                </button>
              ) : (
                <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-header-bg)', border: '1px solid var(--color-card-border)' }}>
                  <h3 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                    Re-attest {selectedControl.id}
                  </h3>

                  <div className="mb-4">
                    <label className="block text-[12px] font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      New Status
                    </label>
                    <select
                      value={reattestStatus}
                      onChange={(e) => setReattestStatus(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg text-[13px]"
                      style={{
                        backgroundColor: 'var(--color-card-bg)',
                        border: '1px solid var(--color-card-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <option>Compliant</option>
                      <option>Needs Attention</option>
                      <option>Not Compliant</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[12px] font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Notes
                    </label>
                    <textarea
                      value={reattestNotes}
                      onChange={(e) => setReattestNotes(e.target.value)}
                      placeholder="Describe findings from this attestation"
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg text-[13px] resize-none"
                      style={{
                        backgroundColor: 'var(--color-card-bg)',
                        border: '1px solid var(--color-card-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleReattestSubmit}
                      className="flex-1 h-10 rounded-lg text-white font-semibold text-[13px]"
                      style={{ backgroundColor: '#D04A02' }}
                    >
                      Confirm Re-attest
                    </button>
                    <button
                      onClick={() => setShowReattestModal(false)}
                      className="flex-1 h-10 rounded-lg font-semibold text-[13px]"
                      style={{
                        backgroundColor: 'var(--color-card-bg)',
                        border: '1px solid var(--color-card-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div
          className="fixed top-20 right-6 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in"
          style={{ backgroundColor: '#10B981', color: 'white' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <style>{`
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideInDown 0.3s ease-out;
        }
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
