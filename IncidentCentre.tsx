import { Plus, Clock, Search, Filter } from 'lucide-react';

const incidents = [
  {
    id: 1,
    title: 'Unauthorised Access Attempt',
    severity: 'Critical',
    status: 'In Progress',
    reporter: 'IT Security Team',
    dateReported: '2026-03-24 09:00',
    gdprHoursRemaining: 11,
    incidentType: 'Data Breach',
  },
  {
    id: 2,
    title: 'AI Security Incident — Model Inversion Attack Detected',
    severity: 'Critical',
    status: 'In Progress',
    reporter: 'AI Security Team',
    dateReported: '2026-03-29 16:45',
    gdprHoursRemaining: 53,
    incidentType: 'AI Security Incident',
    subType: 'Model Inversion',
  },
  {
    id: 3,
    title: 'Suspicious Data Download Activity',
    severity: 'High',
    status: 'Under Investigation',
    reporter: 'Data Protection Officer',
    dateReported: '2026-03-23 14:30',
    gdprHoursRemaining: 0,
    incidentType: 'Data Breach',
  },
  {
    id: 4,
    title: 'AI Security Incident — Prompt Injection Attempt on Customer Service Bot',
    severity: 'High',
    status: 'Under Investigation',
    reporter: 'IT Security Team',
    dateReported: '2026-03-28 10:20',
    gdprHoursRemaining: 0,
    incidentType: 'AI Security Incident',
    subType: 'Prompt Injection',
  },
  {
    id: 5,
    title: 'Phishing Email Campaign',
    severity: 'Medium',
    status: 'Resolved',
    reporter: 'IT Helpdesk',
    dateReported: '2026-03-20 11:15',
    gdprHoursRemaining: 0,
    incidentType: 'Security Incident',
  },
];

const getSeverityBadgeColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-danger/10 text-danger';
    case 'High':
      return 'bg-[#FF6B35]/10 text-[#FF6B35]';
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
    case 'Resolved':
      return 'bg-success/10 text-success';
    case 'In Progress':
      return 'bg-info/10 text-info';
    case 'Under Investigation':
      return 'bg-warning/10 text-warning';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getGDPRClockColor = (hours: number) => {
  if (hours === 0) return 'text-gray-400';
  if (hours <= 24) return 'text-danger';
  if (hours <= 48) return 'text-warning';
  return 'text-success';
};

export default function IncidentCentre() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
          Track and manage security incidents with GDPR compliance monitoring
        </p>
        <button className="flex items-center gap-2 px-4 py-2.5 h-11 sm:h-12 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-150 text-xs sm:text-sm font-medium whitespace-nowrap">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add New Incident
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search incidents..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                  Date Reported
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                  GDPR Clock
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-surface transition-colors h-12">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-medium text-text-primary">
                      {incident.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${getSeverityBadgeColor(
                        incident.severity
                      )}`}
                    >
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${getStatusBadgeColor(
                        incident.status
                      )}`}
                    >
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] text-text-secondary">{incident.reporter}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] text-text-secondary">{incident.dateReported}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-4 h-4 ${getGDPRClockColor(incident.gdprHoursRemaining)}`}
                      />
                      <span
                        className={`text-sm font-bold ${getGDPRClockColor(
                          incident.gdprHoursRemaining
                        )}`}
                      >
                        {incident.gdprHoursRemaining > 0
                          ? `${incident.gdprHoursRemaining}h`
                          : 'Expired'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[14px] text-primary hover:text-primary/80 font-medium transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-border">
          {incidents.map((incident) => (
            <div key={incident.id} className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base font-medium text-text-primary mb-2">
                    {incident.title}
                  </div>
                  <div className="text-xs text-text-secondary mb-2">{incident.reporter}</div>
                </div>
              </div>
              <div className="flex items-center flex-wrap gap-2 mb-3">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getSeverityBadgeColor(
                    incident.severity
                  )}`}
                >
                  {incident.severity}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusBadgeColor(
                    incident.status
                  )}`}
                >
                  {incident.status}
                </span>
                <div className="flex items-center gap-1.5">
                  <Clock
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${getGDPRClockColor(incident.gdprHoursRemaining)}`}
                  />
                  <span
                    className={`text-xs font-bold ${getGDPRClockColor(
                      incident.gdprHoursRemaining
                    )}`}
                  >
                    {incident.gdprHoursRemaining > 0
                      ? `${incident.gdprHoursRemaining}h`
                      : 'Expired'}
                  </span>
                </div>
              </div>
              <div className="text-xs text-text-secondary mb-2">{incident.dateReported}</div>
              <button className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
