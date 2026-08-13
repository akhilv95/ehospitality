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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Prescription Management
            </h1>

            <p className="text-gray-500 mt-1">
              Create prescriptions and manage patient medications
            </p>
          </div>

        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Prescriptions
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {prescriptions.length}
              </p>
            </div>

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 font-medium">
                My Patients
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {patients.length}
              </p>
            </div>

            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 font-medium">
                Appointments
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {appointments.length}
              </p>
            </div>

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>

          </div>
        </div>

      </div>

      {/* CREATE PRESCRIPTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">

        {/* FORM HEADER */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">
                ✚
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Write Prescription
              </h2>

              <p className="text-sm text-gray-500">
                Create a new prescription for your patient
              </p>
            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-7"
        >

          {/* PATIENT + APPOINTMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                name="patient"
                value={form.patient}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">
                  Select patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.user?.first_name}{" "}
                    {patient.user?.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment
              </label>

              <select
                name="appointment"
                value={form.appointment}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">
                  Select appointment (optional)
                </option>

                {appointments.map((appointment) => (
                  <option
                    key={appointment.id}
                    value={appointment.id}
                  >
                    {appointment.patient_detail?.user?.first_name}{" "}
                    {appointment.patient_detail?.user?.last_name}
                    {" - "}
                    {appointment.date}{" "}
                    {appointment.time}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* DIAGNOSIS */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Diagnosis
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              type="text"
              name="diagnosis"
              placeholder="Enter diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

          </div>

          {/* NOTES */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clinical Notes
            </label>

            <textarea
              name="notes"
              placeholder="Add clinical notes or additional instructions..."
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />

          </div>

          {/* PHARMACY */}
          <div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">
                🏥
              </span>

              <h3 className="text-lg font-bold text-gray-900">
                Pharmacy Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                name="pharmacy_name"
                placeholder="Pharmacy name"
                value={form.pharmacy_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <input
                type="text"
                name="pharmacy_address"
                placeholder="Pharmacy address"
                value={form.pharmacy_address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

            </div>

          </div>

          {/* MEDICATIONS */}
          <div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Medications
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Add medicines, dosage and instructions
                </p>
              </div>

              <button
                type="button"
                onClick={addMedication}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-sm"
              >
                <span className="text-lg">+</span>
                Add Medicine
              </button>

            </div>

            <div className="space-y-5">

              {form.medications.map(
                (med, index) => (

                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-5 bg-gray-50 hover:border-blue-200 transition"
                  >

                    <div className="flex items-center justify-between mb-5">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">
                            💊
                          </span>
                        </div>

                        <h4 className="font-bold text-gray-900">
                          Medicine {index + 1}
                        </h4>

                      </div>

                      {form.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeMedication(index)
                          }
                          className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* MEDICINE NAME */}
                      <div className="md:col-span-2">

                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Medicine Name
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Paracetamol"
                          value={med.name}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                      {/* DOSAGE */}
                      <div>

                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Dosage
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. 500mg"
                          value={med.dosage}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                      {/* FREQUENCY */}
                      <div>

                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Frequency
                        </label>

                        <select
                          value={med.frequency}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "frequency",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="once_daily">
                            Once Daily
                          </option>

                          <option value="twice_daily">
                            Twice Daily
                          </option>

                          <option value="three_times">
                            Three Times Daily
                          </option>

                          <option value="four_times">
                            Four Times Daily
                          </option>

                          <option value="as_needed">
                            As Needed
                          </option>

                          <option value="weekly">
                            Weekly
                          </option>

                        </select>

                      </div>

                      {/* DURATION */}
                      <div>

                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Duration (Days)
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={med.duration_days}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "duration_days",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                      {/* QUANTITY */}
                      <div>

                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={med.quantity}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                      {/* INSTRUCTIONS */}
                      <div className="md:col-span-2">

                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Instructions
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Take after food"
                          value={med.instructions}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                      {/* REFILLS */}
                      <div>

                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Refills Allowed
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={med.refills_allowed}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "refills_allowed",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">

            <button
              type="button"
              onClick={handleCheckInteractions}
              className="px-5 py-3 border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl font-semibold transition"
            >
              🔍 Check Drug Interactions
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  💊 Create Prescription
                </>
              )}
            </button>

          </div>

        </form>

      </div>

      {/* EXISTING PRESCRIPTIONS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-100">

          <h2 className="text-xl font-bold text-gray-900">
            Existing Prescriptions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View and manage prescriptions created for your patients
          </p>

        </div>

        <div className="p-6">

          {prescriptions.length === 0 ? (

            <div className="text-center py-12">

              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">
                  💊
                </span>
              </div>

              <h3 className="font-semibold text-gray-700 mt-4">
                No prescriptions found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Create your first prescription above.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {prescriptions.map(
                (prescription) => (

                  <div
                    key={prescription.id}
                    className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition"
                  >

                    {/* PRESCRIPTION HEADER */}

                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-5">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">
                              💊
                            </span>
                          </div>

                          <div>

                            <p className="font-bold text-gray-900">
                              {prescription.patient_detail?.user?.first_name}{" "}
                              {prescription.patient_detail?.user?.last_name}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Prescription #{prescription.id}
                            </p>

                          </div>

                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {prescription.status_display ||
                            "Active"}
                        </span>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="p-5">

                      <div className="mb-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Diagnosis
                        </p>

                        <p className="text-gray-800 font-medium mt-1">
                          {prescription.diagnosis ||
                            "N/A"}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                          Medications
                        </p>

                        <div className="space-y-2">

                          {prescription.medications?.map(
                            (med) => (

                              <div
                                key={med.id}
                                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                              >

                                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                  💊
                                </div>

                                <div className="flex-1">

                                  <p className="font-semibold text-gray-800">
                                    {med.name}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    {med.dosage}{" "}
                                    •{" "}
                                    {med.frequency_display}
                                  </p>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          handleSendToPharmacy(
                            prescription.id
                          )
                        }
                        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition"
                      >
                        🏥 Send to Pharmacy
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default DoctorPrescriptions;
