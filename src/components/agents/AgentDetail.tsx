// Update the leads input section to include camp selection
const [selectedCamp, setSelectedCamp] = useState('');
const [camps, setCamps] = useState<Camp[]>([]);

useEffect(() => {
  // Load camps when component mounts
  setCamps(getCamps());
}, []);

const handleSaveLeads = () => {
  if (agent && selectedCamp) {
    updateAgentLeads(agent.id, leads, selectedCamp);
    toast.success('Leads updated successfully');
    loadAgentData();
  } else {
    toast.error('Please select a camp');
  }
};

// In the JSX, update the leads section:
<div>
  <label htmlFor="leads" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
    Current Leads
  </label>
  <div className="space-y-2">
    <select
      value={selectedCamp}
      onChange={(e) => setSelectedCamp(e.target.value)}
      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
    >
      <option value="">Select Camp</option>
      {camps.map(camp => (
        <option key={camp.id} value={camp.name}>{camp.name}</option>
      ))}
    </select>
    <div className="flex">
      <input
        type="number"
        id="leads"
        value={leads}
        onChange={(e) => setLeads(parseInt(e.target.value) || 0)}
        min="0"
        className="block w-full border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm py-2 px-3 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
      />
      <button
        onClick={handleSaveLeads}
        className="inline-flex items-center px-3 py-2 border border-transparent rounded-r-md shadow-sm text-sm 
                  font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2"
      >
        <Save className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>

export default handleSaveLeads