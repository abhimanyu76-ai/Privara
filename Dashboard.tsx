import { useState, useEffect } from 'react';
import { FileCheck, AlertCircle, Brain, FileText, TrendingUp, TrendingDown, Clock, AlertTriangle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const complianceFrameworks = [
  { name: 'UAE PDPL', percentage: 81, color: '#2563EB' },
  { name: 'GDPR Alignment', percentage: 74, color: '#7C3AED' },
  { name: 'ISO 27001', percentage: 88, color: '#059669' },
  { name: 'NIST AI RMF', percentage: 65, color: '#D97706' },
  { name: 'AI Security Posture', percentage: 58, color: '#7C3AED' },
  { name: 'EU AI Act Readiness', percentage: 52, color: '#DC2626' },
];

const modules = [
  { name: 'DPIA Manager', count: '8 in progress', href: '/dpia', icon: FileCheck },
  { name: 'AI Governance', count: '6 systems tracked', href: '/ai-governance', icon: Brain },
  { name: 'AI Security', count: '6 assessed, 2 critical', href: '/ai-security', icon: Shield },
  { name: 'Incident Centre', count: '5 open cases', href: '/incidents', icon: AlertCircle },
  { name: 'Policy Advisor', count: '12 documents', href: '/policy-advisor', icon: FileText },
];

const activities = [
  {
    id: 1,
    department: 'AI Security Team',
    action: 'Critical finding: Fraud Detection Engine scored 38% — adversarial vulnerability identified',
    time: '1h ago',
    type: 'alert',
  },
  {
    id: 2,
    department: 'HR Department',
    action: 'DPIA submitted for payroll system',
    time: '2h ago',
    type: 'warning',
  },
  {
    id: 3,
    department: 'AI Security Team',
    action: 'Model inversion risk detected in Biometric Vision System',
    time: '3h ago',
    type: 'alert',
  },
  {
    id: 4,
    department: 'IT Security',
    action: 'New incident reported: unauthorised access attempt',
    time: '5h ago',
    type: 'alert',
  },
  {
    id: 5,
    department: 'Legal Team',
    action: 'Privacy policy updated and reviewed',
    time: 'Yesterday',
    type: 'success',
  },
  {
    id: 6,
    department: 'Operations',
    action: 'AI system registered: predictive maintenance model',
    time: 'Yesterday',
    type: 'info',
  },
  {
    id: 7,
    department: 'Compliance Team',
    action: 'ISO 27001 gap assessment completed',
    time: '2 days ago',
    type: 'success',
  },
];

const activeDPIAs = [
  {
    id: 1,
    name: 'Employee Monitoring System',
    department: 'HR',
    riskLevel: 'High',
    status: 'In Review',
    dueDate: '10 Apr 2026',
  },
  {
    id: 2,
    name: 'Customer Data Analytics',
    department: 'Marketing',
    riskLevel: 'Medium',
    status: 'Approved',
    dueDate: '28 Mar 2026',
  },
  {
    id: 3,
    name: 'Vendor Data Sharing — Logistics',
    department: 'Procurement',
    riskLevel: 'Medium',
    status: 'In Progress',
    dueDate: '15 Apr 2026',
  },
  {
    id: 4,
    name: 'Biometric Access Control',
    department: 'Facilities',
    riskLevel: 'High',
    status: 'Pending',
    dueDate: '05 Apr 2026',
  },
  {
    id: 5,
    name: 'Cloud Migration — Finance Data',
    department: 'IT',
    riskLevel: 'Low',
    status: 'Complete',
    dueDate: '20 Mar 2026',
  },
];

const regulatoryDeadlines = [
  {
    id: 1,
    title: 'IT Security Incident',
    type: 'GDPR 72h notification',
    timeRemaining: '11 hrs remaining',
    details: 'Reported 61h ago',
    urgency: 'critical',
  },
  {
    id: 2,
    title: 'UAE PDPL Annual Review',
    type: 'Regulatory deadline',
    timeRemaining: 'Due in 18 days',
    details: 'Annual compliance report',
    urgency: 'warning',
  },
  {
    id: 3,
    title: 'AI Act Gap Assessment',
    type: 'Internal deadline',
    timeRemaining: 'Due in 34 days',
    details: 'Q2 strategic initiative',
    urgency: 'success',
  },
];

const getRiskBadgeColor = (risk: string) => {
  switch (risk) {
    case 'High':
      return 'bg-danger/10 text-danger';
    case 'Medium':
      return 'bg-warning/10 text-warning';
    case 'Low':
      return 'bg-success/10 text-success';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Complete':
    case 'Approved':
      return 'bg-success/10 text-success';
    case 'In Review':
    case 'In Progress':
      return 'bg-info/10 text-info';
    case 'Pending':
      return 'bg-warning/10 text-warning';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'critical':
      return 'text-danger';
    case 'warning':
      return 'text-warning';
    case 'success':
      return 'text-success';
    default:
      return 'text-gray-600';
  }
};

export default function Dashboard() {
  const [dpiaStats, setDpiaStats] = useState({
    inProgress: 0,
    awaiting: 0,
    total: 0
  });

  useEffect(() => {
    const loadDPIAStats = async () => {
      try {
        const { data, error } = await supabase.from('dpias').select('status');
        if (error) throw error;

        const inProgress = data?.filter(d => d.status === 'In Review' || d.status === 'In Progress').length || 0;
        const awaiting = data?.filter(d => d.status === 'Pending').length || 0;

        setDpiaStats({
          inProgress,
          awaiting,
          total: data?.length || 0
        });
      } catch (error) {
        console.error('Error loading DPIA stats:', error);
      }
    };

    loadDPIAStats();
  }, []);

  const kpiCards = [
    {
      name: 'Privacy Health Score',
      value: '78',
      unit: '%',
      color: 'border-success',
      trend: { text: '6pts this quarter', isUp: true },
      showProgress: true,
    },
    {
      name: 'Open Incidents',
      value: '3',
      unit: '',
      color: 'border-danger',
      trend: { text: '1 requires immediate action', isUp: false },
      showProgress: false,
    },
    {
      name: 'DPIAs In Progress',
      value: dpiaStats.inProgress.toString(),
      unit: '',
      color: 'border-primary',
      trend: { text: `${dpiaStats.awaiting} awaiting approval`, isUp: false },
      showProgress: false,
    },
    {
      name: 'AI Systems Monitored',
      value: '6',
      unit: '',
      color: 'border-info',
      trend: { text: 'All within policy', isUp: true },
      showProgress: false,
    },
  ];

  const modules = [
    { name: 'DPIA Manager', count: `${dpiaStats.inProgress} in progress`, href: '/dpia', icon: FileCheck },
    { name: 'AI Governance', count: '6 systems tracked', href: '/ai-governance', icon: Brain },
    { name: 'Incident Centre', count: '3 open cases', href: '/incidents', icon: AlertCircle },
    { name: 'Policy Advisor', count: '12 documents', href: '/policy-advisor', icon: FileText },
  ];

  return (
    <div className="p-4 sm:p-5 lg:p-6 min-h-screen page-enter" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {kpiCards.map((card, index) => {
          const topBorderColors = ['#059669', '#DC2626', '#D04A02', '#2563EB'];
          return (
            <div
              key={card.name}
              className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-shadow"
              style={{ borderTop: `3px solid ${topBorderColors[index]}` }}
            >
              <p className="text-xs sm:text-[13px] text-text-secondary font-medium mb-3">{card.name}</p>
              <div className="flex items-center gap-4 mb-3">
                {card.showProgress && (
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                        strokeDasharray={`${(parseInt(card.value) / 100) * 97.4}, 97.4`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg sm:text-xl font-display font-bold text-success">
                        {card.value}
                      </span>
                    </div>
                  </div>
                )}
                <div className={card.showProgress ? '' : 'flex-1'}>
                  <p className="text-2xl sm:text-[28px] lg:text-[32px] font-display font-bold text-text-primary leading-none">
                    {card.value}
                    {card.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-xs">
                {card.trend.isUp ? (
                  <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-success" />
                ) : (
                  <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-danger" />
                )}
                <span className={card.trend.isUp ? 'text-success' : 'text-danger'}>
                  {card.trend.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 sm:p-5 lg:p-6">
          <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary mb-4">
            Compliance Overview
          </h2>
          <div className="space-y-3">
            {complianceFrameworks.map((framework) => (
              <div key={framework.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-text-primary">{framework.name}</span>
                  <span className="text-sm font-bold text-text-primary">{framework.percentage}%</span>
                </div>
                <div className="relative w-full h-[6px] bg-[#F3F4F6] rounded-[3px] overflow-hidden">
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-[3px] transition-all duration-500"
                    style={{
                      width: `${framework.percentage}%`,
                      backgroundColor: framework.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[11px] text-gray-400">Last assessed: 15 Mar 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 sm:p-5 lg:p-6">
          <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary mb-4">My Modules</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.name}
                  to={module.href}
                  className="p-2 sm:p-3 border border-border rounded-xl hover:bg-gray-50 hover:border-primary/30 transition-all group"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary group-hover:text-primary transition-colors mb-2" />
                  <p className="text-[10px] sm:text-xs font-semibold text-text-primary mb-1">{module.name}</p>
                  <p className="text-[10px] sm:text-[11px] text-text-secondary">{module.count}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 sm:p-5 lg:p-6">
          <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2.5">
                <div
                  className={`w-[8px] h-[8px] rounded-full mt-1.5 flex-shrink-0 ${
                    activity.type === 'success'
                      ? 'bg-success'
                      : activity.type === 'alert'
                      ? 'bg-danger'
                      : activity.type === 'warning'
                      ? 'bg-warning'
                      : 'bg-info'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#374151]">
                    <span className="font-semibold">{activity.department}</span>
                    {' — '}
                    <span>{activity.action}</span>
                  </p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-white rounded-[10px] border border-[#E5E7EB] overflow-hidden lg:col-span-2">
          <div className="p-4 sm:p-5 border-b border-border">
            <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary">Active DPIAs</h2>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                    Assessment Name
                  </th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeDPIAs.map((dpia) => (
                  <tr key={dpia.id} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-medium text-text-primary">{dpia.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] text-text-secondary">{dpia.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${getRiskBadgeColor(
                          dpia.riskLevel
                        )}`}
                      >
                        {dpia.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${getStatusBadgeColor(
                          dpia.status
                        )}`}
                      >
                        {dpia.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] text-text-secondary">{dpia.dueDate}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-border">
            {activeDPIAs.map((dpia) => (
              <div key={dpia.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-text-primary mb-1">{dpia.name}</div>
                    <div className="text-xs sm:text-sm text-text-secondary mb-2">{dpia.department}</div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ml-2 flex-shrink-0 ${getRiskBadgeColor(
                      dpia.riskLevel
                    )}`}
                  >
                    {dpia.riskLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusBadgeColor(
                      dpia.status
                    )}`}
                  >
                    {dpia.status}
                  </span>
                  <div className="text-xs sm:text-sm text-text-secondary">{dpia.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[10px] border border-[#E5E7EB] p-4 sm:p-5 lg:p-6">
          <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary mb-4">
            Regulatory Deadlines
          </h2>
          <div className="space-y-3">
            {regulatoryDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className={`p-3 border rounded-xl ${
                  deadline.urgency === 'critical'
                    ? 'border-danger/20 bg-danger/5'
                    : deadline.urgency === 'warning'
                    ? 'border-warning/20 bg-warning/5'
                    : 'border-success/20 bg-success/5'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <Clock
                    className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${getUrgencyColor(deadline.urgency)}`}
                    strokeWidth={2}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-text-primary mb-1">
                      {deadline.title}
                    </p>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-text-secondary mb-2">
                      {deadline.type}
                    </p>
                    <p
                      className={`text-sm sm:text-base font-bold ${getUrgencyColor(deadline.urgency)} mb-1 ${
                        deadline.urgency === 'critical' ? 'animate-pulse' : ''
                      }`}
                    >
                      {deadline.timeRemaining}
                    </p>
                    <p className="text-[10px] sm:text-xs text-text-secondary">{deadline.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
