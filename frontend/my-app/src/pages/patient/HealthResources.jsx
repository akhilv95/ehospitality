import { useEffect, useState } from 'react';
import { patientAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PatientHealthResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchResources();
  }, [category]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = category ? { category } : {};
      const res = await patientAPI.getHealthResources(params);
      setResources(res.data.results || res.data || []);
    } catch (error) {
      toast.error('Failed to load health resources');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: 'All', value: '' },
    { label: 'Wellness', value: 'wellness' },
    { label: 'Nutrition', value: 'nutrition' },
    { label: 'Exercise', value: 'exercise' },
    { label: 'Mental Health', value: 'mental_health' },
    { label: 'Disease Prevention', value: 'disease_prevention' },
    { label: 'Chronic Conditions', value: 'chronic_conditions' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health Resources</h1>
        <p className="text-gray-600">Read educational content and wellness guidance.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((item) => (
          <button
            key={item.value || 'all'}
            onClick={() => setCategory(item.value)}
            className={`px-4 py-2 rounded-lg ${
              category === item.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="card">
          <p className="text-gray-500">No health resources found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="card">
              <p className="text-sm text-primary-600 font-medium capitalize mb-2">
                {resource.category.replace('_', ' ')}
              </p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {resource.title}
              </h2>
              <p className="text-gray-700 mb-3">
                {resource.content}
              </p>

              {resource.video_url && (
                <a
                  href={resource.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 font-medium hover:underline"
                >
                  Watch related video
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHealthResources;
