import { useEffect, useState } from 'react';
import { medicalRecordAPI, appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DoctorPatients = () => {
  const [showForm, setShowForm] = useState(false);

const [formData, setFormData] = useState({
    diagnosis: "",
    symptoms: "",
    treatment: "",
});
  const [patientsMap, setPatientsMap] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientsFromAppointments();
  }, []);

  const fetchPatientsFromAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentAPI.getAll();
      const list = res.data.results || res.data || [];
      setAppointments(list);

      const map = {};

list.forEach((item) => {
  if (item.patient_detail) {
    map[item.patient] = {
      ...item.patient_detail,
      patientId: item.patient,
      appointmentId: item.id,
    };
  }
});
      setPatientsMap(map);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const openPatientHistory = async (patient) => {
  setSelectedPatient(patient);

  try {
    const res = await medicalRecordAPI.getPatientHistory(
      patient.patientId
    );

    setMedicalHistory(res.data.results || res.data || []);
  } catch (error) {
    setMedicalHistory([]);
    toast.error("Failed to load medical history");
  }
};

  const patients = Object.values(patientsMap);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
 const saveMedicalRecord = async () => {
    try {
        const payload = {
            patient: selectedPatient.patientId,
            appointment: selectedPatient.appointmentId,
            diagnosis: formData.diagnosis,
            symptoms: formData.symptoms,
            treatment: formData.treatment,
            vital_signs: {},
            is_confidential: false,
        };

        console.log("Payload:", payload);

        const res = await medicalRecordAPI.create(payload);

        console.log("Created:", res.data);

        toast.success("Medical record added");

        setShowForm(false);

        setFormData({
            diagnosis: "",
            symptoms: "",
            treatment: "",
        });

        openPatientHistory(selectedPatient);

    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);

        toast.error("Failed to save medical record");
    }
};

  return (
    
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 card">
        {showForm && (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50">

        <h3 className="text-lg font-semibold mb-4">
            Add Medical Record
        </h3>

        <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="Diagnosis"
            value={formData.diagnosis}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    diagnosis: e.target.value,
                })
            }
        />

        <textarea
            className="w-full border p-2 mb-3 rounded"
            placeholder="Symptoms"
            value={formData.symptoms}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    symptoms: e.target.value,
                })
            }
        />

        <textarea
            className="w-full border p-2 mb-3 rounded"
            placeholder="Treatment"
            value={formData.treatment}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    treatment: e.target.value,
                })
            }
        />

        <button
            onClick={saveMedicalRecord}
            className="bg-green-600 text-white px-4 py-2 rounded"
        >
            Save
        </button>

    </div>
)}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Patients</h1>

        {patients.length === 0 ? (
          <p className="text-gray-500">No patients found from your appointments.</p>
        ) : (
          <div className="space-y-3">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => openPatientHistory(patient)}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-900">
                  {patient.user?.first_name} {patient.user?.last_name}
                </p>
                <p className="text-sm text-gray-600">{patient.user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Blood Group: {patient.blood_group || 'N/A'}
                </p>
              </button>
              
              
            ))}
          </div>
        )}
      </div>

      <div className="xl:col-span-2 card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          <button
    onClick={() => setShowForm(true)}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
    Add Medical Record
</button>
          {selectedPatient
            ? `${selectedPatient.user?.first_name} ${selectedPatient.user?.last_name} - Medical History`
            : 'Select a patient'}
        </h2>

        {!selectedPatient ? (
          <p className="text-gray-500">Choose a patient from the left to view details.</p>
        ) : medicalHistory.length === 0 ? (
          <p className="text-gray-500">No medical history found for this patient.</p>
        ) : (
          <div className="space-y-4">
            {medicalHistory.map((record) => (
              <div key={record.id} className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">{record.created_at}</p>
                <p className="text-gray-900">
                  <span className="font-semibold">Diagnosis:</span> {record.diagnosis}
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Symptoms:</span> {record.symptoms || 'N/A'}
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Treatment:</span> {record.treatment || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      

    </div>
  );
};

export default DoctorPatients;
