import { Upload, Send, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function PolicyAdvisor() {
  const [question, setQuestion] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 page-enter">
      <p className="text-xs sm:text-sm text-text-secondary">
        Upload policy documents and get instant AI-powered compliance guidance
      </p>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 lg:p-8">
        <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary mb-6">
          Upload Policy Document
        </h2>
        <div className="border-2 border-dashed border-border rounded-xl p-6 sm:p-8 lg:p-12 text-center hover:border-primary hover:bg-primary/5 transition-all">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" strokeWidth={2} />
            </div>
            <p className="text-base font-medium text-text-primary mb-2">
              Drop your policy document here or click to browse
            </p>
            <p className="text-sm text-text-secondary">Supports PDF, DOC, DOCX, TXT up to 10MB</p>
          </label>
        </div>
        {uploadedFile && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-success truncate">{uploadedFile}</p>
              <p className="text-xs text-success/80">Document uploaded successfully</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary">
            Ask AI Advisor
          </h2>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about GDPR compliance, data retention policies, cross-border transfers, or any other privacy concern..."
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm sm:text-base"
              rows={4}
            />
          </div>
          <button className="flex items-center gap-2 px-4 sm:px-5 py-2.5 h-11 sm:h-12 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-150 text-xs sm:text-sm font-medium">
            <Send className="w-4 h-4" strokeWidth={2.5} />
            Get AI Guidance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 lg:p-8">
        <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary mb-6">AI Response</h2>
        <div className="bg-surface rounded-xl p-4 sm:p-6 lg:p-8 min-h-[200px] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-200 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-text-secondary">
              Upload a document and ask a question to receive AI-powered compliance guidance
            </p>
          </div>
        </div>
      </div>

      <div className="bg-info/5 border border-info/20 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-info mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Example Questions
        </h3>
        <ul className="space-y-2 text-sm text-info/90">
          <li className="flex items-start gap-2">
            <span className="text-info mt-0.5">•</span>
            <span>What are the data retention requirements under GDPR Article 5?</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-info mt-0.5">•</span>
            <span>Does this policy comply with CCPA requirements for consumer rights?</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-info mt-0.5">•</span>
            <span>What additional clauses are needed for international data transfers?</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-info mt-0.5">•</span>
            <span>How should we handle data subject access requests according to this policy?</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
