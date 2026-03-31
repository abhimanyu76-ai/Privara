import { useState, useMemo } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { supabase, type DPIA } from '../lib/supabase';
import DPIAWizard from '../components/DPIAWizard';
import DPIADetailView from '../components/DPIADetailView';

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

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Complete':
    case 'Approved':
      return 'bg-[#059669]/10 text-[#059669]';
    case 'In Review':
    case 'In Progress':
      return 'bg-[#2563EB]/10 text-[#2563EB]';
    case 'Pending':
      return 'bg-[#D97706]/10 text-[#D97706]';
    case 'Draft':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function DPIAManager() {
  const [dpias, setDpias] = useState<DPIA[]>([
    {
      id: "dpia-001",
      reference_number: "DPIA-2026-001",
      assessment_name: "Employee Performance Monitoring System",
      department: "HR",
      processing_activity: "Systematic monitoring of employee productivity through computer usage tracking, application monitoring and keystroke logging",
      purpose_of_processing: "Monitor and evaluate employee productivity levels, identify underperformance, support performance review processes",
      data_controller_name: "Meridian Group Holdings LLC",
      legal_basis: "Legitimate Interest",
      legal_basis_gdpr: "Legitimate Interest",
      legal_basis_uae: "Legitimate Interest",
      high_risk_processing: true,
      calculated_risk_level: "HIGH",
      status: "In Review",
      created_at: "2026-03-12T09:00:00Z",
      updated_at: "2026-03-12T09:00:00Z",
      personal_data_types: ["Behavioural & Profiling Data", "Location & Movement Data"],
      number_of_subjects: "1000 to 10000",
      retention_period: "12 months from collection",
      third_party_sharing: true,
      third_party_names: "WorkTrack Analytics Ltd, SecureCloud ME",
      international_transfers: true,
      transfer_countries: "United Kingdom",
      overall_risk_score: "HIGH",
      risk_level: "High",
      controls_maturity_score: 83,
      dpo_contact_name: "Sarah Al Mansouri",
      dpo_contact_email: "dpo@meridiangroup.ae",
      business_owner_signoff: "Khalid Al Rashidi, VP Human Resources",
      dpia_approval_date: "2026-03-18",
      art35_triggers: ["Systematic and extensive profiling with automated decision-making", "Systematic monitoring"],
      residual_risk_level: "Medium — Additional controls required",
      data_sources: null,
      data_recipients: null,
      data_lifecycle: null,
      automated_decision_making: false,
      adm_description: null,
      profiling_activities: false,
      profiling_description: null,
      necessity_justification: null,
      proportionality_assessment: null,
      data_minimization_measures: null,
      rights_impact_assessment: null,
      security_measures: [],
      breach_procedures: null,
      dpo_consulted: false,
      dpo_advice: null,
      data_subjects_consulted: false,
      consultation_summary: null,
      risk_answers: [],
      mitigation_measures: [],
      approval_required: false,
      approved_by: null,
      approval_date: null,
      review_date: null,
      compliance_frameworks: [],
      created_by: null
    } as DPIA,
    {
      id: "dpia-002",
      reference_number: "DPIA-2026-002",
      assessment_name: "Customer Behavioural Analytics Platform",
      department: "Marketing",
      processing_activity: "Collection and analysis of customer browsing behaviour, purchase history and inferred preferences for targeted marketing",
      purpose_of_processing: "Personalise marketing communications and improve customer experience through targeted product recommendations",
      data_controller_name: "Meridian Group Holdings LLC",
      legal_basis: "Consent",
      legal_basis_gdpr: "Consent",
      legal_basis_uae: "Consent",
      high_risk_processing: true,
      calculated_risk_level: "MEDIUM",
      status: "Approved",
      created_at: "2026-03-08T10:30:00Z",
      updated_at: "2026-03-08T10:30:00Z",
      personal_data_types: ["Name & Contact Details", "Behavioural & Profiling Data", "Financial & Payment Data"],
      number_of_subjects: "10000 to 100000",
      retention_period: "24 months from last interaction",
      third_party_sharing: true,
      third_party_names: "Adobe Experience Cloud, Salesforce Inc",
      international_transfers: true,
      transfer_countries: "United States",
      overall_risk_score: "MEDIUM",
      risk_level: "Medium",
      controls_maturity_score: 79,
      dpo_contact_name: "Sarah Al Mansouri",
      dpo_contact_email: "dpo@meridiangroup.ae",
      business_owner_signoff: "Fatima Al Zaabi, Chief Marketing Officer",
      dpia_approval_date: "2026-03-15",
      art35_triggers: ["Large-scale processing of personal data", "Behavioural profiling"],
      residual_risk_level: "Acceptable — No further action",
      data_sources: null,
      data_recipients: null,
      data_lifecycle: null,
      automated_decision_making: false,
      adm_description: null,
      profiling_activities: false,
      profiling_description: null,
      necessity_justification: null,
      proportionality_assessment: null,
      data_minimization_measures: null,
      rights_impact_assessment: null,
      security_measures: [],
      breach_procedures: null,
      dpo_consulted: false,
      dpo_advice: null,
      data_subjects_consulted: false,
      consultation_summary: null,
      risk_answers: [],
      mitigation_measures: [],
      approval_required: false,
      approved_by: null,
      approval_date: null,
      review_date: null,
      compliance_frameworks: [],
      created_by: null
    } as DPIA,
    {
      id: "dpia-003",
      reference_number: "DPIA-2026-003",
      assessment_name: "Biometric Access Control System",
      department: "Facilities",
      processing_activity: "Fingerprint and facial recognition scanning for physical access control across all Meridian Group premises",
      purpose_of_processing: "Secure physical access to office premises and restricted areas, maintain audit trail of physical entry and exit",
      data_controller_name: "Meridian Group Holdings LLC",
      legal_basis: "Explicit Consent",
      legal_basis_gdpr: "Consent",
      legal_basis_uae: "Consent",
      high_risk_processing: true,
      calculated_risk_level: "HIGH",
      status: "Pending Approval",
      created_at: "2026-03-18T14:00:00Z",
      updated_at: "2026-03-18T14:00:00Z",
      personal_data_types: ["Biometric Data (special category)", "Name & Contact Details"],
      number_of_subjects: "1000 to 10000",
      retention_period: "Duration of employment plus 30 days",
      third_party_sharing: true,
      third_party_names: "SecureEntry Systems LLC",
      international_transfers: false,
      transfer_countries: "",
      overall_risk_score: "HIGH",
      risk_level: "High",
      controls_maturity_score: 88,
      dpo_contact_name: "Sarah Al Mansouri",
      dpo_contact_email: "dpo@meridiangroup.ae",
      business_owner_signoff: "Hassan Al Nuaimi, Head of Facilities",
      art35_triggers: ["Systematic monitoring", "Biometric data at scale", "New technologies"],
      residual_risk_level: "Medium — Additional controls required",
      data_sources: null,
      data_recipients: null,
      data_lifecycle: null,
      automated_decision_making: false,
      adm_description: null,
      profiling_activities: false,
      profiling_description: null,
      necessity_justification: null,
      proportionality_assessment: null,
      data_minimization_measures: null,
      rights_impact_assessment: null,
      security_measures: [],
      breach_procedures: null,
      dpo_consulted: false,
      dpo_advice: null,
      data_subjects_consulted: false,
      consultation_summary: null,
      risk_answers: [],
      mitigation_measures: [],
      approval_required: false,
      approved_by: null,
      approval_date: null,
      review_date: null,
      compliance_frameworks: [],
      created_by: null
    } as DPIA,
    {
      id: "dpia-004",
      reference_number: "DPIA-2026-004",
      assessment_name: "Vendor Data Sharing — Logistics Partner",
      department: "Procurement",
      processing_activity: "Transfer of supplier and logistics partner employee contact data and performance metrics to third-party logistics management platform",
      purpose_of_processing: "Manage logistics operations, track deliveries and evaluate vendor performance",
      data_controller_name: "Meridian Group Holdings LLC",
      legal_basis: "Contract",
      legal_basis_gdpr: "Contract",
      legal_basis_uae: "Contract",
      high_risk_processing: false,
      calculated_risk_level: "MEDIUM",
      status: "In Progress",
      created_at: "2026-03-15T11:20:00Z",
      updated_at: "2026-03-15T11:20:00Z",
      personal_data_types: ["Name & Contact Details", "Behavioural & Profiling Data"],
      number_of_subjects: "100 to 1000",
      retention_period: "Duration of contract plus 7 years",
      third_party_sharing: true,
      third_party_names: "LogiTrack MENA",
      international_transfers: true,
      transfer_countries: "Saudi Arabia",
      overall_risk_score: "MEDIUM",
      risk_level: "Medium",
      controls_maturity_score: 71,
      dpo_contact_name: "Sarah Al Mansouri",
      dpo_contact_email: "dpo@meridiangroup.ae",
      business_owner_signoff: "Reem Al Hashimi, Procurement Director",
      art35_triggers: [],
      residual_risk_level: "Low — Monitor",
      data_sources: null,
      data_recipients: null,
      data_lifecycle: null,
      automated_decision_making: false,
      adm_description: null,
      profiling_activities: false,
      profiling_description: null,
      necessity_justification: null,
      proportionality_assessment: null,
      data_minimization_measures: null,
      rights_impact_assessment: null,
      security_measures: [],
      breach_procedures: null,
      dpo_consulted: false,
      dpo_advice: null,
      data_subjects_consulted: false,
      consultation_summary: null,
      risk_answers: [],
      mitigation_measures: [],
      approval_required: false,
      approved_by: null,
      approval_date: null,
      review_date: null,
      compliance_frameworks: [],
      created_by: null
    } as DPIA,
    {
      id: "dpia-005",
      reference_number: "DPIA-2026-005",
      assessment_name: "Cloud Migration — Finance Data",
      department: "IT",
      processing_activity: "Migration of financial records, payroll data and accounts payable information from on-premise servers to Microsoft Azure UAE North region",
      purpose_of_processing: "Modernise IT infrastructure, improve disaster recovery capability while maintaining UAE data residency requirements",
      data_controller_name: "Meridian Group Holdings LLC",
      legal_basis: "Legal Obligation",
      legal_basis_gdpr: "Legal Obligation",
      legal_basis_uae: "Legal Obligation",
      high_risk_processing: false,
      calculated_risk_level: "LOW",
      status: "Complete",
      created_at: "2026-03-01T08:00:00Z",
      updated_at: "2026-03-01T08:00:00Z",
      personal_data_types: ["Financial & Payment Data", "Name & Contact Details"],
      number_of_subjects: "1000 to 10000",
      retention_period: "7 years per UAE Commercial Companies Law",
      third_party_sharing: true,
      third_party_names: "Microsoft Azure UAE North",
      international_transfers: false,
      transfer_countries: "",
      overall_risk_score: "LOW",
      risk_level: "Low",
      controls_maturity_score: 91,
      dpo_contact_name: "Sarah Al Mansouri",
      dpo_contact_email: "dpo@meridiangroup.ae",
      business_owner_signoff: "Mohammed Al Ketbi, Chief Financial Officer",
      dpia_approval_date: "2026-03-10",
      art35_triggers: [],
      residual_risk_level: "Acceptable — No further action",
      data_sources: null,
      data_recipients: null,
      data_lifecycle: null,
      automated_decision_making: false,
      adm_description: null,
      profiling_activities: false,
      profiling_description: null,
      necessity_justification: null,
      proportionality_assessment: null,
      data_minimization_measures: null,
      rights_impact_assessment: null,
      security_measures: [],
      breach_procedures: null,
      dpo_consulted: false,
      dpo_advice: null,
      data_subjects_consulted: false,
      consultation_summary: null,
      risk_answers: [],
      mitigation_measures: [],
      approval_required: false,
      approved_by: null,
      approval_date: null,
      review_date: null,
      compliance_frameworks: [],
      created_by: null
    } as DPIA,
    {
      id: "dpia-006",
      reference_number: "DPIA-2026-006",
      assessment_name: "AI-Powered Recruitment Screening",
      department: "HR",
      processing_activity: "Automated screening and scoring of job applications using AI algorithms analysing CVs, cover letters and psychometric assessments to shortlist candidates",
      purpose_of_processing: "Improve recruitment efficiency, reduce time-to-hire and ensure consistent evaluation criteria",
      data_controller_name: "Meridian Group Holdings LLC",
      legal_basis: "Legitimate Interest",
      legal_basis_gdpr: "Legitimate Interest",
      legal_basis_uae: "Legitimate Interest",
      high_risk_processing: true,
      calculated_risk_level: "HIGH",
      status: "In Review",
      created_at: "2026-03-20T15:30:00Z",
      updated_at: "2026-03-20T15:30:00Z",
      personal_data_types: ["Name & Contact Details", "Behavioural & Profiling Data", "Special Category — inferred from psychometric data"],
      number_of_subjects: "1000 to 10000",
      retention_period: "12 months from application date",
      third_party_sharing: true,
      third_party_names: "TalentSift AI",
      international_transfers: true,
      transfer_countries: "United Kingdom",
      overall_risk_score: "HIGH",
      risk_level: "High",
      controls_maturity_score: 62,
      dpo_contact_name: "Sarah Al Mansouri",
      dpo_contact_email: "dpo@meridiangroup.ae",
      business_owner_signoff: "Layla Al Suwaidi, HR Director",
      art35_triggers: ["Systematic and extensive profiling", "Automated decision-making with significant effect", "New technologies"],
      residual_risk_level: "High — DPA consultation may be required",
      data_sources: null,
      data_recipients: null,
      data_lifecycle: null,
      automated_decision_making: false,
      adm_description: null,
      profiling_activities: false,
      profiling_description: null,
      necessity_justification: null,
      proportionality_assessment: null,
      data_minimization_measures: null,
      rights_impact_assessment: null,
      security_measures: [],
      breach_procedures: null,
      dpo_consulted: false,
      dpo_advice: null,
      data_subjects_consulted: false,
      consultation_summary: null,
      risk_answers: [],
      mitigation_measures: [],
      approval_required: false,
      approved_by: null,
      approval_date: null,
      review_date: null,
      compliance_frameworks: [],
      created_by: null
    } as DPIA
  ]);
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedDPIA, setSelectedDPIA] = useState<DPIA | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadDPIAs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dpias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDpias(data || []);
    } catch (error) {
      console.error('Error loading DPIAs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDPIA = async (data: any) => {
    try {
      const { error } = await supabase.from('dpias').insert({
        reference_number: data.reference_number,
        assessment_name: data.assessment_name,
        department: data.department,
        processing_activity: data.processing_activity,
        purpose_of_processing: data.purpose_of_processing,
        personal_data_types: data.personal_data_types,
        number_of_subjects: data.number_of_subjects,
        retention_period: data.retention_period,
        third_party_sharing: data.third_party_sharing,

        legal_basis_gdpr: data.legal_basis_gdpr || null,
        legal_basis_uae: data.legal_basis_uae || null,
        high_risk_processing: data.high_risk_processing || false,
        lia_required: data.lia_required || false,

        legitimate_interest_pursued: data.legitimate_interest_pursued || null,
        necessity_test_passed: data.necessity_test_passed,
        necessity_alternative_explanation: data.necessity_alternative_explanation || null,
        balancing_data_sensitivity: data.balancing_data_sensitivity || null,
        balancing_expectations: data.balancing_expectations || null,
        balancing_impact: data.balancing_impact || null,
        balancing_opt_out_available: data.balancing_opt_out_available || false,
        balancing_opt_out_mechanism: data.balancing_opt_out_mechanism || null,
        balancing_conclusion: data.balancing_conclusion || null,

        special_category_data: data.special_category_data || false,
        children_data: data.children_data || false,
        data_minimisation_compliant: data.data_minimisation_compliant || null,
        purpose_limitation_compliant: data.purpose_limitation_compliant || null,
        secondary_use_description: data.secondary_use_description || null,
        retention_legal_basis: data.retention_legal_basis || null,
        active_deletion_process: data.active_deletion_process || false,

        third_party_processors: data.third_party_processors || [],
        dpas_in_place: data.dpas_in_place || null,
        cross_border_transfers: data.cross_border_transfers || false,
        transfer_mechanism: data.transfer_mechanism || null,
        destination_countries: data.destination_countries || [],
        tia_conducted: data.tia_conducted || null,
        sub_processors_documented: data.sub_processors_documented || false,

        security_controls: data.security_controls || [],
        controls_maturity_score: data.controls_maturity_score || 0,

        dsr_assessment: data.dsr_assessment || [],
        dpo_contact_name: data.dpo_contact_name || null,
        dpo_contact_email: data.dpo_contact_email || null,
        privacy_notice_date: data.privacy_notice_date || null,

        art35_triggers: data.art35_triggers || [],
        dpo_consulted_step7: data.dpo_consulted_step7 || false,
        data_subjects_consulted_step7: data.data_subjects_consulted_step7 || null,
        residual_risk_level: data.residual_risk_level || null,
        dpo_signoff_name: data.dpo_signoff_name || null,
        business_owner_signoff: data.business_owner_signoff || null,
        dpia_approval_date: data.dpia_approval_date || null,
        overall_risk_score: data.overall_risk_score || null,
        risk_calculation_details: data.risk_calculation_details || {},

        status: 'Pending DPO Approval'
      });

      if (error) throw error;

      await loadDPIAs();
      setShowWizard(false);
    } catch (error) {
      console.error('Error submitting DPIA:', error);
      alert('Error submitting DPIA. Please try again.');
    }
  };

  const filteredDpias = useMemo(() => {
    return dpias.filter(dpia => {
      const matchesSearch = dpia.assessment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dpia.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dpia.processing_activity.toLowerCase().includes(searchTerm.toLowerCase());
      const riskLevel = (dpia as any).overall_risk_score || (dpia as any).calculated_risk_level;
      const matchesRisk = riskFilter === 'all' || riskLevel === riskFilter;
      const matchesStatus = statusFilter === 'all' || dpia.status === statusFilter;
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [dpias, searchTerm, riskFilter, statusFilter]);

  const stats = {
    total: dpias.length,
    highRisk: dpias.filter(d => d.calculated_risk_level === 'HIGH' || d.calculated_risk_level === 'High').length,
    awaiting: dpias.filter(d => d.status === 'Pending').length,
    completed: dpias.filter(d => d.status === 'Complete').length,
    pending: dpias.filter(d => d.status === 'Pending').length,
    inProgress: dpias.filter(d => d.status === 'In Progress' || d.status === 'In Review').length,
    approved: dpias.filter(d => d.status === 'Approved').length,
    complete: dpias.filter(d => d.status === 'Complete').length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (selectedDPIA) {
    return (
      <DPIADetailView
        dpia={selectedDPIA}
        onClose={() => setSelectedDPIA(null)}
        onEdit={() => {
          setSelectedDPIA(null);
        }}
      />
    );
  }

  return (
    <>
      <div className="space-y-6 page-enter">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-display font-bold" style={{ color: 'var(--text-primary)' }}>DPIA Manager</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Data Protection Impact Assessments
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-150 text-[14px] font-medium whitespace-nowrap text-white"
            style={{ backgroundColor: '#D04A02' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B03D02';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D04A02';
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Start New DPIA
          </button>
        </div>

        <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#D9770610', border: '1px solid #D97706' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#D97706] mt-0.5" />
          <div>
            <div className="text-sm font-medium mb-1 text-[#D97706]">AI Security Alert: Model Inversion Risk Identified</div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Model inversion risk identified for AI-SYS-2026-002 (HR Recruitment Screening AI) and AI-SYS-2026-006 (Biometric Access Vision System). A DPIA review is recommended to assess personal data exposure.
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4 sm:p-5 lg:p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total DPIAs</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>High Risk</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#DC2626' }}>{stats.highRisk}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Awaiting Approval</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#D97706' }}>{stats.awaiting}</p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Completed</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#059669' }}>{stats.completed}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Status Distribution</p>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              {stats.pending > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(stats.pending / stats.total) * 100}%`,
                    backgroundColor: '#DC2626',
                  }}
                  title={`${stats.pending} Pending`}
                />
              )}
              {stats.inProgress > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(stats.inProgress / stats.total) * 100}%`,
                    backgroundColor: '#D97706',
                  }}
                  title={`${stats.inProgress} In Progress/Review`}
                />
              )}
              {stats.approved > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(stats.approved / stats.total) * 100}%`,
                    backgroundColor: '#2563EB',
                  }}
                  title={`${stats.approved} Approved`}
                />
              )}
              {stats.complete > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(stats.complete / stats.total) * 100}%`,
                    backgroundColor: '#059669',
                  }}
                  title={`${stats.complete} Complete`}
                />
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              {stats.pending > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC2626' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Pending ({stats.pending})</span>
                </div>
              )}
              {stats.inProgress > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D97706' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>In Progress ({stats.inProgress})</span>
                </div>
              )}
              {stats.approved > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2563EB' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Approved ({stats.approved})</span>
                </div>
              )}
              {stats.complete > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#059669' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Complete ({stats.complete})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[10px] overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="p-4 flex flex-col sm:flex-row gap-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search DPIAs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D04A02]/20 focus:border-[#D04A02] transition-all"
                style={{
                  border: '1px solid var(--input-border)',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D04A02]/20 focus:border-[#D04A02] transition-all"
              style={{
                border: '1px solid var(--input-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-secondary)',
              }}
            >
              <option value="all">All Risk Levels</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D04A02]/20 focus:border-[#D04A02] transition-all"
              style={{
                border: '1px solid var(--input-border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-secondary)',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="In Review">In Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center" style={{ color: 'var(--text-secondary)' }}>Loading DPIAs...</div>
            ) : filteredDpias.length === 0 ? (
              <div className="p-12 text-center" style={{ color: 'var(--text-secondary)' }}>
                {searchTerm || riskFilter !== 'all' || statusFilter !== 'all'
                  ? 'No DPIAs match your filters'
                  : 'No DPIAs yet. Start by creating your first DPIA assessment.'}
              </div>
            ) : (
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Assessment Name
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Processing Activity
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: '1px solid var(--border-color)' }}>
                  {filteredDpias.map((dpia) => (
                    <tr
                      key={dpia.id}
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
                        <div className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>{dpia.assessment_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{dpia.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{dpia.processing_activity}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${getRiskBadgeColor(
                            dpia.calculated_risk_level || 'Low'
                          )}`}
                        >
                          {dpia.calculated_risk_level || 'Not Assessed'}
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
                        <div className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{formatDate(dpia.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedDPIA(dpia)}
                          className="text-[14px] font-medium transition-colors"
                          style={{ color: '#D04A02' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#B03D02';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#D04A02';
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="lg:hidden">
            {loading ? (
              <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>Loading DPIAs...</div>
            ) : filteredDpias.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                {searchTerm || riskFilter !== 'all' || statusFilter !== 'all'
                  ? 'No DPIAs match your filters'
                  : 'No DPIAs yet. Start by creating your first DPIA assessment.'}
              </div>
            ) : (
              <div className="divide-y divide-border" style={{ contentVisibility: 'auto' }}>
                {filteredDpias.map((dpia) => (
                  <div key={dpia.id} className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{dpia.assessment_name}</div>
                        <div className="text-xs sm:text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{dpia.department}</div>
                        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{dpia.processing_activity}</div>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getRiskBadgeColor(
                          dpia.calculated_risk_level || 'Low'
                        )}`}
                      >
                        {dpia.calculated_risk_level || 'Not Assessed'}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusBadgeColor(
                          dpia.status
                        )}`}
                      >
                        {dpia.status}
                      </span>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(dpia.created_at)}</div>
                    </div>
                    <button
                      onClick={() => setSelectedDPIA(dpia)}
                      className="text-xs sm:text-sm font-medium transition-colors"
                      style={{ color: '#D04A02' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#B03D02';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#D04A02';
                      }}
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
        <DPIAWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            loadDPIAs();
          }}
        />
      )}
    </>
  );
}
