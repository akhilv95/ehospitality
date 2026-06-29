import { useEffect, useState } from 'react';
import { medicalRecordAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PatientMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await medicalRecordAPI.getAll();
      setRecords(res.data.results || res.data || []);
    } catch (error) {
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-600">View your diagnoses, symptoms, and treatments.</p>
      </div>

      {records.length === 0 ? (
        <div className="card">
          <p className="text-gray-500">No medical records found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="card">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">{record.created_at}</p>
                <p className="text-gray-900">
                  <span className="font-semibold">Doctor:</span>{' '}
                  {record.doctor_detail?.full_name || 'N/A'}
                </p>
                <p className="text-gray-900">
                  <span className="font-semibold">Diagnosis:</span> {record.diagnosis}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Symptoms:</span> {record.symptoms || 'N/A'}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Treatment:</span> {record.treatment || 'N/A'}
                </p>

                {record.lab_results?.length > 0 && (
                  <div className="mt-4">
                    <h2 className="font-semibold text-gray-900 mb-2">Lab Results</h2>
                    <div className="space-y-2">
                      {record.lab_results.map((lab) => (
                        <div key={lab.id} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-gray-900">{lab.test_name}</p>
                          <p className="text-sm text-gray-600">{lab.result}</p>
                          <p className="text-sm text-gray-500">
                            {lab.normal_range ? `Normal: ${lab.normal_range}` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientMedicalRecords;
