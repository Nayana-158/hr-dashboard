'use client'

import { useState } from 'react'

export default function TabsContent({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'feedback'>('overview')

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {['overview', 'projects', 'feedback'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded bg-white">
        {activeTab === 'overview' && (
          <div>
            <h2 className="font-semibold mb-2">Performance History</h2>
            <ul className="list-disc list-inside">
              {user.history.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h2 className="font-semibold mb-2">Projects</h2>
            <ul className="list-disc list-inside">
              <li>Onboarded 5 new hires</li>
              <li>Redesigned internal tool</li>
              <li>Improved customer support workflow</li>
            </ul>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <h2 className="font-semibold mb-2">Feedback</h2>
            <ul className="list-disc list-inside">
              <li>“Great collaborator!”</li>
              <li>“Very punctual and consistent.”</li>
              <li>“Needs to improve documentation.”</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
