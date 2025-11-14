import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';

const HelpPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'getting-started' | 'troubleshooting' | 'api' | 'security'>('getting-started');

  const categories = {
    'getting-started': [
      {
        question: 'How do I set up the primary device?',
        answer: 'The primary device (AI Security Engine) should be deployed in your network perimeter. Configure network interfaces, set up monitoring rules, and initialize the AI models through the dashboard.'
      },
      {
        question: 'How do I configure the secondary device?',
        answer: 'The secondary device (Cryptographic Control Unit) requires secure hardware installation. Generate cryptographic keys, configure TOTP, and establish secure communication with the primary device.'
      },
      {
        question: 'What are the system requirements?',
        answer: 'Primary Device: 8GB RAM, 4 vCPUs, 100GB storage. Secondary Device: 4GB RAM, 2 vCPUs, 50GB encrypted storage with TPM 2.0 support.'
      }
    ],
    'troubleshooting': [
      {
        question: 'Why are my logs not being signed?',
        answer: 'Check the connection between primary and secondary devices. Verify TOTP synchronization and ensure the cryptographic keys are properly initialized.'
      },
      {
        question: 'How do I reset the system?',
        answer: 'Use the emergency recovery procedure documented in the admin guide. This requires physical access to both devices and the recovery key.'
      },
      {
        question: 'Performance issues with threat detection?',
        answer: 'Check system resources on the primary device. Consider reducing the monitoring scope or upgrading hardware if consistently hitting resource limits.'
      }
    ],
    'api': [
      {
        question: 'How do I access the API?',
        answer: 'Both devices provide RESTful APIs. Primary device: http://localhost:8000/docs, Secondary device: http://localhost:8001/docs. Authentication requires JWT tokens.'
      },
      {
        question: 'What authentication methods are supported?',
        answer: 'JWT with TOTP multi-factor authentication. API keys are also supported for machine-to-machine communication.'
      },
      {
        question: 'Rate limiting and quotas?',
        answer: 'Default rate limit is 100 requests per minute per endpoint. Contact support for increased limits in production environments.'
      }
    ],
    'security': [
      {
        question: 'How is data protected?',
        answer: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Audit trails are cryptographically signed and immutable.'
      },
      {
        question: 'What compliance standards are supported?',
        answer: 'FIPS 140-2, NIST Cybersecurity Framework, ISO 27001, SOC 2, and GDPR compliance features are built-in.'
      },
      {
        question: 'How are keys managed?',
        answer: 'Private keys are stored in hardware security modules (HSM/TPM). Key rotation is automated with secure backup procedures.'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Get assistance with Project Aegis configuration and troubleshooting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {[
                { id: 'getting-started', name: 'Getting Started', icon: BookOpenIcon },
                { id: 'troubleshooting', name: 'Troubleshooting', icon: ChatBubbleLeftRightIcon },
                { id: 'api', name: 'API Documentation', icon: BookOpenIcon },
                { id: 'security', name: 'Security', icon: BookOpenIcon }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md ${
                    activeCategory === item.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Support */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">support@companyaegis.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">+1 (555) 123-HELP</span>
              </div>
              <div className="flex items-center space-x-3">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Live Chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {Object.keys(categories).find(key => key === activeCategory)?.replace('-', ' ').toUpperCase()}
            </h2>
            
            <div className="space-y-6">
              {categories[activeCategory].map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Procedures */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Procedures</h3>
            <div className="space-y-3">
              <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <h4 className="font-medium text-danger-900">System Compromise</h4>
                <p className="text-sm text-danger-700 mt-1">
                  If you suspect a security breach, immediately disconnect both devices from the network and contact security support.
                </p>
              </div>
              <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <h4 className="font-medium text-warning-900">Key Compromise</h4>
                <p className="text-sm text-warning-700 mt-1">
                  If cryptographic keys are compromised, initiate emergency key rotation and review all signed logs for tampering.
                </p>
              </div>
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-medium text-primary-900">Data Recovery</h4>
                <p className="text-sm text-primary-700 mt-1">
                  Use the encrypted backup keys stored in the secure vault to restore system state after hardware failure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;