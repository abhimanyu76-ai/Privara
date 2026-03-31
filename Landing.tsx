import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ShieldLogo from '../components/ShieldLogo';
import PwCLogo from '../components/PwCLogo';

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const headlines = [
    "GDPR Article 35 compliance, automated.",
    "EU AI Act risk classification in minutes.",
    "UAE PDPL assessments, built for the GCC.",
    "NIST AI RMF scoring across your AI portfolio.",
    "72-hour breach notification, tracked in real time.",
    "ISO 42001 readiness, gap analysis included.",
    "Privacy by design, not by accident.",
    "AI governance for the modern enterprise.",
  ];

  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentHeadline = headlines[currentIndex];

    if (!isDeleting && charIndex < currentHeadline.length) {
      const timeout = setTimeout(() => {
        setCurrentText(currentHeadline.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 60);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && charIndex === currentHeadline.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => {
        setCurrentText(currentHeadline.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentIndex((currentIndex + 1) % headlines.length);
    }
  }, [charIndex, isDeleting, currentIndex, headlines]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  const handleDemoAccess = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div
        className="w-full lg:w-[60%] relative overflow-hidden py-10 px-6 sm:p-16 lg:flex lg:flex-col"
        style={{
          backgroundColor: '#0F172A',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      >
        <div className="relative z-10 flex flex-col justify-between w-full h-full">
          <div className="mb-8">
            <div className="flex items-center gap-2.5">
              <span style={{ fontSize: '22px', color: '#D04A02', fontWeight: 700, letterSpacing: '-0.5px' }}>PwC</span>
              <div style={{ width: '1px', height: '16px', backgroundColor: '#E5E7EB' }} />
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Middle East</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Cybersecurity and Digital Trust
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
            <div className="flex flex-col items-center text-center mb-12">
              <ShieldLogo className="w-12 h-12 mb-4" color="#D04A02" />
              <h1 className="text-[32px] font-['Sora'] font-bold text-white mb-2 tracking-tight">
                Privara
              </h1>
              <p className="text-[13px] text-[#94A3B8] tracking-[1px] uppercase mb-8">
                Privacy & AI Governance Suite
              </p>

              <div
                className="w-full max-w-md mx-auto mb-8"
                style={{
                  height: '2px',
                  background: 'rgba(255,255,255,0.1)',
                  width: '200px'
                }}
              />

              <div className="min-h-[32px] flex items-center justify-center mb-8">
                <span className="text-[18px] text-[#E2E8F0] font-['Sora'] font-normal">
                  {currentText}
                  <span className="cursor inline-block w-[2px] h-[22px] bg-[#D04A02] ml-[2px] animate-blink" />
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="px-[14px] py-[6px] rounded-[20px] border border-[rgba(255,255,255,0.15)]">
                  <span className="text-[11px] text-[#94A3B8]">4 Regulatory Frameworks</span>
                </div>
                <div className="px-[14px] py-[6px] rounded-[20px] border border-[rgba(255,255,255,0.15)]">
                  <span className="text-[11px] text-[#94A3B8]">UAE PDPL & GDPR Aligned</span>
                </div>
                <div className="px-[14px] py-[6px] rounded-[20px] border border-[rgba(255,255,255,0.15)]">
                  <span className="text-[11px] text-[#94A3B8]">AI Governance Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-[11px] text-[#475569]">
              © 2026 PwC Middle East. All rights reserved. Privara is a proprietary Digital Trust platform developed by PwC Middle East Digital Trust, Cyber & Privacy practice.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center p-6 sm:p-8 lg:p-8">
        <div className="w-full max-w-[340px]">
          <div className="mb-6">
            <h2 className="text-[26px] font-['Sora'] font-semibold text-[#0F172A] mb-[6px]">
              Welcome back
            </h2>
            <p className="text-[13px] text-[#6B7280] mb-1">Sign in to your Privara workspace</p>
            <p className="text-[12px] text-[#9CA3AF]">A PwC Middle East Cybersecurity and Digital Trust product</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-2">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@pwc.com"
                className="w-full h-[44px] px-[14px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D04A02]/20 focus:border-[#D04A02] transition-all text-[14px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-[44px] px-[14px] pr-12 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D04A02]/20 focus:border-[#D04A02] transition-all text-[14px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#374151] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-[44px] bg-[#D04A02] text-white rounded-lg hover:bg-[#B03D02] active:scale-[0.98] transition-all duration-150 text-[14px] font-semibold border-none"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#E5E7EB]" />
            <span className="text-[12px] text-[#9CA3AF]">or</span>
            <div className="flex-1 h-[1px] bg-[#E5E7EB]" />
          </div>

          <button
            onClick={handleDemoAccess}
            className="w-full h-[44px] mt-4 bg-transparent border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-all duration-150 text-[14px] font-medium"
          >
            Continue with Demo Access
          </button>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-[#9CA3AF]">
              Powered by PwC Digital Trust, Cyber & Privacy · Middle East
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}
