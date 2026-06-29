import { useEffect, useState } from 'react';
import { prescriptionAPI, appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patient: '',
    appointment: '',
    diagnosis: '',
    notes: '',
    pharmacy_name: '',
    pharmacy_address: '',
    medications: [
      {
        name: '',
        dosage: '',
        frequency: 'once_daily',
        duration_days: 1,
        instructions: '',
        quantity: 1,
        refills_allowed: 0,
      },
    ],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [presRes, appRes] = await Promise.all([
        prescriptionAPI.getAll(),
        appointmentAPI.getAll(),
      ]);

      const prescriptionList = presRes.data.results || presRes.data || [];
      const appointmentList = appRes.data.results || appRes.data || [];

      setPrescriptions(prescriptionList);
      setAppointments(appointmentList);

      const patientMap = {};
      appointmentList.forEach((item) => {
        if (item.patient && item.patient_detail) {
          patientMap[item.patient] = item.patient_detail;
        }
      });
      setPatients(Object.values(patientMap));
    } catch (error) {
      toast.error('Failed to load prescription data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...form.medications];
    updated[index][field] = value;
    setForm({ ...form, medications: updated });
  };

  const addMedication = () => {
    setForm({
      ...form,
      medications: [
        ...form.medications,
        {
          name: '',
          dosage: '',
          frequency: 'once_daily',
          duration_days: 1,
          instructions: '',
          quantity: 1,
          refills_allowed: 0,
        },
      ],
    });
  };

  const removeMedication = (index) => {
    const updated = form.medications.filter((_, i) => i !== index);
    setForm({ ...form, medications: updated });
  };

  const handleCheckInteractions = async () => {
    const medicationNames = form.medications
      .map((m) => m.name.trim())
      .filter(Boolean);

    if (medicationNames.length < 2) {
      toast('Add at least 2 medicines to check interactions');
      return;
    }

    try {
      const res = await prescriptionAPI.checkInteractions(medicationNames);
      const interactions = res.data.interactions || [];

      if (interactions.length === 0) {
        toast.success('No drug interactions found');
      } else {
        toast.error(
          interactions.map((i) => `${i.drug_a} + ${i.drug_b}: ${i.severity}`).join(' | ')
        );
      }
    } catch (error) {
      toast.error('Failed to check interactions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.patient || !form.diagnosis || form.medications.length === 0) {
      toast.error('Patient, diagnosis and at least one medication are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        patient: Number(form.patient),
        appointment: form.appointment ? Number(form.appointment) : null,
        diagnosis: form.diagnosis,
        notes: form.notes,
        pharmacy_name: form.pharmacy_name,
        pharmacy_address: form.pharmacy_address,
        medications: form.medications.map((m) => ({
          ...m,
          duration_days: Number(m.duration_days),
          quantity: Number(m.quantity),
          refills_allowed: Number(m.refills_allowed),
        })),
      };

      await prescriptionAPI.create(payload);
      toast.success('Prescription created successfully');

      setForm({
        patient: '',
        appointment: '',
        diagnosis: '',
        notes: '',
        pharmacy_name: '',
        pharmacy_address: '',
        medications: [
          {
            name: '',
            dosage: '',
            frequency: 'once_daily',
            duration_days: 1,
            instructions: '',
            quantity: 1,
            refills_allowed: 0,
          },
        ],
      });

      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create prescription');
    } finally {
      setSaving(false);
    }
  };

  const handleSendToPharmacy = async (id) => {
    try {
      await prescriptionAPI.sendToPharmacy(id, {
        pharmacy_name: 'City Pharmacy',
        pharmacy_address: 'Main Road',
      });
      toast.success('Prescription sent to pharmacy');
      fetchData();
    } catch (error) {
      toast.error('Failed to send prescription');
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
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Write Prescription</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="patient"
            value={form.patient}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.user?.first_name} {patient.user?.last_name}
              </option>
            ))}
          </select>

          <select
            name="appointment"
            value={form.appointment}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select appointment (optional)</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {appointment.patient_detail?.user?.first_name} {appointment.patient_detail?.user?.last_name} - {appointment.date} {appointment.time}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="diagnosis"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            className="input-field"
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="input-field"
            rows="3"
          />

          <input
            type="text"
            name="pharmacy_name"
            placeholder="Pharmacy name"
            value={form.pharmacy_name}
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="text"
            name="pharmacy_address"
            placeholder="Pharmacy address"
            value={form.pharmacy_address}
            onChange={handleChange}
            className="input-field"
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Medications</h2>
              <button
                type="button"
                onClick={addMedication}
                className="btn-secondary"
              >
                Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {form.medications.map((med, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={med.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    className="input-field"
                  />

                  <input
                    type="text"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    className="input-field"
                  />

                  <select
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    className="input-field"
                  >
                    <option value="once_daily">Once Daily</option>
                    <option value="twice_daily">Twice Daily</option>
                    <option value="three_times">Three Times Daily</option>
                    <option value="four_times">Four Times Daily</option>
                    <option value="as_needed">As Needed</option>
                    <option value="weekly">Weekly</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Duration days"
                    value={med.duration_days}
                    onChange={(e) => handleMedicationChange(index, 'duration_days', e.target.value)}
                    className="input-field"
                  />

                  <input
                    type="text"
                    placeholder="Instructions"
                    value={med.instructions}
                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                    className="input-field"
                  />

                  <input
                    type="number"
                    placeholder="Quantity"
                    value={med.quantity}
                    onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                    className="input-field"
                  />

                  <input
                    type="number"
                    placeholder="Refills allowed"
                    value={med.refills_allowed}
                    onChange={(e) => handleMedicationChange(index, 'refills_allowed', e.target.value)}
                    className="input-field"
                  />

                  {form.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="btn-danger"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCheckInteractions}
              className="btn-secondary"
            >
              Check Interactions
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Prescriptions</h2>

        {prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions found.</p>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="border rounded-lg p-4">
                <p className="font-semibold text-gray-900">
                  {prescription.patient_detail?.user?.first_name} {prescription.patient_detail?.user?.last_name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Diagnosis: {prescription.diagnosis}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {prescription.status_display}
                </p>

                <div className="mt-3 space-y-2">
                  {prescription.medications?.map((med) => (
                    <div key={med.id} className="bg-gray-50 rounded p-3">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-600">
                        {med.dosage} - {med.frequency_display}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSendToPharmacy(prescription.id)}
                  className="btn-primary mt-4"
                >
                  Send to Pharmacy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
