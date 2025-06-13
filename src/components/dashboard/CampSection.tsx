import React, { useState } from 'react';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { Camp } from '../../types';
import { addCamp, getCamps, calculateCampProductivity } from '../../utils/campUtils';

const CampSection: React.FC = () => {
  const [camps, setCamps] = useState<Camp[]>(getCamps());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [newCampTarget, setNewCampTarget] = useState('');
  
  const handleAddCamp = () => {
    if (!newCampName || !newCampTarget) return;
    
    addCamp(newCampName, parseInt(newCampTarget));
    setCamps(getCamps());
    setShowAddModal(false);
    setNewCampName('');
    setNewCampTarget('');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Campaign Performance</h2>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md 
                    shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Campaign
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {camps.map((camp) => {
          const productivity = calculateCampProductivity(camp);
          return (
            <div key={camp.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{camp.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  camp.status === 'achieved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : camp.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {camp.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Leads:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{camp.leads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Target:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{camp.target}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Productivity:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{productivity.toFixed(1)}%</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      productivity >= 100 
                        ? 'bg-green-600' 
                        : productivity >= 70 
                          ? 'bg-yellow-600' 
                          : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(100, productivity)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Campaign</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Target Leads</label>
                <input
                  type="number"
                  value={newCampTarget}
                  onChange={(e) => setNewCampTarget(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter target leads"
                  min="1"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCamp}
                className="px-4 py-2 bg-primary-600 text-white rounded"
              >
                Add Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampSection;