import { ArrowLeft, Download } from 'lucide-react';

type AISystem = {
  id: string;
  reference_number: string;
  system_name: string;
  department: string;
  ai_type: string;
  deployment_date: string | null;
  eu_ai_act_class: string;
  nist_overall_score: number;
  iso42001_overall_score: number;
  uae_overall_score: number;
  overall_risk: string;
  gap_analysis: any[];
  recommendations: any[];
};

type AISystemDetailViewProps = {
  system: AISystem;
  onClose: () => void;
};

export default function AISystemDetailView({ system, onClose }: AISystemDetailViewProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626' };
      case 'Medium':
        return { bg: 'rgba(217, 119, 6, 0.1)', text: '#D97706' };
      case 'Low':
        return { bg: 'rgba(5, 150, 105, 0.1)', text: '#059669' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' };
    }
  };

  const riskColors = getRiskColor(system.overall_risk);
  const euScore = system.eu_ai_act_class === 'Minimal' ? 95 : system.eu_ai_act_class === 'Limited' ? 80 : 60;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Registry</span>
        </button>

        <div className="rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl lg:text-[22px] font-['Sora'] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {system.system_name}
              </h1>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Reference: {system.reference_number}</p>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: riskColors.bg, color: riskColors.text, border: `1px solid ${riskColors.text}` }}
                >
                  {system.overall_risk} Risk
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                  {system.eu_ai_act_class}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                <span>Department: {system.department}</span>
                <span>Type: {system.ai_type}</span>
              </div>
            </div>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>

          {system.eu_ai_act_class === 'Unacceptable' && (
            <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '2px solid #DC2626' }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DC2626' }}>
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1" style={{ color: '#DC2626' }}>
                    PROHIBITED USE DETECTED — EU AI Act Art.5
                  </h3>
                  <p className="text-sm" style={{ color: '#DC2626' }}>
                    This system triggered EU AI Act Art.5 prohibited use screening. Continued operation may be unlawful. Immediate legal review required.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: 'NIST AI RMF', score: system.nist_overall_score },
              { name: 'EU AI Act', score: euScore },
              { name: 'ISO 42001', score: system.iso42001_overall_score },
              { name: 'UAE Alignment', score: system.uae_overall_score }
            ].map(item => (
              <div key={item.name} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>{item.name}</p>
                <p className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.score}%</p>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.score >= 75 ? '#059669' : item.score >= 50 ? '#D97706' : '#DC2626'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-lg font-['Sora'] font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Framework Radar Chart</h2>
          <div className="flex justify-center">
            <svg width="300" height="300" viewBox="0 0 300 300">
              <g transform="translate(150, 150)">
                {[0, 1, 2, 3].map(i => (
                  <circle key={i} r={25 * (i + 1)} fill="none" stroke="var(--border-color)" strokeWidth="1" />
                ))}
                {[0, 90, 180, 270].map(angle => (
                  <line
                    key={angle}
                    x1="0" y1="0"
                    x2={Math.cos((angle - 90) * Math.PI / 180) * 100}
                    y2={Math.sin((angle - 90) * Math.PI / 180) * 100}
                    stroke="var(--border-color)"
                    strokeWidth="1"
                  />
                ))}
                <polygon
                  points={[
                    [0, -system.nist_overall_score],
                    [system.iso42001_overall_score, 0],
                    [0, system.uae_overall_score],
                    [-euScore, 0]
                  ].map(([x, y]) => `${x},${y}`).join(' ')}
                  fill="rgba(37, 99, 235, 0.2)"
                  stroke="#2563EB"
                  strokeWidth="2"
                />
                <polygon points="0,-80 80,0 0,80 -80,0" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4" />
                <text x="0" y="-110" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="600">NIST</text>
                <text x="110" y="5" textAnchor="start" fill="var(--text-primary)" fontSize="12" fontWeight="600">ISO</text>
                <text x="0" y="120" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="600">UAE</text>
                <text x="-110" y="5" textAnchor="end" fill="var(--text-primary)" fontSize="12" fontWeight="600">EU</text>
              </g>
            </svg>
          </div>
        </div>

        {system.gap_analysis && system.gap_analysis.length > 0 && (
          <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-['Sora'] font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Gap Analysis</h2>
            <div className="space-y-3">
              {system.gap_analysis.map((gap: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-start gap-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: gap.severity === 'Critical' ? '#DC2626' : '#D97706', color: 'white' }}
                    >
                      {gap.framework}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{gap.description}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Severity: {gap.severity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {system.recommendations && system.recommendations.length > 0 && (
          <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-lg font-['Sora'] font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Recommendations</h2>
            <div className="space-y-3">
              {system.recommendations.map((rec: any, idx: number) => (
                <div key={idx} className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-start gap-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: rec.priority === 'Critical' ? '#DC2626' : rec.priority === 'High' ? '#D97706' : '#2563EB',
                        color: 'white'
                      }}
                    >
                      {rec.priority}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{rec.title}</h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{rec.description}</p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>Frameworks: {Array.isArray(rec.frameworks) ? rec.frameworks.join(', ') : rec.frameworks}</span>
                        <span>Effort: {rec.effort}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
