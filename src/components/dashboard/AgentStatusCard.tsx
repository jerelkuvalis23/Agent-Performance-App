import React from 'react';
import { User } from 'lucide-react';
import { Agent } from '../../types';
import { calculateAgentMetrics } from '../../utils/agentUtils';

interface AgentStatusCardProps {
  agent: Agent;
}

const AgentStatusCard: React.FC<AgentStatusCardProps> = ({ agent }) => {
  const metrics = calculateAgentMetrics(agent);
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center mb-2">
        <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="font-medium text-gray-900 dark:text-white text-center">{agent.name}</h3>
      <div className="mt-2 w-full space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 dark:text-gray-400">Leads:</span>
          <span className="font-semibold text-accent-600 dark:text-accent-400">{agent.leads}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 dark:text-gray-400">Adherence:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{metrics.adherence}%</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 dark:text-gray-400">Status:</span>
          <span className={`font-semibold ${agent.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {agent.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentStatusCard;