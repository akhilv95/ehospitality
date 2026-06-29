import { useEffect, useState } from 'react';
import { prescriptionAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await prescriptionAPI.getAll();
      setPrescriptions(res.data.results || res.data || []);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'active') return 'badge-success';
    if (status === 'completed') return 'badge-info';
    if (status === 'cancelled') return 'badge-danger';
    return 'badge-info';
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
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
        <p className="text-gray-600">Review medications prescribed for you.</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="card">
          <p className="text-gray-500">No prescriptions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <span className="font-semibold">Doctor:</span>{' '}
                    {prescription.doctor_detail?.full_name || 'N/A'}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-semibold">Diagnosis:</span> {prescription.diagnosis}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Notes:</span> {prescription.notes || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Pharmacy:</span>{' '}
                    {prescription.pharmacy_name || 'Not assigned'}
                  </p>
                </div>

                <span className={getStatusBadge(prescription.status)}>
                  {prescription.status_display}
                </span>
              </div>

              <div className="mt-4">
                <h2 className="font-semibold text-gray-900 mb-2">Medications</h2>
                <div className="space-y-2">
                  {prescription.medications?.map((med) => (
                    <div key={med.id} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">
                        {med.dosage} - {med.frequency_display}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {med.duration_days} day(s)
                      </p>
                      <p className="text-sm text-gray-600">
                        Instructions: {med.instructions || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
