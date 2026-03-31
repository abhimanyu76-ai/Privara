import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Shield, Info, Plus, Trash2 } from 'lucide-react';

type AISecurityAssessment = {
  id: string;
  reference_number: string;
  system_name: string;
  department: string;
  ai_type: string;
  security_score: number;
  top_threat: string;
  top_threat_severity: string;
  red_team_status: string;
  overall_risk: string;
  assessed_date: string;
  critical_findings: number;
  high_findings: number;
};

interface Props {
  onClose: () => void;
  existingAssessment: AISecurityAssessment | null;
  onSave: (assessment: AISecurityAssessment) => void;
}

type SupplyChainComponent = {
  name: string;
  type: string;
  provider: string;
  securityAssessment: boolean;
  modelCardReviewed: boolean;
  licenceReview: boolean;
  dataProvenance: boolean;
  slaIncident: boolean;
  auditClause: boolean;
  vulnerabilityScan: boolean;
};

export default function AISecurityWizard({ onClose, existingAssessment, onSave }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const [systemName, setSystemName] = useState(existingAssessment?.system_name || '');
  const [aiType, setAiType] = useState(existingAssessment?.ai_type || 'Predictive AI');
  const [department, setDepartment] = useState(existingAssessment?.department || '');
  const [deploymentEnv, setDeploymentEnv] = useState('Cloud-hosted SaaS');
  const [publicApi, setPublicApi] = useState('no');
  const [userInputs, setUserInputs] = useState('no');
  const [inputTypes, setInputTypes] = useState<string[]>([]);
  const [inputValidated, setInputValidated] = useState('');
  const [automaticOutputs, setAutomaticOutputs] = useState('no');
  const [trainingPipelineInternet, setTrainingPipelineInternet] = useState('no');
  const [userAccess, setUserAccess] = useState('Under 10');

  const [threatScores, setThreatScores] = useState({
    promptInjection: { likelihood: 2, impact: 2, notes: '' },
    jailbreaking: { likelihood: 2, impact: 2, notes: '' },
    modelInversion: { likelihood: 3, impact: 4, notes: '' },
    membershipInference: { likelihood: 2, impact: 3, notes: '' },
    dataPoisoning: { likelihood: 2, impact: 3, notes: '' },
    evasionAttacks: { likelihood: 3, impact: 4, notes: '' },
    modelTheft: { likelihood: 2, impact: 3, notes: '' },
    backdoorAttacks: { likelihood: 1, impact: 4, notes: '' },
  });

  const [trainingDataControls, setTrainingDataControls] = useState({
    provenance: { status: 'Yes', notes: '' },
    integrity: { status: 'Yes', notes: '' },
    accessRestricted: { status: 'Yes', notes: '' },
    pipelineProtected: { status: 'Partial', notes: '' },
    anomalyDetection: { status: 'No', notes: '' },
    sanitisation: { status: 'Yes', notes: '' },
    thirdPartyReview: { status: 'Partial', notes: '' },
    legalBasis: { status: 'Yes', notes: '' },
    retrainingProcesses: { status: 'Yes', notes: '' },
    backdoorTesting: { status: 'No', notes: '' },
  });

  const [modelSecurityControls, setModelSecurityControls] = useState({
    accessControls: { status: 'Yes', notes: '' },
    serialisation: { status: 'Yes', notes: '' },
    signing: { status: 'Yes', notes: '' },
    authentication: { status: 'Partial', notes: '' },
    rateLimiting: { status: 'No', notes: '' },
    inputValidation: { status: 'Partial', notes: '' },
    outputFiltering: { status: 'No', notes: '' },
    adversarialDetection: { status: 'No', notes: '' },
    versioning: { status: 'Yes', notes: '' },
    logging: { status: 'Yes', notes: '' },
    differentialPrivacy: { status: 'No', notes: '' },
    performanceMonitoring: { status: 'Yes', notes: '' },
  });

  const [genAIControls, setGenAIControls] = useState({
    promptProtection: { status: 'No', notes: '' },
    promptInjectionFiltering: { status: 'No', notes: '' },
    trainingDataClean: { status: 'Yes', notes: '' },
    contentFiltering: { status: 'Partial', notes: '' },
    piiDetection: { status: 'No', notes: '' },
    copyrightScreening: { status: 'No', notes: '' },
    hallucinationDetection: { status: 'No', notes: '' },
    agencyControls: { status: 'Yes', notes: '' },
    pluginAccess: { status: 'Yes', notes: '' },
    humanOversight: { status: 'Partial', notes: '' },
  });

  const [supplyChainComponents, setSupplyChainComponents] = useState<SupplyChainComponent[]>([
    {
      name: 'OpenAI GPT-4 API',
      type: 'Foundation Model',
      provider: 'OpenAI',
      securityAssessment: false,
      modelCardReviewed: true,
      licenceReview: true,
      dataProvenance: false,
      slaIncident: false,
      auditClause: false,
      vulnerabilityScan: true,
    }
  ]);

  const isGenAI = aiType === 'Generative AI' || aiType === 'NLP' || aiType === 'LLM';

  const attackSurfaceScore = useMemo(() => {
    let riskFactors = 0;
    if (publicApi === 'yes') riskFactors++;
    if (userInputs === 'yes' && (inputValidated === 'No' || inputValidated === 'Partial')) riskFactors++;
    if (automaticOutputs === 'yes') riskFactors++;
    if (trainingPipelineInternet === 'yes') riskFactors += 2;
    if (userAccess === 'Over 1000' || userAccess === 'Public-facing') riskFactors++;

    if (riskFactors >= 4) return 'CRITICAL';
    if (riskFactors >= 2) return 'HIGH';
    if (riskFactors >= 1) return 'MEDIUM';
    return 'LOW';
  }, [publicApi, userInputs, inputValidated, automaticOutputs, trainingPipelineInternet, userAccess]);

  const adversarialRiskScore = useMemo(() => {
    const scores = Object.values(threatScores).map(t => t.likelihood * t.impact);
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    return Math.round(avg * 10) / 10;
  }, [threatScores]);

  const trainingDataScore = useMemo(() => {
    const total = Object.keys(trainingDataControls).length;
    const yesCount = Object.values(trainingDataControls).filter(c => c.status === 'Yes').length;
    return Math.round((yesCount / total) * 100);
  }, [trainingDataControls]);

  const modelSecurityScore = useMemo(() => {
    const total = Object.keys(modelSecurityControls).length;
    const yesCount = Object.values(modelSecurityControls).filter(c => c.status === 'Yes').length;
    return Math.round((yesCount / total) * 100);
  }, [modelSecurityControls]);

  const genAIScore = useMemo(() => {
    if (!isGenAI) return null;
    const total = Object.keys(genAIControls).length;
    const yesCount = Object.values(genAIControls).filter(c => c.status === 'Yes').length;
    return Math.round((yesCount / total) * 100);
  }, [genAIControls, isGenAI]);

  const supplyChainScore = useMemo(() => {
    if (supplyChainComponents.length === 0) return 100;
    const totalQuestions = 7;
    let totalScore = 0;
    supplyChainComponents.forEach(comp => {
      const yesCount = [
        comp.securityAssessment,
        comp.modelCardReviewed,
        comp.licenceReview,
        comp.dataProvenance,
        comp.slaIncident,
        comp.auditClause,
        comp.vulnerabilityScan,
      ].filter(Boolean).length;
      totalScore += (yesCount / totalQuestions) * 100;
    });
    return Math.round(totalScore / supplyChainComponents.length);
  }, [supplyChainComponents]);

  const overallSecurityScore = useMemo(() => {
    const attackSurfaceNum = attackSurfaceScore === 'LOW' ? 90 : attackSurfaceScore === 'MEDIUM' ? 70 : attackSurfaceScore === 'HIGH' ? 50 : 30;
    const adversarialNum = Math.max(0, 100 - (adversarialRiskScore * 6));

    let weights = { attack: 0.15, adversarial: 0.25, training: 0.20, model: 0.20, genai: 0.10, supply: 0.10 };
    if (!isGenAI) {
      weights = { attack: 0.15, adversarial: 0.30, training: 0.20, model: 0.20, genai: 0, supply: 0.15 };
    }

    const score =
      attackSurfaceNum * weights.attack +
      adversarialNum * weights.adversarial +
      trainingDataScore * weights.training +
      modelSecurityScore * weights.model +
      (genAIScore || 0) * weights.genai +
      supplyChainScore * weights.supply;

    return Math.round(score);
  }, [attackSurfaceScore, adversarialRiskScore, trainingDataScore, modelSecurityScore, genAIScore, supplyChainScore, isGenAI]);

  const steps = [
    { num: 1, title: 'Attack Surface', enabled: true },
    { num: 2, title: 'Adversarial Threats', enabled: true },
    { num: 3, title: 'Training Data', enabled: true },
    { num: 4, title: 'Model Security', enabled: true },
    { num: 5, title: 'GenAI Controls', enabled: isGenAI },
    { num: 6, title: 'Supply Chain', enabled: true },
    { num: 7, title: 'Posture & Findings', enabled: true },
  ];

  const handleNext = () => {
    let nextStep = currentStep + 1;
    while (nextStep <= totalSteps && !steps[nextStep - 1].enabled) {
      nextStep++;
    }
    if (nextStep <= totalSteps) {
      setCurrentStep(nextStep);
    }
  };

  const handlePrevious = () => {
    let prevStep = currentStep - 1;
    while (prevStep >= 1 && !steps[prevStep - 1].enabled) {
      prevStep--;
    }
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
    }
  };

  const handleSave = () => {
    const topThreat = Object.entries(threatScores).reduce((max, [key, val]) =>
      (val.likelihood * val.impact) > (max.score) ? { name: key, score: val.likelihood * val.impact } : max,
      { name: '', score: 0 }
    );

    const threatNames: { [key: string]: string } = {
      promptInjection: 'Prompt Injection',
      jailbreaking: 'Jailbreaking',
      modelInversion: 'Model Inversion',
      membershipInference: 'Membership Inference',
      dataPoisoning: 'Data Poisoning',
      evasionAttacks: 'Evasion Attack',
      modelTheft: 'Model Theft',
      backdoorAttacks: 'Backdoor Attack',
    };

    let threatSeverity = 'Low';
    if (topThreat.score >= 13) threatSeverity = 'Critical';
    else if (topThreat.score >= 9) threatSeverity = 'High';
    else if (topThreat.score >= 5) threatSeverity = 'Medium';

    let overallRisk = 'LOW';
    if (overallSecurityScore < 40) overallRisk = 'CRITICAL';
    else if (overallSecurityScore < 60) overallRisk = 'HIGH';
    else if (overallSecurityScore < 80) overallRisk = 'MEDIUM';

    const criticalFindings = overallSecurityScore < 40 ? 2 : overallSecurityScore < 60 ? 1 : 0;
    const highFindings = overallSecurityScore < 60 ? 1 : 0;

    const assessment: AISecurityAssessment = {
      id: existingAssessment?.id || `ais-${Date.now()}`,
      reference_number: existingAssessment?.reference_number || `AIS-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      system_name: systemName,
      department: department,
      ai_type: aiType,
      security_score: overallSecurityScore,
      top_threat: threatNames[topThreat.name] || 'Unknown',
      top_threat_severity: threatSeverity,
      red_team_status: 'Not Started',
      overall_risk: overallRisk,
      assessed_date: new Date().toISOString().split('T')[0],
      critical_findings: criticalFindings,
      high_findings: highFindings,
    };

    onSave(assessment);
  };

  const attacks = [
    {
      key: 'promptInjection',
      name: 'Prompt Injection',
      ref: 'OWASP LLM01',
      desc: 'Attackers craft malicious inputs to hijack AI behaviour — overriding instructions, extracting system prompts or causing unintended actions. Critical for instruction-following models.',
    },
    {
      key: 'jailbreaking',
      name: 'Jailbreaking & Safety Bypass',
      ref: 'OWASP LLM01',
      desc: 'Techniques to bypass safety filters — roleplay scenarios, encoding tricks, token manipulation. Relevant for any model with safety guardrails.',
    },
    {
      key: 'modelInversion',
      name: 'Model Inversion',
      ref: 'MITRE ATLAS AML.T0024',
      desc: 'Adversary queries model repeatedly to reconstruct training data — potentially exposing personal data. Critical when personal data was used in training.',
    },
    {
      key: 'membershipInference',
      name: 'Membership Inference',
      ref: 'MITRE ATLAS AML.T0024',
      desc: 'Determines whether a specific individual\'s data was used in training — can confirm membership of sensitive datasets like medical or financial records.',
    },
    {
      key: 'dataPoisoning',
      name: 'Data Poisoning',
      ref: 'MITRE ATLAS AML.T0020',
      desc: 'Adversary corrupts training data to introduce backdoors or degrade performance. Critical for models retrained on user-provided or scraped data.',
    },
    {
      key: 'evasionAttacks',
      name: 'Evasion Attacks',
      ref: 'MITRE ATLAS AML.T0015',
      desc: 'Crafted inputs designed to fool the model — transactions that bypass fraud detection, images that fool classifiers. Critical for security-sensitive systems.',
    },
    {
      key: 'modelTheft',
      name: 'Model Theft & Extraction',
      ref: 'MITRE ATLAS AML.T0035',
      desc: 'Adversary reconstructs a functional copy of the model by systematic querying — stealing proprietary model IP.',
    },
    {
      key: 'backdoorAttacks',
      name: 'Backdoor Attacks',
      ref: 'MITRE ATLAS AML.T0018',
      desc: 'Hidden triggers embedded during training causing specific misclassification — model behaves normally except when a specific input pattern is present.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto rounded-xl" style={{ backgroundColor: 'var(--color-card-bg)' }}>
          <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-card-border)' }}>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                AI Security Assessment
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>

          <div className="p-6" style={{ borderBottom: '1px solid var(--color-card-border)' }}>
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.num} className="flex-1 flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                      !step.enabled ? 'opacity-30' : ''
                    }`}
                    style={{
                      backgroundColor: currentStep === step.num ? '#7C3AED' : currentStep > step.num ? '#059669' : 'var(--color-input-bg)',
                      color: currentStep >= step.num && step.enabled ? 'white' : 'var(--color-text-secondary)',
                      border: currentStep === step.num || !step.enabled ? 'none' : '1px solid var(--color-card-border)',
                    }}
                  >
                    {currentStep > step.num && step.enabled ? <CheckCircle className="w-4 h-4" /> : step.num}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-2" style={{ backgroundColor: currentStep > step.num && step.enabled ? '#059669' : 'var(--color-card-border)' }} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              {steps.map((step) => (
                <span key={step.num} className={`flex-1 text-center ${!step.enabled ? 'opacity-30' : ''}`}>{step.title}</span>
              ))}
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {currentStep === 1 && (
              <div>
                <div className="mb-4 p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED' }}>
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>Attack Surface Mapping</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>MITRE ATLAS · STRIDE</div>
                  </div>
                </div>

                {existingAssessment && (
                  <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#2563EB10', border: '1px solid #2563EB' }}>
                    <Info className="w-4 h-4 flex-shrink-0 text-[#2563EB] mt-0.5" />
                    <span className="text-xs text-[#2563EB]">Pre-populated from AI Governance registry — {existingAssessment.reference_number}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      System Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={systemName}
                      onChange={(e) => setSystemName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: 'var(--color-input-bg)',
                        border: '1px solid var(--color-input-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      AI System Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={aiType}
                      onChange={(e) => setAiType(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: 'var(--color-input-bg)',
                        border: '1px solid var(--color-input-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <option>Predictive AI</option>
                      <option>Automated Decision</option>
                      <option>Computer Vision</option>
                      <option>NLP</option>
                      <option>LLM</option>
                      <option>Generative AI</option>
                      <option>Recommender System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: 'var(--color-input-bg)',
                        border: '1px solid var(--color-input-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Deployment Environment
                    </label>
                    <select
                      value={deploymentEnv}
                      onChange={(e) => setDeploymentEnv(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: 'var(--color-input-bg)',
                        border: '1px solid var(--color-input-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <option>Cloud-hosted SaaS</option>
                      <option>On-premise</option>
                      <option>Hybrid</option>
                      <option>Edge deployment</option>
                      <option>API-only</option>
                      <option>Embedded in application</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Is the model API publicly accessible?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="publicApi"
                          value="yes"
                          checked={publicApi === 'yes'}
                          onChange={(e) => setPublicApi(e.target.value)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="publicApi"
                          value="no"
                          checked={publicApi === 'no'}
                          onChange={(e) => setPublicApi(e.target.value)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>No</span>
                      </label>
                    </div>
                    {publicApi === 'yes' && (
                      <div className="mt-2 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#D9770610', border: '1px solid #D97706' }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#D97706] mt-0.5" />
                        <span className="text-xs text-[#D97706]">Publicly accessible AI APIs have significantly higher attack surface</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Does the system accept user-provided inputs?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="userInputs"
                          value="yes"
                          checked={userInputs === 'yes'}
                          onChange={(e) => setUserInputs(e.target.value)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="userInputs"
                          value="no"
                          checked={userInputs === 'no'}
                          onChange={(e) => setUserInputs(e.target.value)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>No</span>
                      </label>
                    </div>

                    {userInputs === 'yes' && (
                      <div className="mt-3 space-y-3 pl-6">
                        <div>
                          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Input types accepted (select all that apply)
                          </label>
                          <div className="space-y-2">
                            {['Free text', 'File uploads', 'Images', 'Audio', 'Structured data', 'Code'].map(type => (
                              <label key={type} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={inputTypes.includes(type)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setInputTypes([...inputTypes, type]);
                                    } else {
                                      setInputTypes(inputTypes.filter(t => t !== type));
                                    }
                                  }}
                                  style={{ accentColor: '#7C3AED' }}
                                />
                                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            Is input validated and sanitised before reaching the model?
                          </label>
                          <div className="space-y-2">
                            {['Yes', 'No', 'Partial'].map(option => (
                              <label key={option} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="inputValidated"
                                  value={option}
                                  checked={inputValidated === option}
                                  onChange={(e) => setInputValidated(e.target.value)}
                                  style={{ accentColor: '#7C3AED' }}
                                />
                                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Does the system produce outputs acted upon automatically without human review?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="automaticOutputs"
                          value="yes"
                          checked={automaticOutputs === 'yes'}
                          onChange={(e) => setAutomaticOutputs(e.target.value)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="automaticOutputs"
                          value="no"
                          checked={automaticOutputs === 'no'}
                          onChange={(e) => setAutomaticOutputs(e.target.value)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Is the training pipeline accessible from the internet?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="trainingPipelineInternet"
                          value="yes"
                          checked={trainingPipelineInternet === 'yes'}
                          onChange={(e) => setTrainingPipelineInternet(e.target.value)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="trainingPipelineInternet"
                          value="no"
                          checked={trainingPipelineInternet === 'no'}
                          onChange={(e) => setTrainingPipelineInternet(e.target.value)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>No</span>
                      </label>
                    </div>
                    {trainingPipelineInternet === 'yes' && (
                      <div className="mt-2 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: '#DC262610', border: '1px solid #DC2626' }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#DC2626] mt-0.5" />
                        <span className="text-xs text-[#DC2626]">Internet-accessible training pipelines are critical attack surfaces</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Number of users with access to model outputs
                    </label>
                    <select
                      value={userAccess}
                      onChange={(e) => setUserAccess(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: 'var(--color-input-bg)',
                        border: '1px solid var(--color-input-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <option>Under 10</option>
                      <option>10-100</option>
                      <option>100-1000</option>
                      <option>Over 1000</option>
                      <option>Public-facing</option>
                    </select>
                  </div>

                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                    <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Attack Surface Exposure</div>
                    <div
                      className="inline-block px-3 py-1.5 rounded text-sm font-medium"
                      style={{
                        backgroundColor: attackSurfaceScore === 'CRITICAL' ? '#DC262610' : attackSurfaceScore === 'HIGH' ? '#F9731610' : attackSurfaceScore === 'MEDIUM' ? '#D9770610' : '#05966910',
                        color: attackSurfaceScore === 'CRITICAL' ? '#DC2626' : attackSurfaceScore === 'HIGH' ? '#F97316' : attackSurfaceScore === 'MEDIUM' ? '#D97706' : '#059669',
                      }}
                    >
                      {attackSurfaceScore}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="mb-4 p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED' }}>
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>Adversarial Threat Assessment</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>OWASP LLM Top 10 · MITRE ATLAS</div>
                  </div>
                </div>

                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  Rate likelihood and impact of each attack — 1 Negligible to 4 Critical
                </p>

                <div className="space-y-4">
                  {attacks.map((attack) => {
                    const score = (threatScores as any)[attack.key];
                    const riskScore = score.likelihood * score.impact;
                    let riskColor = '#059669';
                    let riskLabel = 'Low';
                    if (riskScore >= 13) { riskColor = '#DC2626'; riskLabel = 'Critical'; }
                    else if (riskScore >= 9) { riskColor = '#F97316'; riskLabel = 'High'; }
                    else if (riskScore >= 5) { riskColor = '#D97706'; riskLabel = 'Medium'; }

                    return (
                      <div key={attack.key} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{attack.name}</div>
                            <div className="text-xs mb-1 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{attack.ref}</div>
                            <div className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>{attack.desc}</div>
                          </div>
                          <div
                            className="px-2 py-1 rounded text-xs font-medium ml-2 whitespace-nowrap"
                            style={{ backgroundColor: `${riskColor}10`, color: riskColor }}
                          >
                            {riskLabel}: {riskScore}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                              Likelihood (1-4)
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="4"
                              value={score.likelihood}
                              onChange={(e) => setThreatScores({ ...threatScores, [attack.key]: { ...score, likelihood: Number(e.target.value) } })}
                              className="w-full"
                              style={{ accentColor: '#7C3AED' }}
                            />
                            <div className="text-center text-xs mt-1" style={{ color: 'var(--color-text-primary)' }}>{score.likelihood}</div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                              Impact (1-4)
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="4"
                              value={score.impact}
                              onChange={(e) => setThreatScores({ ...threatScores, [attack.key]: { ...score, impact: Number(e.target.value) } })}
                              className="w-full"
                              style={{ accentColor: '#7C3AED' }}
                            />
                            <div className="text-center text-xs mt-1" style={{ color: 'var(--color-text-primary)' }}>{score.impact}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Overall Adversarial Risk Score</div>
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold"
                    style={{
                      backgroundColor: adversarialRiskScore < 5 ? '#05966910' : adversarialRiskScore < 8 ? '#D9770610' : '#DC262610',
                      color: adversarialRiskScore < 5 ? '#059669' : adversarialRiskScore < 8 ? '#D97706' : '#DC2626',
                    }}
                  >
                    {adversarialRiskScore.toFixed(1)}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="mb-4 p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED' }}>
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>Training Data Security</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>NIST AI RMF Map · ISO 42001 Cl.8</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'provenance', label: 'Training data provenance fully documented' },
                    { key: 'integrity', label: 'Data integrity verification controls in place' },
                    { key: 'accessRestricted', label: 'Access to training datasets restricted to authorised personnel' },
                    { key: 'pipelineProtected', label: 'Training pipeline protected from external access' },
                    { key: 'anomalyDetection', label: 'Anomaly detection in place for training data' },
                    { key: 'sanitisation', label: 'Data sanitisation applied before training' },
                    { key: 'thirdPartyReview', label: 'Third party or scraped data reviewed for poisoning risk' },
                    { key: 'legalBasis', label: 'Training data legal basis documented — link to DPIA if personal data' },
                    { key: 'retrainingProcesses', label: 'Model retraining triggers and processes documented' },
                    { key: 'backdoorTesting', label: 'Backdoor detection testing conducted' },
                  ].map((item) => (
                    <div key={item.key} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                      <div className="text-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.label}</div>
                      <div className="flex items-center gap-4">
                        {['Yes', 'No', 'Partial'].map(option => (
                          <label key={option} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`training-${item.key}`}
                              value={option}
                              checked={(trainingDataControls as any)[item.key].status === option}
                              onChange={(e) => setTrainingDataControls({
                                ...trainingDataControls,
                                [item.key]: { ...(trainingDataControls as any)[item.key], status: e.target.value }
                              })}
                              style={{ accentColor: '#7C3AED' }}
                            />
                            <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Training Data Security Score</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${trainingDataScore}%`,
                          backgroundColor: trainingDataScore >= 80 ? '#059669' : trainingDataScore >= 60 ? '#D97706' : '#DC2626'
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{trainingDataScore}%</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="mb-4 p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED' }}>
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>Model Security Controls</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>NIST AI RMF · ISO 42001 Cl.8</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'accessControls', label: 'Model files stored with access controls' },
                    { key: 'serialisation', label: 'Model serialisation security — safe formats used' },
                    { key: 'signing', label: 'Model signing and integrity verification' },
                    { key: 'authentication', label: 'Inference API requires authentication' },
                    { key: 'rateLimiting', label: 'Rate limiting on inference API' },
                    { key: 'inputValidation', label: 'Input validation before reaching model' },
                    { key: 'outputFiltering', label: 'Output filtering on responses' },
                    { key: 'adversarialDetection', label: 'Adversarial input detection capability' },
                    { key: 'versioning', label: 'Model versioning and rollback capability' },
                    { key: 'logging', label: 'Logging of all inference requests' },
                    { key: 'differentialPrivacy', label: 'Differential privacy applied where personal data involved' },
                    { key: 'performanceMonitoring', label: 'Model performance monitored for manipulation signs' },
                  ].map((item) => (
                    <div key={item.key} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                      <div className="text-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.label}</div>
                      <div className="flex items-center gap-4">
                        {['Yes', 'No', 'Partial'].map(option => (
                          <label key={option} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`model-${item.key}`}
                              value={option}
                              checked={(modelSecurityControls as any)[item.key].status === option}
                              onChange={(e) => setModelSecurityControls({
                                ...modelSecurityControls,
                                [item.key]: { ...(modelSecurityControls as any)[item.key], status: e.target.value }
                              })}
                              style={{ accentColor: '#7C3AED' }}
                            />
                            <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Model Security Score</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${modelSecurityScore}%`,
                          backgroundColor: modelSecurityScore >= 80 ? '#059669' : modelSecurityScore >= 60 ? '#D97706' : '#DC2626'
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{modelSecurityScore}%</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              isGenAI ? (
                <div>
                  <div className="mb-4 p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED' }}>
                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                    <div>
                      <div className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>Generative AI Security Controls</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>OWASP LLM Top 10</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'promptProtection', label: 'System prompt protected from extraction (LLM01)' },
                      { key: 'promptInjectionFiltering', label: 'Prompt injection detection and filtering (LLM01)' },
                      { key: 'trainingDataClean', label: 'Training data free of sensitive or copyright material (LLM02)' },
                      { key: 'contentFiltering', label: 'Output content filtering for harmful content (LLM04)' },
                      { key: 'piiDetection', label: 'PII detection in model outputs (LLM06)' },
                      { key: 'copyrightScreening', label: 'Copyright screening on generated content (LLM02)' },
                      { key: 'hallucinationDetection', label: 'Hallucination detection and grounding mechanisms (LLM09)' },
                      { key: 'agencyControls', label: 'Excessive agency controls — model cannot act beyond scope (LLM08)' },
                      { key: 'pluginAccess', label: 'Plugin and tool access limited to minimum required (LLM07)' },
                      { key: 'humanOversight', label: 'Human oversight before model outputs trigger consequential actions (LLM08)' },
                    ].map((item) => (
                      <div key={item.key} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                        <div className="text-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>{item.label}</div>
                        <div className="flex items-center gap-4">
                          {['Yes', 'No', 'Partial'].map(option => (
                            <label key={option} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`genai-${item.key}`}
                                value={option}
                                checked={(genAIControls as any)[item.key].status === option}
                                onChange={(e) => setGenAIControls({
                                  ...genAIControls,
                                  [item.key]: { ...(genAIControls as any)[item.key], status: e.target.value }
                                })}
                                style={{ accentColor: '#7C3AED' }}
                              />
                              <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                    <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>GenAI Security Score</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${genAIScore}%`,
                            backgroundColor: (genAIScore || 0) >= 80 ? '#059669' : (genAIScore || 0) >= 60 ? '#D97706' : '#DC2626'
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{genAIScore}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--color-text-tertiary)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      GenAI Security Controls step is not applicable for this system type.
                    </p>
                  </div>
                </div>
              )
            )}

            {currentStep === 6 && (
              <div>
                <div className="mb-4 p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED' }}>
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>AI Supply Chain Security</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>NIST AI RMF · EU AI Act Art.9</div>
                  </div>
                </div>

                <div className="mb-4">
                  <button
                    onClick={() => setSupplyChainComponents([...supplyChainComponents, {
                      name: '',
                      type: 'Foundation Model',
                      provider: '',
                      securityAssessment: false,
                      modelCardReviewed: false,
                      licenceReview: false,
                      dataProvenance: false,
                      slaIncident: false,
                      auditClause: false,
                      vulnerabilityScan: false,
                    }])}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: '#7C3AED', color: 'white' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Component
                  </button>
                </div>

                <div className="space-y-4">
                  {supplyChainComponents.map((component, index) => (
                    <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Component {index + 1}</div>
                        <button
                          onClick={() => setSupplyChainComponents(supplyChainComponents.filter((_, i) => i !== index))}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Component Name"
                          value={component.name}
                          onChange={(e) => {
                            const updated = [...supplyChainComponents];
                            updated[index].name = e.target.value;
                            setSupplyChainComponents(updated);
                          }}
                          className="px-3 py-2 rounded text-sm"
                          style={{
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-card-border)',
                            color: 'var(--color-text-primary)',
                          }}
                        />
                        <select
                          value={component.type}
                          onChange={(e) => {
                            const updated = [...supplyChainComponents];
                            updated[index].type = e.target.value;
                            setSupplyChainComponents(updated);
                          }}
                          className="px-3 py-2 rounded text-sm"
                          style={{
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-card-border)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          <option>Foundation Model</option>
                          <option>API</option>
                          <option>Library</option>
                          <option>Dataset</option>
                          <option>MLOps Tool</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Provider"
                          value={component.provider}
                          onChange={(e) => {
                            const updated = [...supplyChainComponents];
                            updated[index].provider = e.target.value;
                            setSupplyChainComponents(updated);
                          }}
                          className="px-3 py-2 rounded text-sm"
                          style={{
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-card-border)',
                            color: 'var(--color-text-primary)',
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        {[
                          { key: 'securityAssessment', label: 'Security assessment of provider conducted' },
                          { key: 'modelCardReviewed', label: 'Model card reviewed and documented' },
                          { key: 'licenceReview', label: 'Licence and copyright review completed' },
                          { key: 'dataProvenance', label: 'Data provenance of training data documented' },
                          { key: 'slaIncident', label: 'SLA includes security incident notification within 24 hours' },
                          { key: 'auditClause', label: 'Right to audit clause in contract' },
                          { key: 'vulnerabilityScan', label: 'Dependency vulnerability scan conducted' },
                        ].map((item) => (
                          <label key={item.key} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={(component as any)[item.key]}
                              onChange={(e) => {
                                const updated = [...supplyChainComponents];
                                (updated[index] as any)[item.key] = e.target.checked;
                                setSupplyChainComponents(updated);
                              }}
                              style={{ accentColor: '#7C3AED' }}
                            />
                            <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                  <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Supply Chain Security Score</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${supplyChainScore}%`,
                          backgroundColor: supplyChainScore >= 80 ? '#059669' : supplyChainScore >= 60 ? '#D97706' : '#DC2626'
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{supplyChainScore}%</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="mb-6 p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED' }}>
                  <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>AI Security Posture & Findings</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Assessment Summary</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Attack Surface</div>
                    <div className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{attackSurfaceScore}</div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Adversarial Risk</div>
                    <div className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{adversarialRiskScore.toFixed(1)}</div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Training Data</div>
                    <div className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{trainingDataScore}%</div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Model Security</div>
                    <div className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{modelSecurityScore}%</div>
                  </div>
                  {isGenAI && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                      <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>GenAI Security</div>
                      <div className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{genAIScore}%</div>
                    </div>
                  )}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Supply Chain</div>
                    <div className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{supplyChainScore}%</div>
                  </div>
                </div>

                <div className="mb-6 p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-card-border)' }}>
                  <div className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>Overall AI Security Posture Score</div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="var(--color-card-border)"
                          strokeWidth="12"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke={overallSecurityScore >= 80 ? '#059669' : overallSecurityScore >= 60 ? '#D97706' : overallSecurityScore >= 40 ? '#F97316' : '#DC2626'}
                          strokeWidth="12"
                          strokeDasharray={`${(overallSecurityScore / 100) * 439.8} 439.8`}
                          strokeLinecap="round"
                          transform="rotate(-90 80 80)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="text-4xl font-bold"
                          style={{
                            color: overallSecurityScore >= 80 ? '#059669' : overallSecurityScore >= 60 ? '#D97706' : overallSecurityScore >= 40 ? '#F97316' : '#DC2626'
                          }}
                        >
                          {overallSecurityScore}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {overallSecurityScore >= 80 ? 'Strong security posture' : overallSecurityScore >= 60 ? 'Moderate security posture — improvements recommended' : overallSecurityScore >= 40 ? 'Weak security posture — urgent action required' : 'Critical security posture — immediate remediation required'}
                  </div>
                </div>

                {overallSecurityScore < 60 && (
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Critical Findings</div>
                    <div className="space-y-3">
                      {overallSecurityScore < 40 && (
                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#DC262608', border: '1px solid #DC2626' }}>
                          <div className="flex items-start gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#DC2626] text-white">CRITICAL</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Critical Security Posture</div>
                              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Overall security score below 40% indicates multiple critical vulnerabilities. Immediate comprehensive security review required.</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {adversarialRiskScore > 8 && (
                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#DC262608', border: '1px solid #DC2626' }}>
                          <div className="flex items-start gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#DC2626] text-white">HIGH</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>High Adversarial Risk Score</div>
                              <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Multiple adversarial threats rated high likelihood and impact. Adversarial robustness testing required.</div>
                              <div className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>UCL-021 · MITRE ATLAS</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg" style={{ backgroundColor: '#7C3AED10', border: '1px solid #7C3AED' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                      <div>
                        <div className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>Red Team Exercise Recommended</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          A red team exercise is recommended to validate security controls and identify additional vulnerabilities.
                        </div>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all hover:opacity-90"
                      style={{ backgroundColor: '#7C3AED', color: 'white' }}
                    >
                      Plan Red Team
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-card-border)' }}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
              style={{
                backgroundColor: 'var(--color-input-bg)',
                border: '1px solid var(--color-card-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Step {currentStep} of {totalSteps}
            </div>
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#7C3AED' }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#7C3AED' }}
              >
                <CheckCircle className="w-4 h-4" />
                Save Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
