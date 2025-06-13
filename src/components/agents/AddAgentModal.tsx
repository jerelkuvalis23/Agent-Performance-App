import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addAgent } from '../../utils/agentUtils';

interface AddAgentModalProps {
  onClose: () => void;
  onAgentAdded: () => void;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ onClose, onAgentAdded }) => {
  const [name, setName] = useState('');
  const [shiftStartDate, setShiftStartDate] = useState('');
  const [shiftStartTime, setShiftStartTime] = useState('');
  const [shiftEndDate, setShiftEndDate] = useState('');
  const [shiftEndTime, setShiftEndTime] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !shiftStartDate || !shiftStartTime || !shiftEndDate || !shiftEndTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const shiftScheduledStart = new Date(`${shiftStartDate}T${shiftStartTime}`).toISOString();
    const shiftScheduledEnd = new Date(`${shiftEndDate}T${shiftEndTime}`).toISOString();
    
    if (new Date(shiftScheduledEnd) <= new Date(shiftScheduledStart)) {
      toast.error('Shift end time must be after shift start time');
      return;
    }
    
    addAgent({
      name,
      shiftScheduledStart,
      shiftScheduledEnd,
      shiftActualStart: null,
      leads: 0,
    });
    
    toast.success('Agent added successfully');
    onAgentAdded();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full animate-slide-up">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Agent</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Agent Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter agent name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shift Start
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={shiftStartDate}
                onChange={(e) => setShiftStartDate(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="time"
                value={shiftStartTime}
                onChange={(e) => setShiftStartTime(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shift End
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={shiftEndDate}
                onChange={(e) => setShiftEndDate(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <input
                type="time"
                value={shiftEndTime}
                onChange={(e) => setShiftEndTime(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm 
                        font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 
                        dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-primary-500"
            >
              Add Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgentModal;