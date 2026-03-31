import { Save } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [orgName, setOrgName] = useState('Acme Corporation');
  const [adminEmail, setAdminEmail] = useState('admin@acmecorp.com');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoReportEnabled, setAutoReportEnabled] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter">
      <p className="text-xs sm:text-sm text-text-secondary">
        Manage your organisation and system configuration
      </p>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 lg:p-8">
        <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary mb-6">
          Organisation Details
        </h2>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
              Organisation Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-2.5 h-11 sm:h-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base"
              placeholder="Enter organisation name"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
              Admin Email Address
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-2.5 h-11 sm:h-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm sm:text-base"
              placeholder="admin@example.com"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-4 sm:p-6 lg:p-8">
        <h2 className="text-base sm:text-lg font-display font-semibold text-text-primary mb-6">
          API Configuration
        </h2>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px]"
              placeholder="Enter your API key"
            />
            <p className="text-xs text-text-secondary mt-2">
              API key for external integrations and automated assessments
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Webhook URL</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[14px]"
              placeholder="https://your-domain.com/webhook"
            />
            <p className="text-xs text-text-secondary mt-2">
              Receive real-time notifications for incidents and assessments
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8">
        <h2 className="text-lg font-display font-semibold text-text-primary mb-6">
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Email Notifications</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Receive email alerts for critical incidents
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationsEnabled ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-border">
            <div>
              <p className="text-sm font-medium text-text-primary">Automatic Reporting</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Generate weekly compliance reports automatically
              </p>
            </div>
            <button
              onClick={() => setAutoReportEnabled(!autoReportEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoReportEnabled ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoReportEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8">
        <h2 className="text-lg font-display font-semibold text-text-primary mb-6">
          Data Management
        </h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-4 border border-border rounded-xl hover:bg-gray-50 transition-colors">
            <p className="text-sm font-medium text-text-primary">Export All Data</p>
            <p className="text-xs text-text-secondary mt-1">
              Download a complete backup of your data
            </p>
          </button>
          <button className="w-full text-left px-4 py-4 border border-danger/30 rounded-xl hover:bg-danger/5 transition-colors">
            <p className="text-sm font-medium text-danger">Delete Organisation Data</p>
            <p className="text-xs text-danger/80 mt-1">
              Permanently remove all data associated with your organisation
            </p>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8">
        <h2 className="text-lg font-display font-semibold text-text-primary mb-6">
          Platform Information
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">Platform</span>
            <span className="text-sm font-medium text-text-primary">Privara — Privacy & AI Governance Suite</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-text-secondary">Developed by</span>
            <span className="text-sm font-medium text-text-primary">PwC Middle East, Cybersecurity and Digital Trust</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-text-secondary">Version</span>
            <span className="text-sm font-medium text-text-primary">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-text-secondary">Copyright</span>
            <span className="text-sm font-medium text-text-primary">© 2026 PwC Middle East. All rights reserved.</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-text-secondary">Website</span>
            <a
              href="https://www.pwc.com/m1/en.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline"
              style={{ color: '#D04A02' }}
            >
              pwc.com/m1/en
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 sm:px-6 py-2.5 h-11 sm:h-12 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-150 text-xs sm:text-sm font-medium">
          <Save className="w-4 h-4" strokeWidth={2.5} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
