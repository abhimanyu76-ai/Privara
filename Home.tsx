import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, Brain, AlertCircle, FileText, Lock, BarChart3, Clock, AlertTriangle, Library, Shield } from 'lucide-react';

const modules = [
  {
    name: 'DPIA Manager',
    description: 'Data Protection Impact Assessments',
    icon: FileCheck,
    href: '/dpia',
    color: '#D04A02',
    bgColor: '#FFF5F0',
    active: true,
    stats: '8 in progress'
  },
  {
    name: 'AI Governance',
    description: 'AI System Risk & Compliance',
    icon: Brain,
    href: '/ai-governance',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    active: true,
    stats: '6 systems tracked'
  },
  {
    name: 'AI Security Governance',
    description: 'Adversarial threat assessment, model security, red team planning and AI supply chain risk — OWASP LLM Top 10 and MITRE ATLAS aligned',
    icon: Shield,
    href: '/ai-security',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    active: true,
    stats: '6 systems assessed'
  },
  {
    name: 'Incident Centre',
    description: 'GDPR Breach Management',
    icon: AlertCircle,
    href: '/incidents',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    active: true,
    stats: '3 open cases'
  },
  {
    name: 'Policy Advisor',
    description: 'Policy Gap Analysis & Recommendations',
    icon: FileText,
    href: '/policy-advisor',
    color: '#059669',
    bgColor: '#F0FDF4',
    active: true,
    stats: '12 documents'
  },
  {
    name: 'Control Library',
    description: 'Unified controls mapped across all frameworks — assess once, satisfy many',
    icon: Library,
    href: '/control-library',
    color: '#534AB7',
    bgColor: '#EEEDFE',
    active: true,
    stats: '47 controls'
  },
  {
    name: 'Compliance Cockpit',
    description: 'Real-time Compliance Dashboard',
    icon: BarChart3,
    href: '/dashboard',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    active: true,
    isDashboard: true,
    stats: '78% health score'
  },
  {
    name: 'Vendor Risk',
    description: 'Third-Party Risk Management',
    icon: Lock,
    href: '#',
    color: '#6B7280',
    bgColor: '#F9FAFB',
    active: false
  },
  {
    name: 'Training Hub',
    description: 'Privacy & Security Training',
    icon: Lock,
    href: '#',
    color: '#6B7280',
    bgColor: '#F9FAFB',
    active: false
  },
  {
    name: 'Records of Processing',
    description: 'GDPR Art.30 Register',
    icon: Lock,
    href: '#',
    color: '#6B7280',
    bgColor: '#F9FAFB',
    active: false
  }
];

const actionItems = [
  {
    id: 1,
    urgency: 'urgent',
    badge: 'Urgent',
    title: 'GDPR 72h Notification Deadline',
    description: 'IT Security incident reported 61 hours ago. Supervisory authority notification required within 11 hours.',
    module: 'Incident Management',
    moduleColor: '#DC2626',
    time: '11 hrs remaining',
    button: 'Review Now',
    href: '/incidents'
  },
  {
    id: 2,
    urgency: 'urgent',
    badge: 'Urgent',
    title: 'Critical AI Security Vulnerability — Fraud Detection Engine',
    description: 'Fraud Detection Engine scored 38% on AI Security assessment. Critical adversarial example vulnerability identified — immediate remediation required.',
    module: 'AI Security',
    moduleColor: '#7C3AED',
    time: 'Assessment completed today',
    button: 'Review Now',
    href: '/ai-security'
  },
  {
    id: 3,
    urgency: 'urgent',
    badge: 'Urgent',
    title: 'Biometric Vision System — Possible Prohibited Use + Critical Security Risk',
    description: 'EU AI Act prohibited use screening triggered AND security score 31%. Immediate legal and security review required before continued operation.',
    module: 'AI Security',
    moduleColor: '#7C3AED',
    time: 'Requires immediate attention',
    button: 'Review Now',
    href: '/ai-security'
  },
  {
    id: 4,
    urgency: 'urgent',
    badge: 'Urgent',
    title: 'DPIA Approval Required',
    description: 'Biometric Access Control DPIA has been submitted and is awaiting your DPO sign-off before processing commences.',
    module: 'DPIA',
    moduleColor: '#D04A02',
    time: 'Submitted 2 days ago',
    button: 'Review Now',
    href: '/dpia'
  },
  {
    id: 5,
    urgency: 'due-soon',
    badge: 'Due Soon',
    title: 'AI System Risk Assessment Overdue',
    description: 'HR Recruitment Screener has a NIST score of 61% and EU AI Act High Risk classification — assessment review due.',
    module: 'AI Governance',
    moduleColor: '#2563EB',
    time: 'Due in 3 days',
    button: 'Take Action',
    href: '/ai-governance'
  },
  {
    id: 6,
    urgency: 'due-soon',
    badge: 'Due Soon',
    title: 'UAE PDPL Annual Compliance Review',
    description: 'Annual review of processing activities register required under UAE PDPL Art.16. Last completed March 2025.',
    module: 'DPIA',
    moduleColor: '#D04A02',
    time: 'Due in 18 days',
    button: 'Take Action',
    href: '/dpia'
  },
  {
    id: 7,
    urgency: 'pending',
    badge: 'Pending',
    title: 'Policy Gap Analysis — AI Ethics Policy',
    description: 'AI Ethics Policy uploaded 5 days ago. Gap analysis against EU AI Act not yet initiated.',
    module: 'Policy Advisor',
    moduleColor: '#059669',
    time: 'Uploaded 5 days ago',
    button: 'View',
    href: '/policy-advisor'
  },
  {
    id: 6,
    urgency: 'pending',
    badge: 'Pending',
    title: 'Vendor DPA — Cloud Storage Provider',
    description: 'Data Processing Agreement with cloud storage vendor expires in 34 days. Review and renewal required.',
    module: 'DPIA',
    moduleColor: '#D04A02',
    time: 'Expires in 34 days',
    button: 'View',
    href: '/dpia'
  }
];

const getUrgencyColors = (urgency: string) => {
  switch (urgency) {
    case 'urgent':
      return {
        border: 'border-l-red-600',
        badge: 'bg-red-100 text-red-800',
        button: 'bg-red-600 hover:bg-red-700 text-white'
      };
    case 'due-soon':
      return {
        border: 'border-l-amber-500',
        badge: 'bg-amber-100 text-amber-800',
        button: 'bg-amber-500 hover:bg-amber-600 text-white'
      };
    case 'pending':
      return {
        border: 'border-l-blue-500',
        badge: 'bg-blue-100 text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    default:
      return {
        border: 'border-l-gray-500',
        badge: 'bg-gray-100 text-gray-800',
        button: 'bg-gray-600 hover:bg-gray-700 text-white'
      };
  }
};

export default function Home() {
  const navigate = useNavigate();
  const pendingCount = actionItems.length;
  const [clickedCard, setClickedCard] = useState<string | null>(null);

  const handleCardClick = (moduleName: string, href: string) => {
    setClickedCard(moduleName);
    setTimeout(() => {
      setClickedCard(null);
      navigate(href);
    }, 300);
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="px-2 sm:px-0">
        <h1 className="text-lg sm:text-2xl font-['Sora'] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Welcome back</h1>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>Your privacy and AI governance workspace</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        {modules.map((module) => {
          const Icon = module.icon;

          if (!module.active) {
            return (
              <div
                key={module.name}
                className="rounded-[10px] p-4 sm:p-6 flex flex-col relative"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-card-border)',
                  opacity: 0.75,
                }}
              >
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--color-text-tertiary)' }} strokeWidth={2} />
                </div>
                <div
                  className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                  style={{ backgroundColor: module.bgColor }}
                >
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: module.color }} strokeWidth={2} />
                </div>
                <h3 className="text-xs sm:text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{module.name}</h3>
                <p className="text-[11px] sm:text-sm mb-3 sm:mb-4 flex-1 hidden sm:block" style={{ color: 'var(--color-text-body)' }}>{module.description}</p>
                <button
                  className="w-full h-[40px] rounded-lg text-xs sm:text-[13px] font-semibold transition-all duration-200"
                  style={{
                    background: 'transparent',
                    border: '1px solid #D04A02',
                    color: '#D04A02',
                    fontWeight: 600,
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF5F0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Activate
                </button>
              </div>
            );
          }

          return (
            <div
              key={module.name}
              className={`rounded-[10px] p-4 sm:p-6 hover:shadow-lg transition-all flex flex-col ${clickedCard === module.name ? 'card-click' : ''}`}
              style={{
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-card-border)',
              }}
            >
              <div
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                style={{ backgroundColor: module.bgColor }}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: module.color }} strokeWidth={2} />
              </div>
              <h3 className="text-xs sm:text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{module.name}</h3>
              <p className="text-[11px] sm:text-sm mb-2 sm:mb-3 hidden sm:block" style={{ color: 'var(--color-text-body)' }}>{module.description}</p>
              <p className="text-[10px] sm:text-xs mb-3 sm:mb-4 flex-1" style={{ color: 'var(--color-text-secondary)' }}>{module.stats}</p>
              <button
                onClick={() => handleCardClick(module.name, module.href)}
                className="flex items-center justify-center w-full h-[40px] text-white text-xs sm:text-[13px] font-semibold transition-colors"
                style={{
                  backgroundColor: module.color,
                  borderRadius: '8px'
                }}
              >
                {module.isDashboard ? 'View Dashboard' : 'Launch'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
          <div>
            <h2 className="text-sm sm:text-base font-['Sora'] font-semibold" style={{ color: 'var(--color-text-primary)' }}>My Action Items</h2>
            <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Tasks requiring your attention today</p>
          </div>
          <div className="px-2.5 sm:px-3 py-1 bg-[#D04A02] text-white rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0">
            {pendingCount} pending
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {actionItems.map((item) => {
            const colors = getUrgencyColors(item.urgency);

            return (
              <div
                key={item.id}
                className={`rounded-[10px] p-4 ${colors.border} border-l-4 flex flex-col`}
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-card-border)',
                  borderLeftWidth: '4px',
                }}
              >
                <div className={`inline-flex self-start px-2 py-0.5 rounded text-[10px] font-medium mb-3 ${colors.badge}`}>
                  {item.badge}
                </div>

                <h3 className="text-[13px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h3>

                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--color-text-body)' }}>
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-[11px] mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.moduleColor }}
                    />
                    <span>{item.module}</span>
                  </div>
                  <span>{item.time}</span>
                </div>

                <button
                  onClick={() => navigate(item.href)}
                  className={`w-full px-4 py-2 rounded-lg text-xs font-medium text-center transition-colors ${colors.button}`}
                >
                  {item.button}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
