import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DPIAWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ThirdParty {
  name: string;
  role: string;
  dataShared: string;
  country: string;
  dpaInPlace: boolean;
}

interface DPIAFormData {
  assessmentName: string;
  department: string;
  description: string;
  legalBasisGDPR: string;
  legalBasisUAE: string;
  specificPurpose: string;
  isHighRisk: boolean | null;
  liPursuit: string;
  liNecessity: string;
  liAlternative: string;
  liNatureScore: number;
  liExpectationsScore: number;
  liImpactScore: number;
  liCanOptOut: boolean | null;
  liOptOutMechanism: string;
  liConclusion: string;
  dataCategories: string[];
  estimatedSubjects: string;
  dataMinimisation: string;
  purposeLimitation: string;
  secondaryUseDesc: string;
  retentionPeriod: string;
  retentionLegalBasis: string;
  activeDeletion: string;
  involvesChildren: boolean | null;
  sharesWithThirdParties: boolean | null;
  thirdParties: ThirdParty[];
  allDPAsSigned: string;
  transfersOutside: boolean | null;
  transferMechanism: string;
  destinationCountries: string[];
  transferImpactAssessment: string;
  subProcessorsUsed: boolean | null;
  subProcessorsDocumented: boolean | null;
  controls: {
    encryptionRest: { status: string; notes: string };
    encryptionTransit: { status: string; notes: string };
    e2eEncryption: { status: string; notes: string };
    pseudonymisation: { status: string; notes: string };
    rbac: { status: string; notes: string };
    mfa: { status: string; notes: string };
    auditLogging: { status: string; notes: string };
    pentesting: { status: string; notes: string };
    backupRecovery: { status: string; notes: string };
    staffTraining: { status: string; notes: string };
    incidentPlan: { status: string; notes: string };
    privacyByDesign: { status: string; notes: string };
  };
  rights: {
    access: string;
    rectification: string;
    erasure: string;
    restriction: string;
    portability: string;
    object: string;
    automatedDecisions: string;
  };
  dpoName: string;
  dpoEmail: string;
  privacyNoticeDate: string;
  art35Triggers: string[];
  dpoConsulted: boolean | null;
  dataSubjectsConsulted: string;
  residualRisk: string;
  dpoSignOff: string;
  businessOwnerSignOff: string;
  approvalDate: string;
}

const initialFormData: DPIAFormData = {
  assessmentName: '',
  department: '',
  description: '',
  legalBasisGDPR: '',
  legalBasisUAE: '',
  specificPurpose: '',
  isHighRisk: null,
  liPursuit: '',
  liNecessity: '',
  liAlternative: '',
  liNatureScore: 3,
  liExpectationsScore: 3,
  liImpactScore: 3,
  liCanOptOut: null,
  liOptOutMechanism: '',
  liConclusion: '',
  dataCategories: [],
  estimatedSubjects: '',
  dataMinimisation: '',
  purposeLimitation: '',
  secondaryUseDesc: '',
  retentionPeriod: '',
  retentionLegalBasis: '',
  activeDeletion: '',
  involvesChildren: null,
  sharesWithThirdParties: null,
  thirdParties: [],
  allDPAsSigned: '',
  transfersOutside: null,
  transferMechanism: '',
  destinationCountries: [],
  transferImpactAssessment: '',
  subProcessorsUsed: null,
  subProcessorsDocumented: null,
  controls: {
    encryptionRest: { status: '', notes: '' },
    encryptionTransit: { status: '', notes: '' },
    e2eEncryption: { status: '', notes: '' },
    pseudonymisation: { status: '', notes: '' },
    rbac: { status: '', notes: '' },
    mfa: { status: '', notes: '' },
    auditLogging: { status: '', notes: '' },
    pentesting: { status: '', notes: '' },
    backupRecovery: { status: '', notes: '' },
    staffTraining: { status: '', notes: '' },
    incidentPlan: { status: '', notes: '' },
    privacyByDesign: { status: '', notes: '' },
  },
  rights: {
    access: '',
    rectification: '',
    erasure: '',
    restriction: '',
    portability: '',
    object: '',
    automatedDecisions: '',
  },
  dpoName: '',
  dpoEmail: '',
  privacyNoticeDate: '',
  art35Triggers: [],
  dpoConsulted: null,
  dataSubjectsConsulted: '',
  residualRisk: '',
  dpoSignOff: '',
  businessOwnerSignOff: '',
  approvalDate: '',
};

const DPIAWizard: React.FC<DPIAWizardProps> = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DPIAFormData>(initialFormData);
  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dpiaReference, setDpiaReference] = useState('');
  const [finalRiskLevel, setFinalRiskLevel] = useState('');

  const steps = [
    { number: 1, label: 'Legal Basis', skip: false },
    { number: 2, label: 'Balancing Test', skip: formData.legalBasisGDPR !== 'Legitimate Interest' },
    { number: 3, label: 'Data Inventory', skip: false },
    { number: 4, label: 'Transfers & Third Parties', skip: false },
    { number: 5, label: 'Security Controls', skip: false },
    { number: 6, label: 'Data Subject Rights', skip: false },
    { number: 7, label: 'Art.35 & Risk Score', skip: false },
  ];

  const calculateLIAverage = () => {
    return ((formData.liNatureScore + formData.liExpectationsScore + formData.liImpactScore) / 3).toFixed(1);
  };

  const calculateControlsMaturity = () => {
    const controlsArray = Object.values(formData.controls);
    const yesCount = controlsArray.filter(c => c.status === 'Yes').length;
    return Math.round((yesCount / controlsArray.length) * 100);
  };

  const calculateRightsGaps = () => {
    return Object.values(formData.rights).filter(r => r === 'No').length;
  };

  const calculateFinalRisk = () => {
    let riskWeight = 0;

    const specialCategories = ['Health & Medical Data (special category)', 'Biometric Data (special category)', 'Criminal Records Data (special category)', 'Childrens Personal Data', 'Racial or Ethnic Origin (special category)', 'Political Opinions (special category)'];
    if (formData.dataCategories.some(cat => specialCategories.includes(cat))) {
      riskWeight += 20;
    }

    if (formData.estimatedSubjects === 'Over 100000' || formData.estimatedSubjects === '10000 to 100000') {
      riskWeight += 15;
    }

    const maturity = calculateControlsMaturity();
    if (maturity < 60) {
      riskWeight += 25;
    }

    const rightsGaps = calculateRightsGaps();
    if (rightsGaps >= 3) {
      riskWeight += 20;
    }

    if (formData.art35Triggers.length > 0) {
      riskWeight += 30;
    }

    if (formData.transfersOutside && formData.transferMechanism !== 'Adequacy Decision' && formData.transferMechanism !== 'Standard Contractual Clauses') {
      riskWeight += 15;
    }

    if (riskWeight >= 50) return 'HIGH';
    if (riskWeight >= 25) return 'MEDIUM';
    return 'LOW';
  };

  const handleNext = () => {
    const nextStep = steps.findIndex((s, i) => i > steps.findIndex(s => s.number === currentStep) && !s.skip);
    if (nextStep !== -1) {
      setCurrentStep(steps[nextStep].number);
    } else {
      const risk = calculateFinalRisk();
      setFinalRiskLevel(risk);
      setShowReview(true);
    }
  };

  const handlePrevious = () => {
    const prevSteps = steps.slice(0, steps.findIndex(s => s.number === currentStep)).reverse();
    const prevStep = prevSteps.find(s => !s.skip);
    if (prevStep) {
      setCurrentStep(prevStep.number);
    }
  };

  const handleSubmit = async () => {
    try {
      const reference = `DPIA-2026-${Math.floor(Math.random() * 900) + 100}`;

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('dpias').insert({
        user_id: user?.id || null,
        reference,
        name: formData.assessmentName,
        department: formData.department,
        risk_level: finalRiskLevel,
        status: 'Submitted for DPO Approval',
        completion_percentage: 100,
        data: formData,
      });

      if (error) throw error;

      setDpiaReference(reference);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting DPIA:', error);
    }
  };

  const handleSuccessClose = () => {
    onSuccess();
    onClose();
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">DPIA Successfully Submitted</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">DPIA Reference</div>
              <div className="text-2xl font-bold text-[#D04A02] dark:text-orange-500">{dpiaReference}</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Risk Level:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                finalRiskLevel === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                finalRiskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {finalRiskLevel}
              </span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Status: <span className="font-medium text-slate-900 dark:text-white">Submitted for DPO Approval</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Download PDF Summary
            </button>
            <button
              onClick={handleSuccessClose}
              className="px-6 py-3 bg-[#D04A02] hover:bg-[#B03D01] text-white rounded-lg transition-colors"
            >
              Return to DPIA Manager
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showReview) {
    const maturity = calculateControlsMaturity();
    const rightsGaps = calculateRightsGaps();

    return (
      <div className="fixed inset-0 bg-black/50 z-50 overflow-auto">
        <div className="min-h-screen p-4 md:p-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-5xl mx-auto">
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Review & Submit</h2>
                  <p className="text-slate-600 dark:text-slate-400">Review your DPIA assessment before submission</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className={`p-4 rounded-lg ${
                finalRiskLevel === 'HIGH' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                finalRiskLevel === 'MEDIUM' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' :
                'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    finalRiskLevel === 'HIGH' ? 'bg-red-600 text-white' :
                    finalRiskLevel === 'MEDIUM' ? 'bg-amber-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {finalRiskLevel} RISK
                  </span>
                </div>
                <p className={`text-sm ${
                  finalRiskLevel === 'HIGH' ? 'text-red-900 dark:text-red-200' :
                  finalRiskLevel === 'MEDIUM' ? 'text-amber-900 dark:text-amber-200' :
                  'text-green-900 dark:text-green-200'
                }`}>
                  {finalRiskLevel === 'HIGH' && 'Significant privacy risks identified. Processing should not commence without DPO approval, remediation of gaps, and possible DPA consultation.'}
                  {finalRiskLevel === 'MEDIUM' && 'Moderate privacy risks. Implement recommended controls and obtain DPO sign-off before processing commences.'}
                  {finalRiskLevel === 'LOW' && 'Privacy risks are proportionate and manageable. Standard monitoring and review applies.'}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <details className="bg-slate-50 dark:bg-slate-900 rounded-lg" open>
                <summary className="p-4 cursor-pointer font-medium text-slate-900 dark:text-white">Step 1: Processing Activity & Legal Basis</summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <div><span className="text-slate-600 dark:text-slate-400">Assessment Name:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.assessmentName}</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">Department:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.department}</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">Legal Basis (GDPR):</span> <span className="text-slate-900 dark:text-white font-medium">{formData.legalBasisGDPR}</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">High Risk:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.isHighRisk ? 'Yes' : 'No'}</span></div>
                </div>
              </details>

              {formData.legalBasisGDPR === 'Legitimate Interest' && (
                <details className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium text-slate-900 dark:text-white">Step 2: Balancing Test</summary>
                  <div className="px-4 pb-4 space-y-2 text-sm">
                    <div><span className="text-slate-600 dark:text-slate-400">Average Score:</span> <span className="text-slate-900 dark:text-white font-medium">{calculateLIAverage()}/5</span></div>
                    <div><span className="text-slate-600 dark:text-slate-400">Opt-out Available:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.liCanOptOut ? 'Yes' : 'No'}</span></div>
                  </div>
                </details>
              )}

              <details className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-slate-900 dark:text-white">Step 3: Data Inventory</summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <div><span className="text-slate-600 dark:text-slate-400">Data Categories:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.dataCategories.length} selected</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">Estimated Subjects:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.estimatedSubjects}</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">Retention Period:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.retentionPeriod}</span></div>
                </div>
              </details>

              <details className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-slate-900 dark:text-white">Step 4: Transfers & Third Parties</summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <div><span className="text-slate-600 dark:text-slate-400">Third Parties:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.sharesWithThirdParties ? formData.thirdParties.length : 'None'}</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">Cross-border Transfers:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.transfersOutside ? 'Yes' : 'No'}</span></div>
                </div>
              </details>

              <details className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-slate-900 dark:text-white">Step 5: Security Controls</summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <div><span className="text-slate-600 dark:text-slate-400">Maturity Score:</span> <span className={`font-medium ${maturity >= 80 ? 'text-green-600 dark:text-green-400' : maturity >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{maturity}%</span></div>
                </div>
              </details>

              <details className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-slate-900 dark:text-white">Step 6: Data Subject Rights</summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <div><span className="text-slate-600 dark:text-slate-400">Rights Gaps:</span> <span className={`font-medium ${rightsGaps >= 3 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{rightsGaps}</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">DPO:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.dpoName}</span></div>
                </div>
              </details>

              <details className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-slate-900 dark:text-white">Step 7: Art.35 & Risk Assessment</summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <div><span className="text-slate-600 dark:text-slate-400">Art.35 Triggers:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.art35Triggers.length}</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">DPO Consulted:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.dpoConsulted ? 'Yes' : 'No'}</span></div>
                  <div><span className="text-slate-600 dark:text-slate-400">Residual Risk:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.residualRisk}</span></div>
                </div>
              </details>
            </div>

            <div className="p-6 md:p-8 border-t border-slate-200 dark:border-slate-700 flex gap-3">
              <button
                onClick={() => setShowReview(false)}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Edit Answers
              </button>
              <button
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-[#D04A02] hover:bg-[#B03D01] text-white rounded-lg transition-colors font-medium"
              >
                Submit for DPO Approval
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
                  Data Protection Impact Assessment
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Step {currentStep} of 7 — Comprehensive privacy impact analysis
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full">
                <div
                  className="h-full bg-[#D04A02] transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step.skip ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-600' :
                      step.number < currentStep ? 'bg-[#D04A02] text-white' :
                      step.number === currentStep ? 'bg-white dark:bg-slate-800 border-2 border-[#D04A02] text-[#D04A02]' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {step.number < currentStep && !step.skip ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 text-center max-w-[100px] hidden md:block">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Processing Activity & Legal Basis</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                    GDPR Art.6 / UAE PDPL
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Assessment Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.assessmentName}
                    onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  >
                    <option value="">Select department</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Legal">Legal</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Customer Service">Customer Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description of processing activity
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe what personal data is being processed, by whom, and for what purpose"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Legal Basis under GDPR
                  </label>
                  <select
                    value={formData.legalBasisGDPR}
                    onChange={(e) => setFormData({ ...formData, legalBasisGDPR: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  >
                    <option value="">Select legal basis</option>
                    <option value="Consent">Consent — Data subject has given clear consent</option>
                    <option value="Legitimate Interest">Legitimate Interest — Necessary for legitimate interests (balancing test required)</option>
                    <option value="Legal Obligation">Legal Obligation — Required to comply with a legal obligation</option>
                    <option value="Contract">Contract — Necessary for performance of a contract</option>
                    <option value="Vital Interests">Vital Interests — Necessary to protect life</option>
                    <option value="Public Task">Public Task — Necessary for public interest</option>
                  </select>
                </div>

                {formData.legalBasisGDPR === 'Legitimate Interest' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      A Legitimate Interest Assessment is required — Step 2 will be activated
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Legal Basis under UAE PDPL
                  </label>
                  <select
                    value={formData.legalBasisUAE}
                    onChange={(e) => setFormData({ ...formData, legalBasisUAE: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  >
                    <option value="">Select legal basis</option>
                    <option value="Consent">Consent</option>
                    <option value="Legitimate Interest">Legitimate Interest</option>
                    <option value="Legal Obligation">Legal Obligation</option>
                    <option value="Contract">Contract</option>
                    <option value="Vital Interests">Vital Interests</option>
                    <option value="Public Task">Public Task</option>
                    <option value="National Security">National Security</option>
                    <option value="Public Health">Public Health</option>
                    <option value="Scientific Research">Scientific Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Specific purpose of processing <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.specificPurpose}
                    onChange={(e) => setFormData({ ...formData, specificPurpose: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Is this processing likely to result in HIGH RISK to individuals?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.isHighRisk === true}
                        onChange={() => setFormData({ ...formData, isHighRisk: true })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.isHighRisk === false}
                        onChange={() => setFormData({ ...formData, isHighRisk: false })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No</span>
                    </label>
                  </div>
                </div>

                {formData.isHighRisk && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900 dark:text-red-200">
                      A DPIA is mandatory under GDPR Art.35 and UAE PDPL for high-risk processing
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && formData.legalBasisGDPR === 'Legitimate Interest' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Legitimate Interest Balancing Test</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                    GDPR Art.6(1)(f) / Recital 47
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Identify the legitimate interest pursued
                  </label>
                  <textarea
                    value={formData.liPursuit}
                    onChange={(e) => setFormData({ ...formData, liPursuit: e.target.value })}
                    rows={3}
                    placeholder="Be specific — vague interests such as marketing are insufficient"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Necessity test
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        checked={formData.liNecessity === 'Yes'}
                        onChange={() => setFormData({ ...formData, liNecessity: 'Yes' })}
                        className="w-4 h-4 mt-1"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes — a less intrusive method exists, describe below</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        checked={formData.liNecessity === 'No'}
                        onChange={() => setFormData({ ...formData, liNecessity: 'No' })}
                        className="w-4 h-4 mt-1"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No — this is the least intrusive method</span>
                    </label>
                  </div>
                </div>

                {formData.liNecessity === 'Yes' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Describe the alternative considered and why it was rejected
                    </label>
                    <textarea
                      value={formData.liAlternative}
                      onChange={(e) => setFormData({ ...formData, liAlternative: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Balancing test — rate each 1 to 5</h4>

                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                      Nature of personal data — how sensitive is it? <span className="font-medium">{formData.liNatureScore}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.liNatureScore}
                      onChange={(e) => setFormData({ ...formData, liNatureScore: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                      Reasonable expectations — would data subjects expect this processing? <span className="font-medium">{formData.liExpectationsScore}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.liExpectationsScore}
                      onChange={(e) => setFormData({ ...formData, liExpectationsScore: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Expected</span>
                      <span>Unexpected</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                      Likely impact on individuals — what is the potential harm? <span className="font-medium">{formData.liImpactScore}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.liImpactScore}
                      onChange={(e) => setFormData({ ...formData, liImpactScore: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Minimal</span>
                      <span>Significant</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Average Score</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{calculateLIAverage()}/5</div>
                  </div>

                  {Number(calculateLIAverage()) > 3.5 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        High concern — legitimate interest may not override data subject rights
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Can data subjects opt out?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.liCanOptOut === true}
                        onChange={() => setFormData({ ...formData, liCanOptOut: true })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.liCanOptOut === false}
                        onChange={() => setFormData({ ...formData, liCanOptOut: false })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No</span>
                    </label>
                  </div>
                </div>

                {formData.liCanOptOut && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Opt-out mechanism
                    </label>
                    <input
                      type="text"
                      value={formData.liOptOutMechanism}
                      onChange={(e) => setFormData({ ...formData, liOptOutMechanism: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Balancing conclusion
                  </label>
                  <textarea
                    value={formData.liConclusion}
                    onChange={(e) => setFormData({ ...formData, liConclusion: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Data Inventory & Minimisation</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                    GDPR Art.5 / UAE PDPL Art.8
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Categories of personal data
                  </label>
                  <div className="space-y-2">
                    {[
                      'Name & Contact Details',
                      'Financial & Payment Data',
                      'Health & Medical Data (special category)',
                      'Biometric Data (special category)',
                      'Location & Movement Data',
                      'Behavioural & Profiling Data',
                      'Criminal Records Data (special category)',
                      'Childrens Personal Data',
                      'Racial or Ethnic Origin (special category)',
                      'Political Opinions (special category)',
                    ].map((category) => (
                      <label key={category} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={formData.dataCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, dataCategories: [...formData.dataCategories, category] });
                            } else {
                              setFormData({ ...formData, dataCategories: formData.dataCategories.filter(c => c !== category) });
                            }
                          }}
                          className="w-4 h-4 mt-1"
                        />
                        <span className="text-slate-700 dark:text-slate-300">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.dataCategories.some(cat => cat.includes('special category')) && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900 dark:text-red-200">
                      Special category data requires explicit consent or another Art.9 condition
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Estimated number of data subjects
                  </label>
                  <select
                    value={formData.estimatedSubjects}
                    onChange={(e) => setFormData({ ...formData, estimatedSubjects: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  >
                    <option value="">Select range</option>
                    <option value="Under 100">Under 100</option>
                    <option value="100 to 1000">100 to 1,000</option>
                    <option value="1000 to 10000">1,000 to 10,000</option>
                    <option value="10000 to 100000">10,000 to 100,000</option>
                    <option value="Over 100000">Over 100,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Data minimisation
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.dataMinimisation === 'Yes'}
                        onChange={() => setFormData({ ...formData, dataMinimisation: 'Yes' })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.dataMinimisation === 'No'}
                        onChange={() => setFormData({ ...formData, dataMinimisation: 'No' })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.dataMinimisation === 'Partially'}
                        onChange={() => setFormData({ ...formData, dataMinimisation: 'Partially' })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Partially</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Purpose limitation
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        checked={formData.purposeLimitation === 'Stated purpose only'}
                        onChange={() => setFormData({ ...formData, purposeLimitation: 'Stated purpose only' })}
                        className="w-4 h-4 mt-1"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Stated purpose only</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="radio"
                        checked={formData.purposeLimitation === 'Secondary use anticipated'}
                        onChange={() => setFormData({ ...formData, purposeLimitation: 'Secondary use anticipated' })}
                        className="w-4 h-4 mt-1"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Secondary use anticipated</span>
                    </label>
                  </div>
                </div>

                {formData.purposeLimitation === 'Secondary use anticipated' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description and legal basis for secondary use
                    </label>
                    <textarea
                      value={formData.secondaryUseDesc}
                      onChange={(e) => setFormData({ ...formData, secondaryUseDesc: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Retention period
                  </label>
                  <input
                    type="text"
                    value={formData.retentionPeriod}
                    onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value })}
                    placeholder="e.g. 7 years for financial records"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Legal basis for retention
                  </label>
                  <input
                    type="text"
                    value={formData.retentionLegalBasis}
                    onChange={(e) => setFormData({ ...formData, retentionLegalBasis: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Active deletion process in place
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.activeDeletion === 'Yes'}
                        onChange={() => setFormData({ ...formData, activeDeletion: 'Yes' })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.activeDeletion === 'No'}
                        onChange={() => setFormData({ ...formData, activeDeletion: 'No' })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.activeDeletion === 'In development'}
                        onChange={() => setFormData({ ...formData, activeDeletion: 'In development' })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">In development</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Does this involve children's data?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.involvesChildren === true}
                        onChange={() => setFormData({ ...formData, involvesChildren: true })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.involvesChildren === false}
                        onChange={() => setFormData({ ...formData, involvesChildren: false })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No</span>
                    </label>
                  </div>
                </div>

                {formData.involvesChildren && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      Children's data requires enhanced protection
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cross-Border Transfers & Third Parties</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                    GDPR Ch.V / UAE PDPL Art.26
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Is personal data shared with third party processors?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.sharesWithThirdParties === true}
                        onChange={() => setFormData({ ...formData, sharesWithThirdParties: true })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.sharesWithThirdParties === false}
                        onChange={() => setFormData({ ...formData, sharesWithThirdParties: false })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No</span>
                    </label>
                  </div>
                </div>

                {formData.sharesWithThirdParties && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Are DPAs signed with ALL processors?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.allDPAsSigned === 'Yes'}
                            onChange={() => setFormData({ ...formData, allDPAsSigned: 'Yes' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.allDPAsSigned === 'No'}
                            onChange={() => setFormData({ ...formData, allDPAsSigned: 'No' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">No</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.allDPAsSigned === 'In progress'}
                            onChange={() => setFormData({ ...formData, allDPAsSigned: 'In progress' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">In progress</span>
                        </label>
                      </div>
                    </div>

                    {(formData.allDPAsSigned === 'No' || formData.allDPAsSigned === 'In progress') && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-900 dark:text-red-200">
                          DPAs are mandatory under GDPR Art.28
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Is personal data transferred outside UAE or EEA?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.transfersOutside === true}
                        onChange={() => setFormData({ ...formData, transfersOutside: true })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.transfersOutside === false}
                        onChange={() => setFormData({ ...formData, transfersOutside: false })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No</span>
                    </label>
                  </div>
                </div>

                {formData.transfersOutside && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Transfer mechanism
                      </label>
                      <select
                        value={formData.transferMechanism}
                        onChange={(e) => setFormData({ ...formData, transferMechanism: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                      >
                        <option value="">Select mechanism</option>
                        <option value="Adequacy Decision">Adequacy Decision</option>
                        <option value="Standard Contractual Clauses">Standard Contractual Clauses</option>
                        <option value="Binding Corporate Rules">Binding Corporate Rules</option>
                        <option value="Explicit Consent">Explicit Consent</option>
                        <option value="UAE PDPL Art.26 Exemption">UAE PDPL Art.26 Exemption</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Transfer Impact Assessment conducted?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.transferImpactAssessment === 'Yes'}
                            onChange={() => setFormData({ ...formData, transferImpactAssessment: 'Yes' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.transferImpactAssessment === 'No'}
                            onChange={() => setFormData({ ...formData, transferImpactAssessment: 'No' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">No</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.transferImpactAssessment === 'Not Required'}
                            onChange={() => setFormData({ ...formData, transferImpactAssessment: 'Not Required' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Not Required</span>
                        </label>
                      </div>
                    </div>

                    {formData.transferMechanism !== 'Adequacy Decision' && formData.transferMechanism && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900 dark:text-amber-200">
                          SCCs or BCRs required with supplementary measures
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Sub-processors used?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.subProcessorsUsed === true}
                        onChange={() => setFormData({ ...formData, subProcessorsUsed: true })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.subProcessorsUsed === false}
                        onChange={() => setFormData({ ...formData, subProcessorsUsed: false })}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-300">No</span>
                    </label>
                  </div>
                </div>

                {formData.subProcessorsUsed && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Are they documented?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={formData.subProcessorsDocumented === true}
                          onChange={() => setFormData({ ...formData, subProcessorsDocumented: true })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={formData.subProcessorsDocumented === false}
                          onChange={() => setFormData({ ...formData, subProcessorsDocumented: false })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">No</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Technical & Organisational Measures</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                    GDPR Art.32 / ISO 27001
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-6">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Controls Maturity Score</div>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{calculateControlsMaturity()}%</div>
                    <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          calculateControlsMaturity() >= 80 ? 'bg-green-600' :
                          calculateControlsMaturity() >= 60 ? 'bg-amber-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${calculateControlsMaturity()}%` }}
                      />
                    </div>
                  </div>
                </div>

                {Object.entries({
                  encryptionRest: 'Encryption at rest',
                  encryptionTransit: 'Encryption in transit (TLS 1.2 minimum)',
                  e2eEncryption: 'End-to-end encryption where feasible',
                  pseudonymisation: 'Pseudonymisation applied',
                  rbac: 'Role-based access control (RBAC)',
                  mfa: 'Multi-factor authentication (MFA)',
                  auditLogging: 'Audit logging of all data access',
                  pentesting: 'Penetration testing conducted annually',
                  backupRecovery: 'Data backup and recovery tested',
                  staffTraining: 'Staff data protection training completed',
                  incidentPlan: 'Documented incident response plan',
                  privacyByDesign: 'Privacy by Design applied',
                }).map(([key, label]) => (
                  <div key={key} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="font-medium text-slate-900 dark:text-white mb-3">{label}</div>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={formData.controls[key as keyof typeof formData.controls].status === 'Yes'}
                          onChange={() => setFormData({
                            ...formData,
                            controls: {
                              ...formData.controls,
                              [key]: { ...formData.controls[key as keyof typeof formData.controls], status: 'Yes' }
                            }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={formData.controls[key as keyof typeof formData.controls].status === 'No'}
                          onChange={() => setFormData({
                            ...formData,
                            controls: {
                              ...formData.controls,
                              [key]: { ...formData.controls[key as keyof typeof formData.controls], status: 'No' }
                            }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">No</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={formData.controls[key as keyof typeof formData.controls].status === 'Partial'}
                          onChange={() => setFormData({
                            ...formData,
                            controls: {
                              ...formData.controls,
                              [key]: { ...formData.controls[key as keyof typeof formData.controls], status: 'Partial' }
                            }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Partial</span>
                      </label>
                    </div>
                    {(formData.controls[key as keyof typeof formData.controls].status === 'No' ||
                      formData.controls[key as keyof typeof formData.controls].status === 'Partial') && (
                      <textarea
                        value={formData.controls[key as keyof typeof formData.controls].notes}
                        onChange={(e) => setFormData({
                          ...formData,
                          controls: {
                            ...formData.controls,
                            [key]: { ...formData.controls[key as keyof typeof formData.controls], notes: e.target.value }
                          }
                        })}
                        placeholder="Notes"
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Data Subject Rights Impact</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                    GDPR Art.12-22 / UAE PDPL Art.12-19
                  </span>
                </div>

                {Object.entries({
                  access: { title: 'Right of Access (Art.15)', desc: 'Data subjects can request a copy of their data within 30 days UAE PDPL or 1 month GDPR' },
                  rectification: { title: 'Right to Rectification (Art.16)', desc: 'Inaccurate data can be corrected on request without undue delay' },
                  erasure: { title: 'Right to Erasure (Art.17)', desc: 'Data can be deleted on request including from processor systems and backups' },
                  restriction: { title: 'Right to Restriction (Art.18)', desc: 'Processing can be restricted while accuracy or lawfulness is disputed' },
                  portability: { title: 'Right to Data Portability (Art.20)', desc: 'Data provided in structured machine-readable format where processing based on consent or contract' },
                  object: { title: 'Right to Object (Art.21)', desc: 'Data subjects can object to processing based on legitimate interest or for direct marketing' },
                  automatedDecisions: { title: 'Rights re automated decision-making (Art.22)', desc: 'No solely automated decisions with significant effect without human review' },
                }).map(([key, { title, desc }]) => (
                  <div key={key} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">{title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">{desc}</div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={formData.rights[key as keyof typeof formData.rights] === 'Yes'}
                          onChange={() => setFormData({
                            ...formData,
                            rights: { ...formData.rights, [key]: 'Yes' }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={formData.rights[key as keyof typeof formData.rights] === 'No'}
                          onChange={() => setFormData({
                            ...formData,
                            rights: { ...formData.rights, [key]: 'No' }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">No</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={formData.rights[key as keyof typeof formData.rights] === 'Partial'}
                          onChange={() => setFormData({
                            ...formData,
                            rights: { ...formData.rights, [key]: 'Partial' }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Partial</span>
                      </label>
                    </div>
                  </div>
                ))}

                {calculateRightsGaps() >= 3 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900 dark:text-red-200">
                      Significant data subject rights gaps — remediation required before processing commences
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      DPO Name
                    </label>
                    <input
                      type="text"
                      value={formData.dpoName}
                      onChange={(e) => setFormData({ ...formData, dpoName: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      DPO Email
                    </label>
                    <input
                      type="email"
                      value={formData.dpoEmail}
                      onChange={(e) => setFormData({ ...formData, dpoEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date privacy notice provided
                  </label>
                  <input
                    type="date"
                    value={formData.privacyNoticeDate}
                    onChange={(e) => setFormData({ ...formData, privacyNoticeDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">GDPR Art.35 Necessity Check & Risk Score</h3>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                    GDPR Art.35 / WP29
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Section A — Art.35 Triggers</h4>
                  <div className="space-y-2">
                    {[
                      'Systematic and extensive profiling with automated decision-making',
                      'Large-scale processing of special category data',
                      'Systematic monitoring of publicly accessible areas',
                      'Automated decision-making with legal or similarly significant effect',
                      'Processing using new or innovative technologies',
                      'Large-scale processing of childrens personal data',
                      'Cross-border transfers at scale to non-adequate countries',
                    ].map((trigger) => (
                      <label key={trigger} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={formData.art35Triggers.includes(trigger)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, art35Triggers: [...formData.art35Triggers, trigger] });
                            } else {
                              setFormData({ ...formData, art35Triggers: formData.art35Triggers.filter(t => t !== trigger) });
                            }
                          }}
                          className="w-4 h-4 mt-1"
                        />
                        <span className="text-slate-700 dark:text-slate-300">{trigger}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.art35Triggers.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900 dark:text-red-200">
                      DPIA is mandatory under GDPR Art.35
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Section B — Consultation</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-700 dark:text-slate-300 mb-3">
                        DPO consulted and reviewed this DPIA?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.dpoConsulted === true}
                            onChange={() => setFormData({ ...formData, dpoConsulted: true })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.dpoConsulted === false}
                            onChange={() => setFormData({ ...formData, dpoConsulted: false })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">No</span>
                        </label>
                      </div>
                    </div>

                    {formData.dpoConsulted === false && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-900 dark:text-red-200">
                          DPO consultation required under GDPR Art.35(2)
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm text-slate-700 dark:text-slate-300 mb-3">
                        Data subjects or representatives consulted?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.dataSubjectsConsulted === 'Yes'}
                            onChange={() => setFormData({ ...formData, dataSubjectsConsulted: 'Yes' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.dataSubjectsConsulted === 'No'}
                            onChange={() => setFormData({ ...formData, dataSubjectsConsulted: 'No' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">No</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={formData.dataSubjectsConsulted === 'Not Feasible'}
                            onChange={() => setFormData({ ...formData, dataSubjectsConsulted: 'Not Feasible' })}
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Not Feasible</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Residual risk after controls
                      </label>
                      <select
                        value={formData.residualRisk}
                        onChange={(e) => setFormData({ ...formData, residualRisk: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                      >
                        <option value="">Select risk level</option>
                        <option value="Acceptable / Low — Monitor">Acceptable / Low — Monitor</option>
                        <option value="Medium — Additional controls required">Medium — Additional controls required</option>
                        <option value="High — DPA consultation required">High — DPA consultation required</option>
                      </select>
                    </div>

                    {formData.residualRisk === 'High — DPA consultation required' && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-900 dark:text-red-200">
                          Art.36 Prior Consultation required — submit to supervisory authority before processing commences
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      DPO sign-off name
                    </label>
                    <input
                      type="text"
                      value={formData.dpoSignOff}
                      onChange={(e) => setFormData({ ...formData, dpoSignOff: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Business Owner sign-off name
                    </label>
                    <input
                      type="text"
                      value={formData.businessOwnerSignOff}
                      onChange={(e) => setFormData({ ...formData, businessOwnerSignOff: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date of DPIA approval
                  </label>
                  <input
                    type="date"
                    value={formData.approvalDate}
                    onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base"
                  />
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
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#D04A02] hover:bg-[#B03D01] text-white rounded-lg transition-colors h-[44px]"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DPIAWizard;
