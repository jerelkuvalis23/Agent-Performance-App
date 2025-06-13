import React, { useState, useEffect } from 'react';
import { getAgents } from '../../utils/agentUtils';
import { Agent } from '../../types';

const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  // Update the useEffect hook in AgentList.tsx to sort agents by leads
  useEffect(() => {
    const allAgents = getAgents();
    // Sort agents by leads in descending order
    const sortedAgents = allAgents.sort((a, b) => b.leads - a.leads);
    setAgents(sortedAgents);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agent List</h1>
      <div className="grid gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                <p className="text-gray-600">{agent.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Leads</p>
                <p className="text-xl font-bold text-blue-600">{agent.leads}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;