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
  supplyChain: { component: string; type: string; provider: string; securityAssessed: string; modelCard: string; licenceReview: string; sla24h: string; auditRight: string; vulnScan: string }[];
  supplyChainScore: number;
  criticalFindings: { severity: string; title: string; description: string; reference: string; uclControl: string; action: string }[];
  recommendations: { priority: string; action: string; description: string; effort: string; owner: string; uclControl: string }[];
  lastAssessed: string;
}

interface Props {
  system: AISystem;
  onBack: () => void;
  onRunAssessment: (system: AISystem) => void;
}

const riskColor = (r: string) => r === 'LOW' ? '#059669' : r === 'MEDIUM' ? '#D97706' : r === 'HIGH' ? '#DC2626' : '#7C0000';
const scoreColor = (s: number) => s >= 75 ? '#059669' : s >= 50 ? '#D97706' : '#DC2626';
const severityColor = (s: string) => s === 'LOW' ? '#059669' : s === 'MEDIUM' ? '#D97706' : s === 'HIGH' ? '#DC2626' : '#7C0000';

export default function AISecurityDetailView({ system, onBack, onRunAssessment }: Props) {
  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-primary, #F8F9FA)' }}>
      <button onClick={onBack} style={{ background: 'transparent', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', color: '#6B7280', cursor: 'pointer', marginBottom: '20px' }}>
        ← Back to Registry
      </button>

      <div style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary, #0F172A)', margin: '0 0 8px' }}>{system.name}</h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
              <span><strong>Department:</strong> {system.department}</span>
              <span><strong>Type:</strong> {system.type}</span>
              <span><strong>Last Assessed:</strong> {system.lastAssessed}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '4px' }}>Security Score</div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: scoreColor(system.securityScore) }}>{system.securityScore}%</div>
              </div>
              <div style={{ marginLeft: '24px' }}>
                <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '4px' }}>Overall Risk</div>
                <span style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '20px', background: riskColor(system.overallRisk) + '20', color: riskColor(system.overallRisk), fontWeight: 600 }}>{system.overallRisk}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ background: 'transparent', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
              Download Report
            </button>
            <button onClick={() => onRunAssessment(system)} style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Run New Assessment
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary, #0F172A)', margin: '0 0 12px' }}>Security Scores</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Attack Surface', value: system.attackSurfaceLevel },
            { label: 'Training Data Score', value: system.trainingDataScore + '%' },
            { label: 'Model Security Score', value: system.modelSecurityScore + '%' },
            { label: 'Supply Chain Score', value: system.supplyChainScore + '%' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '8px' }}>{item.label}</div>
              {item.label === 'Attack Surface' ? (
                <div style={{ fontSize: '20px', fontWeight: 700, color: severityColor(item.value) }}>{item.value}</div>
              ) : (
                <>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: scoreColor(parseInt(item.value)), marginBottom: '8px' }}>{item.value}</div>
                  <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: item.value, background: scoreColor(parseInt(item.value)), borderRadius: '3px' }} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary, #0F172A)', margin: '0 0 12px' }}>Adversarial Threats</h2>
        <div style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                {['Attack Name', 'Reference', 'Likelihood', 'Impact', 'Risk Score', 'Notes'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {system.adversarialThreats.map((threat, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary, #0F172A)' }}>{threat.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6B7280' }}>{threat.reference}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary, #0F172A)' }}>{threat.likelihood}/4</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-primary, #0F172A)' }}>{threat.impact}/4</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: threat.riskScore >= 12 ? '#DC262620' : threat.riskScore >= 8 ? '#D9770620' : threat.riskScore >= 4 ? '#D9770620' : '#05966920', color: threat.riskScore >= 12 ? '#DC2626' : threat.riskScore >= 8 ? '#D97706' : threat.riskScore >= 4 ? '#D97706' : '#059669', fontWeight: 600 }}>{threat.riskScore}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6B7280' }}>{threat.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary, #0F172A)', margin: '0 0 12px' }}>Critical Findings</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {system.criticalFindings.map((finding, i) => (
            <div key={i} style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid #E5E7EB', borderLeft: `4px solid ${severityColor(finding.severity)}`, borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', background: severityColor(finding.severity) + '20', color: severityColor(finding.severity), fontWeight: 600, textTransform: 'uppercase' as const }}>{finding.severity}</span>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0F172A)', margin: 0, flex: 1 }}>{finding.title}</h3>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 12px', lineHeight: 1.5 }}>{finding.description}</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: '#F3F4F6', color: '#6B7280' }}>{finding.reference}</span>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: '#7C3AED20', color: '#7C3AED' }}>{finding.uclControl}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary, #0F172A)', background: '#F9FAFB', padding: '10px', borderRadius: '6px' }}>
                <strong>Recommended Action:</strong> {finding.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary, #0F172A)', margin: '0 0 12px' }}>Recommendations</h2>
        <div style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '20px' }}>
          {system.recommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', marginBottom: '16px', borderBottom: i < system.recommendations.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#9CA3AF', minWidth: '24px' }}>{i + 1}.</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', background: severityColor(rec.priority) + '20', color: severityColor(rec.priority), fontWeight: 600, textTransform: 'uppercase' as const }}>{rec.priority}</span>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0F172A)', margin: 0 }}>{rec.action}</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 10px', lineHeight: 1.5 }}>{rec.description}</p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                  <span><strong style={{ color: '#6B7280' }}>Effort:</strong> <span style={{ color: 'var(--text-primary, #0F172A)' }}>{rec.effort}</span></span>
                  <span><strong style={{ color: '#6B7280' }}>Owner:</strong> <span style={{ color: 'var(--text-primary, #0F172A)' }}>{rec.owner}</span></span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#7C3AED20', color: '#7C3AED' }}>{rec.uclControl}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
