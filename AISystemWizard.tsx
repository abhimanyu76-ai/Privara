import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AISystemWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  systemName: string;
  department: string;
  aiType: string;
  primaryPurpose: string;
  systemOwner: string;
  vendorType: string;
  vendorName: string;
  deploymentDate: string;
  affectsIndividuals: boolean;
  customerFacing: boolean;
  usesPersonalData: boolean;
  prohibitedPractices: boolean[];
  euAiActClass: string;
  highRiskRequirements: { status: string }[];
  nistScores: { scores: number[] }[];
  iso42001Scores: { scores: string[] }[];
  uaeEthicsScores: number[];
  uaeStrategy: boolean[];
  uaeTDRA: boolean[];
}

const initialFormData: FormData = {
  systemName: '',
  department: '',
  aiType: '',
  primaryPurpose: '',
  systemOwner: '',
  vendorType: 'In-house',
  vendorName: '',
  deploymentDate: '',
  affectsIndividuals: false,
  customerFacing: false,
  usesPersonalData: false,
  prohibitedPractices: [false, false, false, false, false, false, false, false],
  euAiActClass: '',
  highRiskRequirements: [
    { status: 'No' },
    { status: 'No' },
    { status: 'No' },
    { status: 'No' },
    { status: 'No' },
    { status: 'No' },
    { status: 'No' },
  ],
  nistScores: [
    { scores: [0, 0, 0, 0, 0] },
    { scores: [0, 0, 0, 0, 0] },
    { scores: [0, 0, 0, 0, 0] },
    { scores: [0, 0, 0, 0, 0] },
  ],
  iso42001Scores: [
    { scores: ['No', 'No', 'No'] },
    { scores: ['No', 'No', 'No'] },
    { scores: ['No', 'No'] },
    { scores: ['No', 'No', 'No', 'No'] },
    { scores: ['No', 'No', 'No'] },
    { scores: ['No', 'No'] },
  ],
  uaeEthicsScores: [1, 1, 1, 1, 1, 1],
  uaeStrategy: [false, false, false, false],
  uaeTDRA: [false, false, false],
};

const AISystemWizard: React.FC<AISystemWizardProps> = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [systemReference, setSystemReference] = useState('');
  const [finalScores, setFinalScores] = useState({
    nist: 0,
    euAiAct: 0,
    iso42001: 0,
    uae: 0,
  });

  const calculateNISTScore = () => {
    const functionScores = formData.nistScores.map(func => {
      const avg = func.scores.reduce((a, b) => a + b, 0) / func.scores.length;
      return (avg / 4) * 100;
    });
    return Math.round(functionScores.reduce((a, b) => a + b, 0) / functionScores.length);
  };

  const calculateISO42001Score = () => {
    let totalYes = 0;
    let totalItems = 0;
    formData.iso42001Scores.forEach(clause => {
      clause.scores.forEach(score => {
        if (score === 'Yes') totalYes++;
        if (score === 'Partial') totalYes += 0.5;
        totalItems++;
      });
    });
    return Math.round((totalYes / totalItems) * 100);
  };

  const calculateUAEScore = () => {
    const ethicsAvg = formData.uaeEthicsScores.reduce((sum, item) => sum + item, 0) / formData.uaeEthicsScores.length;
    const ethicsPercent = (ethicsAvg / 4) * 100;
    const strategyYes = formData.uaeStrategy.filter(Boolean).length;
    const strategyPercent = (strategyYes / formData.uaeStrategy.length) * 100;
    const tdraYes = formData.uaeTDRA.filter(Boolean).length;
    const tdraPercent = (tdraYes / formData.uaeTDRA.length) * 100;
    return Math.round((ethicsPercent * 0.5) + (strategyPercent * 0.25) + (tdraPercent * 0.25));
  };

  const calculateEUScore = () => {
    if (formData.euAiActClass === 'Minimal') return 95;
    if (formData.euAiActClass === 'Limited') return 80;
    if (formData.euAiActClass === 'High Risk') {
      const yesCount = formData.highRiskRequirements.filter(r => r.status === 'Yes').length;
      return Math.round((yesCount / formData.highRiskRequirements.length) * 100);
    }
    return 0;
  };

  const generateGaps = () => {
    const gaps: any[] = [];
    const nistScore = calculateNISTScore();
    const isoScore = calculateISO42001Score();
    const uaeScore = calculateUAEScore();

    const nistFunctions = ['GOVERN', 'MAP', 'MEASURE', 'MANAGE'];
    formData.nistScores.forEach((func, idx) => {
      const funcScore = (func.scores.reduce((a, b) => a + b, 0) / func.scores.length / 4) * 100;
      if (funcScore < 50) {
        gaps.push({
          framework: 'NIST',
          description: `${nistFunctions[idx]}: Score below 50%`,
          severity: 'Critical'
        });
      }
    });

    if (formData.euAiActClass === 'High Risk') {
      formData.highRiskRequirements.forEach((req, idx) => {
        if (req.status === 'No') {
          gaps.push({
            framework: 'EU AI Act',
            description: `Requirement ${idx + 1} not implemented — mandatory for High Risk AI systems`,
            severity: 'Critical'
          });
        }
      });
    }

    if (isoScore < 50) {
      gaps.push({
        framework: 'ISO 42001',
        description: 'Overall ISO 42001 compliance below 50%',
        severity: 'Major'
      });
    }

    if (uaeScore < 60) {
      gaps.push({
        framework: 'UAE',
        description: 'UAE alignment score below 60%',
        severity: 'Major'
      });
    }

    return gaps;
  };

  const generateRecommendations = () => {
    const gaps = generateGaps();
    const recs: any[] = [];

    if (gaps.some(g => g.framework === 'NIST' && g.description.includes('GOVERN'))) {
      recs.push({
        priority: 'Critical',
        title: 'Develop AI Governance Policy',
        frameworks: 'NIST Govern / ISO Clause 5',
        effort: 'Low'
      });
    }

    if (gaps.some(g => g.framework === 'NIST' && g.description.includes('MEASURE'))) {
      recs.push({
        priority: 'High',
        title: 'Conduct Bias & Fairness Testing',
        frameworks: 'NIST Measure / UAE Ethics',
        effort: 'Medium'
      });
    }

    if (gaps.some(g => g.framework === 'EU AI Act')) {
      recs.push({
        priority: 'High',
        title: 'Prepare EU AI Act Technical Documentation',
        frameworks: 'EU AI Act Art.11',
        effort: 'High'
      });
    }

    if (gaps.some(g => g.framework === 'NIST' && g.description.includes('MANAGE'))) {
      recs.push({
        priority: 'Medium',
        title: 'Implement AI Incident Response Plan',
        frameworks: 'NIST Manage',
        effort: 'Medium'
      });
    }

    if (recs.length === 0) {
      recs.push({
        priority: 'Low',
        title: 'Maintain Regular Reviews',
        frameworks: 'All Frameworks',
        effort: 'Low'
      });
    }

    return recs;
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      const scores = {
        nist: calculateNISTScore(),
        euAiAct: calculateEUScore(),
        iso42001: calculateISO42001Score(),
        uae: calculateUAEScore(),
      };
      setFinalScores(scores);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const reference = `AI-SYS-2026-${Math.floor(Math.random() * 900) + 100}`;
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('ai_systems').insert({
        user_id: user?.id || null,
        reference_number: reference,
        system_name: formData.systemName,
        department: formData.department,
        ai_type: formData.aiType,
        status: 'Active',
        eu_ai_act_class: formData.euAiActClass,
        nist_overall_score: finalScores.nist,
        iso42001_overall_score: finalScores.iso42001,
        uae_overall_score: finalScores.uae,
        data: formData,
      });

      if (error) throw error;

      setSystemReference(reference);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting AI system:', error);
    }
  };

  const handleSuccessClose = () => {
    onSuccess();
    onClose();
  };

  const hasProhibitedPractice = formData.prohibitedPractices.some(p => p);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Check className="w-12 h-12 text-[#2563EB]" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">AI System Registered Successfully</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">System Reference</div>
              <div className="text-2xl font-bold text-[#2563EB]">{systemReference}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                <div className="text-slate-600 dark:text-slate-400">NIST Score</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{finalScores.nist}%</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                <div className="text-slate-600 dark:text-slate-400">ISO 42001</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{finalScores.iso42001}%</div>
              </div>
            </div>
          </div>
          <button
            onClick={handleSuccessClose}
            className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-colors"
          >
            Return to AI Governance
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 6 && finalScores.nist > 0) {
    const gaps = generateGaps();
    const recommendations = generateRecommendations();

    return (
      <div className="fixed inset-0 bg-black/50 z-50 overflow-auto">
        <div className="min-h-screen p-4 md:p-8">
          <div className="bg-white dark:bg-slate-800 rounded-[10px] max-w-5xl mx-auto">
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Risk Score, Gap Analysis & Recommendations</h2>
                  <p className="text-slate-600 dark:text-slate-400">Comprehensive assessment results</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Section A — Framework Scores</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'NIST AI RMF', score: finalScores.nist },
                    { name: 'EU AI Act', score: finalScores.euAiAct },
                    { name: 'ISO 42001', score: finalScores.iso42001 },
                    { name: 'UAE Alignment', score: finalScores.uae },
                  ].map(item => (
                    <div key={item.name} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[10px] border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{item.name}</div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{
                            background: `conic-gradient(${item.score >= 75 ? '#059669' : item.score >= 50 ? '#D97706' : '#DC2626'} ${item.score * 3.6}deg, var(--bg-secondary, #E5E7EB) 0deg)`
                          }}
                        >
                          <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{Math.round(item.score)}%</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${item.score}%`,
                                backgroundColor: item.score >= 75 ? '#059669' : item.score >= 50 ? '#D97706' : '#DC2626'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Section B — Radar Chart</h3>
                <div className="flex justify-center">
                  <svg width="300" height="300" viewBox="0 0 300 300">
                    <g transform="translate(150, 150)">
                      {[0, 1, 2, 3].map(i => (
                        <circle
                          key={i}
                          r={25 * (i + 1)}
                          fill="none"
                          stroke="var(--border-color, #E5E7EB)"
                          strokeWidth="1"
                        />
                      ))}

                      {[0, 90, 180, 270].map(angle => (
                        <line
                          key={angle}
                          x1="0"
                          y1="0"
                          x2={Math.cos((angle - 90) * Math.PI / 180) * 100}
                          y2={Math.sin((angle - 90) * Math.PI / 180) * 100}
                          stroke="var(--border-color, #E5E7EB)"
                          strokeWidth="1"
                        />
                      ))}

                      <polygon
                        points={[
                          [0, -finalScores.nist],
                          [finalScores.euAiAct, 0],
                          [0, finalScores.iso42001],
                          [-finalScores.uae, 0]
                        ].map(([x, y]) => `${x},${y}`).join(' ')}
                        fill="rgba(37, 99, 235, 0.2)"
                        stroke="#2563EB"
                        strokeWidth="2"
                      />

                      <polygon
                        points="0,-80 80,0 0,80 -80,0"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="1"
                        strokeDasharray="4"
                      />

                      <text x="0" y="-110" textAnchor="middle" fill="var(--text-primary)" fontSize="12" className="text-slate-900 dark:text-white">NIST ({finalScores.nist}%)</text>
                      <text x="110" y="5" textAnchor="start" fill="var(--text-primary)" fontSize="12" className="text-slate-900 dark:text-white">EU ({finalScores.euAiAct}%)</text>
                      <text x="0" y="120" textAnchor="middle" fill="var(--text-primary)" fontSize="12" className="text-slate-900 dark:text-white">ISO ({finalScores.iso42001}%)</text>
                      <text x="-110" y="5" textAnchor="end" fill="var(--text-primary)" fontSize="12" className="text-slate-900 dark:text-white">UAE ({finalScores.uae}%)</text>
                    </g>
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Section C — Automated Gap Analysis</h3>
                {gaps.length === 0 ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                    <p className="text-sm text-green-900 dark:text-green-200">No significant gaps identified. System demonstrates good governance maturity.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gaps.map((gap, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            gap.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                          }`}>
                            {gap.framework}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 dark:text-white">{gap.description}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Severity: {gap.severity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Section D — Prioritised Recommendations</h3>
                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[10px] border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          rec.priority === 'Critical' ? 'bg-red-600 text-white' :
                          rec.priority === 'High' ? 'bg-amber-600 text-white' :
                          rec.priority === 'Medium' ? 'bg-blue-600 text-white' :
                          'bg-slate-600 text-white'
                        }`}>
                          {rec.priority}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{rec.title}</h4>
                          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                            <span>{rec.frameworks}</span>
                            <span>Effort: {rec.effort}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-slate-200 dark:border-slate-700 flex gap-3">
              <button
                onClick={() => setFinalScores({ nist: 0, euAiAct: 0, iso42001: 0, uae: 0 })}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Edit Answers
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-colors font-medium h-[44px]"
              >
                Register AI System
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-[10px] max-w-4xl mx-auto">
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[22px] font-semibold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  AI System Assessment
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Step {currentStep} of 6 — Multi-framework governance assessment
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                <div
                  className="h-full bg-[#2563EB] transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step < currentStep ? 'bg-[#2563EB] text-white' :
                      step === currentStep ? 'bg-white dark:bg-slate-800 border-2 border-[#2563EB] text-[#2563EB]' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {step < currentStep ? <Check className="w-5 h-5" /> : step}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center max-w-[100px] hidden md:block">
                      {['Profile', 'EU AI Act', 'NIST', 'ISO 42001', 'UAE', 'Results'][step - 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">System Profile</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    System Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.systemName}
                    onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    >
                      <option value="">Select</option>
                      {['HR', 'IT', 'Marketing', 'Legal', 'Finance', 'Operations', 'Procurement', 'Facilities', 'Customer Service'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AI System Type</label>
                    <select
                      value={formData.aiType}
                      onChange={(e) => setFormData({ ...formData, aiType: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    >
                      <option value="">Select</option>
                      {['Predictive AI', 'Decision Support', 'Automated Decision Making', 'Natural Language Processing', 'Computer Vision', 'Recommendation Engine', 'Generative AI', 'Robotic Process Automation', 'Other'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Purpose</label>
                  <textarea
                    value={formData.primaryPurpose}
                    onChange={(e) => setFormData({ ...formData, primaryPurpose: e.target.value })}
                    rows={3}
                    placeholder="Describe what this AI system does and its intended outcomes"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">System Owner</label>
                    <input
                      type="text"
                      value={formData.systemOwner}
                      onChange={(e) => setFormData({ ...formData, systemOwner: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date First Deployed</label>
                    <input
                      type="date"
                      value={formData.deploymentDate}
                      onChange={(e) => setFormData({ ...formData, deploymentDate: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Vendor</label>
                  <div className="flex gap-6 mb-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.vendorType === 'In-house'}
                        onChange={() => setFormData({ ...formData, vendorType: 'In-house', vendorName: '' })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">In-house developed</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.vendorType === 'Third-party'}
                        onChange={() => setFormData({ ...formData, vendorType: 'Third-party' })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Third-party vendor</span>
                    </label>
                  </div>
                  {formData.vendorType === 'Third-party' && (
                    <input
                      type="text"
                      value={formData.vendorName}
                      onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                      placeholder="Vendor name"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.affectsIndividuals}
                      onChange={(e) => setFormData({ ...formData, affectsIndividuals: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Does this system make decisions affecting individuals?</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.customerFacing}
                      onChange={(e) => setFormData({ ...formData, customerFacing: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Is this system customer-facing?</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.usesPersonalData}
                      onChange={(e) => setFormData({ ...formData, usesPersonalData: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Does this system use personal data?</span>
                  </label>

                  {formData.usesPersonalData && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        A DPIA may be required for this AI system — see DPIA Manager
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">EU AI Act Classification</h3>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold text-slate-900 dark:text-white">Section A: Prohibited AI Practices Screening (Art.5)</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    EU AI Act Art.5 prohibits certain AI practices entirely. Answer carefully.
                  </p>

                  <div className="space-y-4">
                    {[
                      'Does this system use subliminal techniques to manipulate behaviour without awareness?',
                      'Does it exploit vulnerabilities of specific groups to distort behaviour?',
                      'Is it a social scoring system used by public authorities?',
                      'Does it perform real-time remote biometric identification in public spaces?',
                      'Does it infer emotions in workplace or educational settings?',
                      'Does it create facial recognition databases through untargeted scraping?',
                      'Does it perform biometric categorisation to infer sensitive attributes?',
                      'Does it predict criminal offences based solely on profiling?',
                    ].map((q, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start justify-between">
                        <p className="text-sm text-slate-900 dark:text-white flex-1 pr-4">Q{idx + 1}: {q}</p>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={!formData.prohibitedPractices[idx]}
                              onChange={() => {
                                const updated = [...formData.prohibitedPractices];
                                updated[idx] = false;
                                setFormData({ ...formData, prohibitedPractices: updated });
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">No</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={formData.prohibitedPractices[idx]}
                              onChange={() => {
                                const updated = [...formData.prohibitedPractices];
                                updated[idx] = true;
                                setFormData({ ...formData, prohibitedPractices: updated });
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Yes</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasProhibitedPractice ? (
                    <div className="mt-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-600 dark:border-red-800 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-red-600 text-lg mb-2">PROHIBITED</p>
                          <p className="text-sm text-red-900 dark:text-red-200">
                            This AI system may constitute a prohibited AI practice under EU AI Act Art.5. Deployment may be unlawful. Immediate legal review required.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-green-900 dark:text-green-200 font-medium">
                        No prohibited practices identified. Proceeding to risk classification.
                      </p>
                    </div>
                  )}
                </div>

                {!hasProhibitedPractice && (
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Section B: Risk Classification</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { value: 'Unacceptable', color: '#DC2626', title: 'Unacceptable Risk', desc: 'Prohibited under EU AI Act', tag: 'Banned — Art.5' },
                        { value: 'High Risk', color: '#D97706', title: 'High Risk', desc: 'Requires conformity assessment, technical documentation, human oversight', tag: 'Annex III — Conformity Required' },
                        { value: 'Limited', color: '#F59E0B', title: 'Limited Risk', desc: 'Transparency obligations — users must know they interact with AI', tag: 'Art.50 — Transparency' },
                        { value: 'Minimal', color: '#059669', title: 'Minimal Risk', desc: 'No specific EU AI Act obligations', tag: 'No specific requirements' },
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setFormData({ ...formData, euAiActClass: option.value })}
                          className="text-left p-5 rounded-[10px] transition-all"
                          style={{
                            backgroundColor: formData.euAiActClass === option.value ? `${option.color}15` : 'var(--bg-secondary)',
                            border: `2px solid ${formData.euAiActClass === option.value ? option.color : 'var(--border-color)'}`,
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-semibold" style={{ color: option.color }}>{option.title}</h5>
                            {formData.euAiActClass === option.value && <Check className="w-5 h-5" style={{ color: option.color }} />}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{option.desc}</p>
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: option.color, color: 'white' }}>
                            {option.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.euAiActClass === 'High Risk' && (
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Section C: High Risk Requirements</h4>
                    <div className="space-y-3">
                      {[
                        'Technical documentation prepared (Art.11)',
                        'Logging and audit trail enabled (Art.12)',
                        'Transparency information provided (Art.13)',
                        'Human oversight measures implemented (Art.14)',
                        'Accuracy and robustness tested (Art.15)',
                        'Conformity assessment completed',
                        'Registered in EU AI Act database',
                      ].map((req, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                          <span className="text-sm text-slate-900 dark:text-white">{req}</span>
                          <div className="flex gap-2">
                            {['Yes', 'In Progress', 'No'].map(status => (
                              <label key={status} className="flex items-center gap-1.5">
                                <input
                                  type="radio"
                                  checked={formData.highRiskRequirements[idx].status === status}
                                  onChange={() => {
                                    const updated = [...formData.highRiskRequirements];
                                    updated[idx] = { status };
                                    setFormData({ ...formData, highRiskRequirements: updated });
                                  }}
                                  className="w-3.5 h-3.5"
                                />
                                <span className="text-xs text-slate-700 dark:text-slate-300">{status}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">NIST AI Risk Management Framework 1.0</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Score 0 to 4 using sliders (0=Not implemented, 4=Managed)</p>
                </div>

                {['GOVERN', 'MAP', 'MEASURE', 'MANAGE'].map((func, funcIdx) => {
                  const questions = [
                    ['AI governance policies and procedures are documented and approved', 'Roles and responsibilities for AI risk management are clearly defined', 'AI risk tolerance has been established and communicated', 'Training on AI ethics and risk is provided to relevant staff', 'AI governance is integrated into organisational governance structures'],
                    ['The AI system context and affected stakeholders are documented', 'AI risks have been identified and categorised', 'Potential negative impacts on individuals and society are assessed', 'Data quality, provenance and bias risks are documented', 'Third-party AI components and supply chain risks are mapped'],
                    ['Performance metrics and acceptance criteria are defined', 'Bias and fairness testing has been conducted', 'Explainability and interpretability requirements are met', 'Ongoing monitoring metrics are in place', 'Incident and anomaly detection mechanisms are active'],
                    ['AI risk response plans are documented', 'Escalation paths for AI incidents are defined', 'Processes exist to retrain, adjust or decommission the system', 'Stakeholder feedback mechanisms are in place', 'Post-incident review processes are defined'],
                  ][funcIdx];

                  const funcScore = (formData.nistScores[funcIdx].scores.reduce((a, b) => a + b, 0) / 5 / 4) * 100;

                  return (
                    <div key={func}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{func}</h4>
                        <span className="text-sm font-medium text-[#2563EB]">{Math.round(funcScore)}%</span>
                      </div>
                      <div className="space-y-4">
                        {questions.map((question, qIdx) => (
                          <div key={qIdx}>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{question}</p>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="0"
                                max="4"
                                value={formData.nistScores[funcIdx].scores[qIdx]}
                                onChange={(e) => {
                                  const updated = [...formData.nistScores];
                                  updated[funcIdx].scores[qIdx] = parseInt(e.target.value);
                                  setFormData({ ...formData, nistScores: updated });
                                }}
                                className="flex-1"
                              />
                              <span className="text-sm font-medium w-28 text-slate-900 dark:text-white">
                                {['Not implemented', 'Initial', 'Developing', 'Defined', 'Managed'][formData.nistScores[funcIdx].scores[qIdx]]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Overall NIST Score</p>
                  <div
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full"
                    style={{
                      background: `conic-gradient(${calculateNISTScore() >= 75 ? '#059669' : calculateNISTScore() >= 50 ? '#D97706' : '#DC2626'} ${calculateNISTScore() * 3.6}deg, var(--bg-secondary) 0deg)`
                    }}
                  >
                    <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">{calculateNISTScore()}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">ISO 42001:2023 AI Management System</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Assess readiness against the international standard</p>
                </div>

                {[
                  { number: 4, name: 'Context of Organisation', items: ['Internal and external issues relevant to AI are identified', 'Interested parties and requirements are documented', 'Scope of AI management system is defined'] },
                  { number: 5, name: 'Leadership', items: ['Top management demonstrates commitment to responsible AI', 'An AI policy has been established and communicated', 'Roles for AI management are assigned'] },
                  { number: 6, name: 'Planning', items: ['AI risks and opportunities are addressed in planning', 'AI objectives are established with measurable targets'] },
                  { number: 8, name: 'Operations', items: ['AI development follows documented processes', 'Data management controls are in place', 'AI system changes are managed and reviewed', 'Third-party AI providers are evaluated'] },
                  { number: 9, name: 'Performance Evaluation', items: ['AI performance is monitored and measured', 'Internal audits are conducted', 'Management reviews AI governance regularly'] },
                  { number: 10, name: 'Improvement', items: ['Nonconformities are identified and corrected', 'Continual improvement is pursued'] },
                ].map((clause, clauseIdx) => (
                  <div key={clause.number}>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Clause {clause.number}: {clause.name}</h4>
                    <div className="space-y-3">
                      {clause.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start justify-between">
                          <span className="text-sm text-slate-900 dark:text-white flex-1">{item}</span>
                          <div className="flex gap-2 ml-4">
                            {['Yes', 'Partial', 'No'].map(status => (
                              <label key={status} className="flex items-center gap-1.5">
                                <input
                                  type="radio"
                                  checked={formData.iso42001Scores[clauseIdx].scores[itemIdx] === status}
                                  onChange={() => {
                                    const updated = [...formData.iso42001Scores];
                                    updated[clauseIdx].scores[itemIdx] = status;
                                    setFormData({ ...formData, iso42001Scores: updated });
                                  }}
                                  className="w-3.5 h-3.5"
                                />
                                <span className="text-xs text-slate-700 dark:text-slate-300">{status}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Overall ISO 42001 Score</p>
                  <div
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full"
                    style={{
                      background: `conic-gradient(${calculateISO42001Score() >= 75 ? '#059669' : calculateISO42001Score() >= 50 ? '#D97706' : '#DC2626'} ${calculateISO42001Score() * 3.6}deg, var(--bg-secondary) 0deg)`
                    }}
                  >
                    <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">{calculateISO42001Score()}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">UAE AI Strategy & Ethical Guidelines</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Assess alignment with UAE National AI Strategy 2031</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Section A: UAE AI Ethics Principles</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Rate each principle from 1 (not met) to 4 (fully met)</p>
                  <div className="space-y-4">
                    {['Fairness', 'Transparency', 'Accountability', 'Privacy', 'Safety & Security', 'Human Oversight'].map((principle, idx) => (
                      <div key={principle}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{principle}</span>
                          <span className="text-sm text-[#2563EB]">{formData.uaeEthicsScores[idx]}/4</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={formData.uaeEthicsScores[idx]}
                          onChange={(e) => {
                            const updated = [...formData.uaeEthicsScores];
                            updated[idx] = parseInt(e.target.value);
                            setFormData({ ...formData, uaeEthicsScores: updated });
                          }}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Section B: UAE National AI Strategy 2031</h4>
                  <div className="space-y-3">
                    {[
                      'Does this AI system contribute to UAE strategic sectors?',
                      'Is the system developed with UAE data and context in mind?',
                      'Does it support Emiratisation or UAE talent development?',
                      'Is it aligned with UAE Government AI principles?',
                    ].map((q, idx) => (
                      <label key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <input
                          type="checkbox"
                          checked={formData.uaeStrategy[idx]}
                          onChange={(e) => {
                            const updated = [...formData.uaeStrategy];
                            updated[idx] = e.target.checked;
                            setFormData({ ...formData, uaeStrategy: updated });
                          }}
                          className="w-4 h-4 mt-0.5"
                        />
                        <span className="text-sm text-slate-900 dark:text-white">{q}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Section C: TDRA Guidelines</h4>
                  <div className="space-y-3">
                    {[
                      'Has the system been registered with relevant UAE regulatory authorities where required?',
                      'Are data localisation requirements met for UAE government or critical sector data?',
                      'Is there a documented AI incident reporting mechanism for UAE jurisdiction?',
                    ].map((q, idx) => (
                      <label key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <input
                          type="checkbox"
                          checked={formData.uaeTDRA[idx]}
                          onChange={(e) => {
                            const updated = [...formData.uaeTDRA];
                            updated[idx] = e.target.checked;
                            setFormData({ ...formData, uaeTDRA: updated });
                          }}
                          className="w-4 h-4 mt-0.5"
                        />
                        <span className="text-sm text-slate-900 dark:text-white">{q}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Overall UAE Alignment Score</p>
                  <div
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full"
                    style={{
                      background: `conic-gradient(${calculateUAEScore() >= 75 ? '#059669' : calculateUAEScore() >= 50 ? '#D97706' : '#DC2626'} ${calculateUAEScore() * 3.6}deg, var(--bg-secondary) 0deg)`
                    }}
                  >
                    <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">{calculateUAEScore()}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 border-t border-slate-200 dark:border-slate-700 flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors h-[44px]"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-colors h-[44px]"
            >
              {currentStep === 6 ? 'View Results' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISystemWizard;
