import { useState, useMemo } from 'react';
import { Plus, Search, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AISystemWizard from '../components/AISystemWizard';
import AISystemDetailView from '../components/AISystemDetailView';

type AISystem = {
  id: string;
  reference_number: string;
  system_name: string;
  department: string;
  ai_type: string;
  primary_purpose?: string;
  system_owner?: string;
  vendor_type?: string;
  vendor_name?: string;
  deployment_date: string | null;
  affects_individuals?: boolean;
  customer_facing?: boolean;
  uses_personal_data?: boolean;
  eu_ai_act_class: string;
  nist_overall_score: number;
  iso42001_overall_score: number;
  uae_overall_score: number;
  overall_risk: string;
  gap_analysis: any[];
  recommendations: any[];
  status: string;
  created_at: string;
  updated_at?: string;
  eu_prohibited_practices?: any[];
  nist_scores?: any;
  iso42001_scores?: any;
  uae_scores?: any;
};

const getRiskBadgeColor = (risk: string) => {
  switch (risk) {
    case 'High':
      return 'bg-[#DC2626]/10 text-[#DC2626]';
    case 'Medium':
      return 'bg-[#D97706]/10 text-[#D97706]';
    case 'Low':
      return 'bg-[#059669]/10 text-[#059669]';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getEUClassColor = (euClass: string) => {
  switch (euClass) {
    case 'Unacceptable':
      return 'bg-[#DC2626]/10 text-[#DC2626]';
    case 'High Risk':
      return 'bg-[#D97706]/10 text-[#D97706]';
    case 'Limited':
      return 'bg-[#F59E0B]/10 text-[#F59E0B]';
    case 'Minimal':
      return 'bg-[#059669]/10 text-[#059669]';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function AIGovernance() {
  const [systems, setSystems] = useState<AISystem[]>([
    {
      id: "ai-sys-001",
      reference_number: "AI-SYS-2026-001",
      system_name: "Predictive Maintenance Model",
      department: "Operations",
      ai_type: "Predictive AI",
      primary_purpose: "Analyses sensor data from industrial equipment to predict maintenance requirements and failures before they occur",
      system_owner: "Ahmed Al Hamdan, Head of Operations",
      vendor_type: "In-house",
      vendor_name: "",
      deployment_date: "2024-06-15",
      affects_individuals: false,
      customer_facing: false,
      uses_personal_data: false,
      eu_ai_act_class: "Limited",
      status: "Active",
      nist_overall_score: 82,
      iso42001_overall_score: 97,
      uae_overall_score: 95,
      overall_risk: "Low",
      created_at: "2024-06-15T09:00:00Z",
      updated_at: "2024-06-15T09:00:00Z",
      eu_prohibited_practices: [],
      nist_scores: {},
      iso42001_scores: {},
      uae_scores: {},
      gap_analysis: [
        { framework: "ISO 42001", description: "Clause 9 internal audit partially complete — schedule annual audit", severity: "Minor" },
        { framework: "NIST", description: "NIST Measure — consider third-party model validation", severity: "Minor" }
      ],
      recommendations: [
        { priority: "Low", title: "Maintain current governance standard", frameworks: ["All"], effort: "Low" },
        { priority: "Low", title: "Schedule annual reassessment", frameworks: ["NIST", "ISO 42001"], effort: "Low" }
      ]
    },
    {
      id: "ai-sys-002",
      reference_number: "AI-SYS-2026-002",
      system_name: "HR Recruitment Screening AI",
      department: "HR",
      ai_type: "Decision Support",
      primary_purpose: "Screens and scores job applications automatically by analysing CV content, work history patterns and psychometric assessment results",
      system_owner: "Layla Al Suwaidi, HR Director",
      vendor_type: "Third-party",
      vendor_name: "TalentSift AI",
      deployment_date: "2026-01-03",
      affects_individuals: true,
      customer_facing: false,
      uses_personal_data: true,
      eu_ai_act_class: "High Risk",
      status: "Active",
      nist_overall_score: 61,
      iso42001_overall_score: 55,
      uae_overall_score: 60,
      overall_risk: "High",
      created_at: "2026-01-03T10:00:00Z",
      updated_at: "2026-01-03T10:00:00Z",
      eu_prohibited_practices: [],
      nist_scores: {},
      iso42001_scores: {},
      uae_scores: {},
      gap_analysis: [
        { framework: "EU AI Act", description: "Candidates must be informed AI is used in recruitment (Art.13). Automatic rejection without human review likely non-compliant with Art.14 human oversight requirements", severity: "Critical" },
        { framework: "NIST", description: "No bias or fairness testing conducted. Risk of discriminatory outcomes based on gender, nationality or age cannot be ruled out. Immediate bias audit required", severity: "Critical" },
        { framework: "ISO 42001", description: "No AI-specific policy for recruitment system. General AI policy insufficient for High Risk EU AI Act system", severity: "Major" },
        { framework: "UAE", description: "Fairness principle not met. Transparency principle not met — UAE TDRA guidelines require disclosure of AI use in consequential decisions", severity: "Major" },
        { framework: "EU AI Act", description: "Technical documentation (Art.11) not complete. Conformity assessment not conducted. EU AI Act database registration outstanding", severity: "Major" }
      ],
      recommendations: [
        { priority: "Critical", title: "Immediately implement human review for ALL AI rejection decisions", frameworks: ["EU AI Act Art.14", "UAE Ethics"], effort: "Low" },
        { priority: "Critical", title: "Conduct bias audit across gender, nationality and age dimensions", frameworks: ["NIST Measure", "UAE Fairness"], effort: "Medium" },
        { priority: "High", title: "Update candidate communications to disclose AI use in screening", frameworks: ["EU AI Act Art.13"], effort: "Low" },
        { priority: "High", title: "Complete technical documentation and conformity assessment", frameworks: ["EU AI Act Art.11"], effort: "High" },
        { priority: "Medium", title: "Develop recruitment-specific AI governance policy", frameworks: ["ISO Clause 5", "NIST Govern"], effort: "Low" }
      ]
    },
    {
      id: "ai-sys-003",
      reference_number: "AI-SYS-2026-003",
      system_name: "Customer Churn Prediction Model",
      department: "Marketing",
      ai_type: "Predictive AI",
      primary_purpose: "Analyses customer transaction history, engagement patterns and service usage to predict likelihood of churn within next 90 days",
      system_owner: "Fatima Al Zaabi, CMO",
      vendor_type: "In-house",
      vendor_name: "",
      deployment_date: "2024-09-22",
      affects_individuals: true,
      customer_facing: false,
      uses_personal_data: true,
      eu_ai_act_class: "Limited",
      status: "Active",
      nist_overall_score: 78,
      iso42001_overall_score: 72,
      uae_overall_score: 80,
      overall_risk: "Medium",
      created_at: "2024-09-22T11:30:00Z",
      updated_at: "2024-09-22T11:30:00Z",
      eu_prohibited_practices: [],
      nist_scores: {},
      iso42001_scores: {},
      uae_scores: {},
      gap_analysis: [
        { framework: "NIST", description: "NIST Manage — no formal process to handle cases where churn model is wrong", severity: "Minor" }
      ],
      recommendations: [
        { priority: "Medium", title: "Implement model performance review quarterly and feedback loop from account managers", frameworks: ["NIST Manage"], effort: "Medium" }
      ]
    },
    {
      id: "ai-sys-004",
      reference_number: "AI-SYS-2026-004",
      system_name: "Fraud Detection Engine",
      department: "Finance",
      ai_type: "Automated Decision Making",
      primary_purpose: "Real-time analysis of financial transactions to detect and automatically block potentially fraudulent activity",
      system_owner: "Mohammed Al Ketbi, CFO",
      vendor_type: "Third-party",
      vendor_name: "FraudShield Technologies",
      deployment_date: "2023-08-10",
      affects_individuals: true,
      customer_facing: true,
      uses_personal_data: true,
      eu_ai_act_class: "High Risk",
      status: "Active",
      nist_overall_score: 55,
      iso42001_overall_score: 48,
      uae_overall_score: 58,
      overall_risk: "High",
      created_at: "2023-08-10T08:00:00Z",
      updated_at: "2023-08-10T08:00:00Z",
      eu_prohibited_practices: [],
      nist_scores: {},
      iso42001_scores: {},
      uae_scores: {},
      gap_analysis: [
        { framework: "NIST", description: "False positive rate not monitored. Customers incorrectly blocked suffer financial harm. Requires immediate false positive tracking and SLA for resolution", severity: "Critical" },
        { framework: "UAE", description: "Accountability gap — when system incorrectly blocks a legitimate transaction, no clear accountability path exists for customer redress", severity: "Critical" },
        { framework: "ISO 42001", description: "Third-party vendor (FraudShield) AI model is a black box — internal team cannot explain individual decisions. Explainability requirement not met", severity: "Major" },
        { framework: "EU AI Act", description: "High Risk classification requires conformity assessment and technical documentation. Neither complete", severity: "Major" }
      ],
      recommendations: [
        { priority: "Critical", title: "Implement false positive monitoring dashboard — track rate weekly, set maximum acceptable threshold of 2%", frameworks: ["NIST Measure"], effort: "Medium" },
        { priority: "Critical", title: "Establish clear customer redress process for incorrect blocks with resolution SLA of 4 hours", frameworks: ["UAE Ethics"], effort: "Low" },
        { priority: "High", title: "Request model explainability documentation from FraudShield — contractual right to explanation", frameworks: ["ISO 42001"], effort: "Low" }
      ]
    },
    {
      id: "ai-sys-005",
      reference_number: "AI-SYS-2026-005",
      system_name: "Legal Document Classifier",
      department: "Legal",
      ai_type: "Natural Language Processing",
      primary_purpose: "Automatically classifies and routes incoming legal documents, contracts and correspondence to the appropriate legal team member",
      system_owner: "Omar Al Mazrouei, General Counsel",
      vendor_type: "In-house",
      vendor_name: "",
      deployment_date: "2025-03-14",
      affects_individuals: false,
      customer_facing: false,
      uses_personal_data: false,
      eu_ai_act_class: "Minimal",
      status: "Active",
      nist_overall_score: 90,
      iso42001_overall_score: 88,
      uae_overall_score: 92,
      overall_risk: "Low",
      created_at: "2025-03-14T13:00:00Z",
      updated_at: "2025-03-14T13:00:00Z",
      eu_prohibited_practices: [],
      nist_scores: {},
      iso42001_scores: {},
      uae_scores: {},
      gap_analysis: [],
      recommendations: [
        { priority: "Low", title: "Document model retraining schedule formally and conduct annual third-party validation", frameworks: ["All"], effort: "Low" }
      ]
    },
    {
      id: "ai-sys-006",
      reference_number: "AI-SYS-2026-006",
      system_name: "Biometric Access Vision System",
      department: "Facilities",
      ai_type: "Computer Vision",
      primary_purpose: "Facial recognition system for employee access control at Meridian Group headquarters and two satellite offices",
      system_owner: "Hassan Al Nuaimi, Head of Facilities",
      vendor_type: "Third-party",
      vendor_name: "VisionAccess Gulf LLC",
      deployment_date: "2025-11-01",
      affects_individuals: true,
      customer_facing: false,
      uses_personal_data: true,
      eu_ai_act_class: "Unacceptable",
      status: "Active",
      nist_overall_score: 48,
      iso42001_overall_score: 42,
      uae_overall_score: 50,
      overall_risk: "High",
      created_at: "2025-11-01T07:00:00Z",
      updated_at: "2025-11-01T07:00:00Z",
      eu_prohibited_practices: [false, false, false, true, false, false, false, false],
      nist_scores: {},
      iso42001_scores: {},
      uae_scores: {},
      gap_analysis: [
        { framework: "EU AI Act", description: "PROHIBITED — Prohibited use screening triggered. Facial recognition in publicly accessible common areas may be prohibited under Art.5(1)(h). Legal review required immediately", severity: "Critical" },
        { framework: "NIST", description: "No AI governance policy covers biometric systems specifically. No ethical review conducted prior to deployment", severity: "Critical" },
        { framework: "UAE", description: "Biometric processing without explicit informed consent for all employees may violate UAE PDPL and ethical principles. Consent obtained at onboarding but not specific to facial recognition", severity: "Critical" }
      ],
      recommendations: [
        { priority: "Critical", title: "Immediate legal review required — possible prohibited AI practice under EU AI Act Art.5", frameworks: ["EU AI Act"], effort: "High" },
        { priority: "Critical", title: "Obtain explicit consent from all employees specifically for facial recognition processing", frameworks: ["UAE PDPL"], effort: "Medium" },
        { priority: "High", title: "Develop biometric AI-specific governance policy with ethical review", frameworks: ["NIST Govern"], effort: "Medium" }
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<AISystem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [euFilter, setEuFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const navigate = useNavigate();

  const loadSystems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_systems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSystems(data || []);
    } catch (error) {
      console.error('Error loading AI systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSystem = async (data: any) => {
    try {
      const { error } = await supabase.from('ai_systems').insert(data);

      if (error) throw error;

      await loadSystems();
      setShowWizard(false);
    } catch (error) {
      console.error('Error submitting AI system:', error);
      alert('Error submitting AI system. Please try again.');
    }
  };

  const filteredSystems = useMemo(() => {
    return systems.filter(system => {
      const matchesSearch = system.system_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           system.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEU = euFilter === 'all' || system.eu_ai_act_class === euFilter;
      const matchesRisk = riskFilter === 'all' || system.overall_risk === riskFilter;
      return matchesSearch && matchesEU && matchesRisk;
    });
  }, [systems, searchTerm, euFilter, riskFilter]);

  const stats = {
    total: systems.length,
    highRiskEU: systems.filter(s => s.eu_ai_act_class === 'High Risk').length,
    avgNIST: systems.length > 0 ? Math.round(systems.reduce((sum, s) => sum + s.nist_overall_score, 0) / systems.length) : 0,
    iso42001Compliant: systems.filter(s => s.iso42001_overall_score >= 80).length,
    assessmentsDue: systems.filter(s => s.status === 'Under Review').length,
    minimal: systems.filter(s => s.eu_ai_act_class === 'Minimal').length,
    limited: systems.filter(s => s.eu_ai_act_class === 'Limited').length,
    highRisk: systems.filter(s => s.eu_ai_act_class === 'High Risk').length,
    unacceptable: systems.filter(s => s.eu_ai_act_class === 'Unacceptable').length
  };

  if (selectedSystem) {
    return (
      <AISystemDetailView
        system={selectedSystem}
        onClose={() => setSelectedSystem(null)}
      />
    );
  }

  return (
    <>
      <div className="space-y-6 page-enter">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-display font-bold" style={{ color: 'var(--text-primary)' }}>AI Governance</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Multi-framework AI governance platform
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-150 text-[14px] font-medium whitespace-nowrap text-white"
            style={{ backgroundColor: '#2563EB' }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Register New AI System
          </button>
        </div>

        <div className="rounded-xl p-4 sm:p-5 lg:p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>AI Systems Registered</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>High EU AI Act Risk</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#DC2626' }}>{stats.highRiskEU}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Average NIST Score</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: stats.avgNIST >= 75 ? '#059669' : stats.avgNIST >= 50 ? '#D97706' : '#DC2626' }}>
                  {stats.avgNIST}%
                </p>
              </div>
              <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${stats.avgNIST}%`,
                    backgroundColor: stats.avgNIST >= 75 ? '#059669' : stats.avgNIST >= 50 ? '#D97706' : '#DC2626'
                  }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>ISO 42001 Compliant</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#059669' }}>{stats.iso42001Compliant}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Assessments Due</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#D97706' }}>{stats.assessmentsDue}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              EU AI Act Risk Heatmap — Systems by Classification
            </p>
            <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#059669' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Minimal ({stats.minimal})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Limited ({stats.limited})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D97706' }} />
                <span style={{ color: 'var(--text-secondary)' }}>High Risk ({stats.highRisk})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC2626' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Unacceptable ({stats.unacceptable})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[10px] overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="p-4 flex flex-col sm:flex-row gap-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search AI systems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                style={{
                  border: '1px solid var(--input-border)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <select
              value={euFilter}
              onChange={(e) => setEuFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              style={{
                border: '1px solid var(--input-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-secondary)',
              }}
            >
              <option value="all">All EU AI Act Classes</option>
              <option value="Minimal">Minimal</option>
              <option value="Limited">Limited</option>
              <option value="High Risk">High Risk</option>
              <option value="Unacceptable">Unacceptable</option>
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              style={{
                border: '1px solid var(--input-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-secondary)',
              }}
            >
              <option value="all">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center" style={{ color: 'var(--text-secondary)' }}>Loading AI systems...</div>
            ) : filteredSystems.length === 0 ? (
              <div className="p-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                {searchTerm || euFilter !== 'all' || riskFilter !== 'all'
                  ? 'No AI systems match your filters'
                  : 'No AI systems registered yet. Start by registering your first AI system.'}
              </div>
            ) : (
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      System Name
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      AI Type
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      EU AI Act Class
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      NIST Score
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      ISO 42001
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      UAE Align.
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Security
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Overall Risk
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: '1px solid var(--border-color)' }}>
                  {filteredSystems.map((system) => (
                    <tr
                      key={system.id}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--table-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                          {system.system_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{system.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{system.ai_type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${getEUClassColor(
                            system.eu_ai_act_class
                          )}`}
                        >
                          {system.eu_ai_act_class}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${system.nist_overall_score}%`,
                                backgroundColor: system.nist_overall_score >= 75 ? '#059669' : system.nist_overall_score >= 50 ? '#D97706' : '#DC2626'
                              }}
                            />
                          </div>
                          <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                            {system.nist_overall_score}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                          {system.iso42001_overall_score}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                          {system.uae_overall_score}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            system.system_name === 'Predictive Maintenance Model' || system.system_name === 'Legal Document Classifier'
                              ? 'bg-[#059669]/10 text-[#059669]'
                              : system.system_name === 'Customer Churn Predictor'
                              ? 'bg-[#D97706]/10 text-[#D97706]'
                              : 'bg-[#DC2626]/10 text-[#DC2626]'
                          }`}
                        >
                          {system.system_name === 'Predictive Maintenance Model' || system.system_name === 'Legal Document Classifier'
                            ? 'Assessed'
                            : system.system_name === 'Customer Churn Predictor'
                            ? 'Assessed'
                            : system.system_name === 'HR Recruitment Screener' || system.system_name === 'Fraud Detection Engine' || system.system_name === 'Biometric Access Vision System'
                            ? 'Critical Findings'
                            : 'Not Assessed'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${getRiskBadgeColor(
                            system.overall_risk
                          )}`}
                        >
                          {system.overall_risk}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedSystem(system)}
                            className="text-[13px] font-medium transition-colors"
                            style={{ color: '#2563EB' }}
                          >
                            View
                          </button>
                          <span style={{ color: 'var(--text-tertiary)' }}>|</span>
                          <button
                            onClick={() => navigate('/ai-security')}
                            className="flex items-center gap-1 text-[13px] font-medium transition-colors"
                            style={{ color: '#7C3AED' }}
                            title="Run Security Assessment"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            Security
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="lg:hidden">
            {loading ? (
              <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>Loading AI systems...</div>
            ) : filteredSystems.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                {searchTerm || euFilter !== 'all' || riskFilter !== 'all'
                  ? 'No AI systems match your filters'
                  : 'No AI systems registered yet. Start by registering your first AI system.'}
              </div>
            ) : (
              <div className="divide-y divide-border" style={{ contentVisibility: 'auto' }}>
                {filteredSystems.map((system) => (
                  <div key={system.id} className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                          {system.system_name}
                        </div>
                        <div className="text-xs sm:text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{system.department} • {system.ai_type}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-[10px] text-text-muted mb-1">EU AI Act</p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getEUClassColor(
                            system.eu_ai_act_class
                          )}`}
                        >
                          {system.eu_ai_act_class}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted mb-1">Overall Risk</p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getRiskBadgeColor(
                            system.overall_risk
                          )}`}
                        >
                          {system.overall_risk}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-xs">
                      <div>
                        <span className="text-text-muted">NIST: </span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{system.nist_overall_score}%</span>
                      </div>
                      <div>
                        <span className="text-text-muted">ISO: </span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{system.iso42001_overall_score}%</span>
                      </div>
                      <div>
                        <span className="text-text-muted">UAE: </span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{system.uae_overall_score}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSystem(system)}
                      className="text-xs sm:text-sm font-medium transition-colors"
                      style={{ color: '#2563EB' }}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showWizard && (
        <AISystemWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            loadSystems();
          }}
        />
      )}
    </>
  );
}
