import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Shield, Bell } from 'lucide-react';
import UserSettings from './UserSettings';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';

const tabs = [
  { id: 'profile', name: 'プロフィール', icon: User, component: UserSettings },
  { id: 'security', name: 'セキュリティ', icon: Shield, component: SecuritySettings },
  { id: 'notifications', name: '通知', icon: Bell, component: NotificationSettings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('profile');
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || UserSettings;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-6 w-6 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}