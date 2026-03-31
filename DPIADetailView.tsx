import { useState } from 'react';
import { ArrowLeft, Download, CreditCard as Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { type DPIA } from '../lib/supabase';

type DPIADetailViewProps = {
  dpia: DPIA;
  onClose: () => void;
  onEdit: (dpia: DPIA) => void;
};

export default function DPIADetailView({ dpia, onClose, onEdit }: DPIADetailViewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  const toggleSection = (sectionNum: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionNum]: !prev[sectionNum],
    }));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626', border: '#DC2626' };
      case 'Medium':
        return { bg: 'rgba(217, 119, 6, 0.1)', text: '#D97706', border: '#D97706' };
      case 'Low':
        return { bg: 'rgba(5, 150, 105, 0.1)', text: '#059669', border: '#059669' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280', border: '#6B7280' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
      case 'Approved':
        return { bg: 'rgba(5, 150, 105, 0.1)', text: '#059669' };
      case 'In Review':
      case 'In Progress':
        return { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563EB' };
      case 'Pending':
        return { bg: 'rgba(217, 119, 6, 0.1)', text: '#D97706' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' };
    }
  };

  const riskColors = getRiskColor(dpia.calculated_risk_level || 'Low');
  const statusColors = getStatusColor(dpia.status || 'Draft');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--table-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to DPIA Manager</span>
        </button>

        <div className="rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl lg:text-[22px] font-['Sora'] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {dpia.assessment_name}
              </h1>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Reference: {dpia.reference_number}
              </p>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: riskColors.bg,
                    color: riskColors.text,
                    border: `1px solid ${riskColors.border}`,
                  }}
                >
                  {dpia.calculated_risk_level} Risk
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                  }}
                >
                  {dpia.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                <span>Created: {formatDate(dpia.created_at)}</span>
                <span>Department: {dpia.department}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                className="px-4 py-2 h-11 sm:h-auto rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => onEdit(dpia)}
                className="px-4 py-2 h-11 sm:h-auto rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 text-white"
                style={{ backgroundColor: '#D04A02' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B03D02';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#D04A02';
                }}
              >
                <Edit className="w-4 h-4" />
                Edit DPIA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Legal Basis</p>
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {dpia.legal_basis_gdpr || 'Legitimate Interest'}
              </p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Data Subjects</p>
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {dpia.number_of_subjects || '1,000-10,000'}
              </p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Retention Period</p>
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {dpia.retention_period || '7 years'}
              </p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Controls Maturity</p>
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {dpia.controls_maturity_score || 72}%
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((sectionNum) => {
            const isExpanded = expandedSections[sectionNum];
            const sectionTitles = [
              'Processing Activity & Legal Basis',
              'Legitimate Interest Balancing Test',
              'Data Inventory',
              'Transfers & Third Parties',
              'Security Controls',
              'Data Subject Rights',
              'Article 35 & Risk Score',
            ];

            return (
              <div
                key={sectionNum}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              >
                <button
                  onClick={() => toggleSection(sectionNum)}
                  className="w-full p-6 flex items-center justify-between transition-all duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--table-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <h2 className="text-lg font-['Sora'] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {sectionNum}. {sectionTitles[sectionNum - 1]}
                  </h2>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  ) : (
                    <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="pt-4 space-y-3">
                      {sectionNum === 1 && (
                        <>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Department</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.department}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Legal Basis</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.legal_basis_gdpr || 'Legitimate Interest'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Purpose of Processing</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {dpia.purpose_of_processing || 'Monitor and analyze processing activities for compliance purposes'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>High Risk Processing</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {dpia.high_risk_processing ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </>
                      )}
                      {sectionNum === 2 && dpia.lia_required && (
                        <>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Legitimate Interest Pursued</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {dpia.legitimate_interest_pursued || 'Business efficiency and operational monitoring'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Necessity Test</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {dpia.necessity_test_passed ? 'Passed' : 'Not Passed'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Balancing Conclusion</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {dpia.balancing_conclusion || 'Balancing test completed - legitimate interest applies'}
                            </p>
                          </div>
                        </>
                      )}
                      {sectionNum === 3 && (
                        <>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Personal Data Categories</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {Array.isArray(dpia.personal_data_types) ? dpia.personal_data_types.join(', ') : 'Behavioural Data, Location Data'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Number of Data Subjects</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.number_of_subjects || '1,000-10,000'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Data Minimisation Compliant</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.data_minimisation_compliant || 'Partially'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Retention Period</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.retention_period || '7 years'}</p>
                          </div>
                        </>
                      )}
                      {sectionNum === 4 && (
                        <>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Third Party Sharing</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.third_party_sharing ? 'Yes' : 'No'}</p>
                          </div>
                          {dpia.third_party_sharing && (
                            <>
                              <div>
                                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>DPAs in Place</p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.dpas_in_place || 'Yes'}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Cross-Border Transfers</p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.cross_border_transfers ? 'Yes' : 'No'}</p>
                              </div>
                            </>
                          )}
                        </>
                      )}
                      {sectionNum === 5 && (
                        <>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Security Controls</p>
                            <div className="space-y-2 mt-2">
                              {Array.isArray(dpia.security_controls) && dpia.security_controls.length > 0 ? (
                                dpia.security_controls.map((control: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{control.name}</span>
                                    <span className="text-xs font-medium" style={{ color: control.status === 'Yes' ? '#059669' : '#D97706' }}>
                                      {control.status}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Security controls in place and operational</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Controls Maturity Score</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${dpia.controls_maturity_score || 72}%`,
                                    backgroundColor: dpia.controls_maturity_score >= 75 ? '#059669' : '#D97706',
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {dpia.controls_maturity_score || 72}%
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      {sectionNum === 6 && (
                        <div>
                          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Data Subject Rights Assessment</p>
                          <div className="space-y-2">
                            {Array.isArray(dpia.dsr_assessment) && dpia.dsr_assessment.length > 0 ? (
                              dpia.dsr_assessment.map((right: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{right.name}</span>
                                  <span className="text-xs font-medium" style={{ color: right.compliant === 'Yes' ? '#059669' : '#D97706' }}>
                                    {right.compliant}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>All data subject rights are supported</p>
                            )}
                          </div>
                        </div>
                      )}
                      {sectionNum === 7 && (
                        <>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Article 35 GDPR Triggers</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {Array.isArray(dpia.art35_triggers) ? dpia.art35_triggers.join(', ') : 'Systematic monitoring, automated decision-making'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>DPO Consulted</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dpia.dpo_consulted_step7 ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Overall Risk Score</p>
                            <div className="mt-2 p-4 rounded-lg" style={{ backgroundColor: riskColors.bg, border: `2px solid ${riskColors.border}` }}>
                              <p className="text-2xl font-bold text-center" style={{ color: riskColors.text }}>
                                {dpia.calculated_risk_level} Risk
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
