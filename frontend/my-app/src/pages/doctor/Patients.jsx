import { useEffect, useState } from "react";
import {
  UserGroupIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  XMarkIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import {
  medicalRecordAPI,
  appointmentAPI,
} from "../../services/api";
import toast from "react-hot-toast";

const DoctorPatients = () => {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    diagnosis: "",
    symptoms: "",
    treatment: "",
  });

  const [patientsMap, setPatientsMap] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [medicalHistory, setMedicalHistory] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatientsFromAppointments();
  }, []);

  // ==========================================
  // LOAD PATIENTS
  // ==========================================

  const fetchPatientsFromAppointments = async () => {
    setLoading(true);

    try {
      const res = await appointmentAPI.getAll();

      const list =
        res.data.results ||
        res.data ||
        [];

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
      console.error(
        "Patient loading error:",
        error.response?.data || error
      );

      toast.error(
        "Failed to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // OPEN PATIENT HISTORY
  // ==========================================

  const openPatientHistory = async (patient) => {
    setSelectedPatient(patient);
    setShowForm(false);

    try {
      const res =
        await medicalRecordAPI.getPatientHistory(
          patient.patientId
        );

      setMedicalHistory(
        res.data.results ||
          res.data ||
          []
      );
    } catch (error) {
      console.error(
        "Medical history error:",
        error.response?.data || error
      );

      setMedicalHistory([]);

      toast.error(
        "Failed to load medical history"
      );
    }
  };

  // ==========================================
  // SAVE MEDICAL RECORD
  // ==========================================

  const saveMedicalRecord = async () => {
    if (!selectedPatient) {
      toast.error(
        "Please select a patient first"
      );
      return;
    }

    if (!formData.diagnosis.trim()) {
      toast.error(
        "Please enter a diagnosis"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        patient:
          selectedPatient.patientId,

        appointment:
          selectedPatient.appointmentId,

        diagnosis:
          formData.diagnosis,

        symptoms:
          formData.symptoms,

        treatment:
          formData.treatment,

        vital_signs: {},

        is_confidential: false,
      };

      console.log(
        "Medical Record Payload:",
        payload
      );

      const res =
        await medicalRecordAPI.create(
          payload
        );

      console.log(
        "Created Record:",
        res.data
      );

      toast.success(
        "Medical record added successfully"
      );

      setShowForm(false);

      setFormData({
        diagnosis: "",
        symptoms: "",
        treatment: "",
      });

      await openPatientHistory(
        selectedPatient
      );
    } catch (error) {
      console.error(
        "Save medical record error:",
        error.response?.data ||
          error
      );

      toast.error(
        error.response?.data?.detail ||
          "Failed to save medical record"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PATIENTS
  // ==========================================

  const patients = Object.values(
    patientsMap
  );

  const filteredPatients =
    patients.filter((patient) => {
      const name =
        `${patient.user?.first_name || ""} ${
          patient.user?.last_name || ""
        }`.toLowerCase();

      const email =
        patient.user?.email?.toLowerCase() ||
        "";

      const query =
        search.toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query)
      );
    });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">
            Loading patients...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">

            <UserGroupIcon className="w-8 h-8 text-blue-600" />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              My Patients
            </h1>

            <p className="text-gray-500 mt-1">
              View your patients and manage their medical records
            </p>

          </div>

        </div>

      </div>

      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Total Patients
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {patients.length}
              </p>

            </div>

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">

              <UserGroupIcon className="w-6 h-6 text-blue-600" />

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

            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">

              <ClipboardDocumentListIcon className="w-6 h-6 text-green-600" />

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Medical Records
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {medicalHistory.length}
              </p>

            </div>

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">

              <BeakerIcon className="w-6 h-6 text-purple-600" />

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ====================================
            LEFT - PATIENT LIST
        ==================================== */}

        <div className="xl:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* HEADER */}

          <div className="p-6 border-b border-gray-100">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Patients
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {patients.length} registered patients
                </p>

              </div>

              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">

                <UserGroupIcon className="w-5 h-5 text-blue-600" />

              </div>

            </div>

            {/* SEARCH */}

            <div className="relative">

              <MagnifyingGlassIcon
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search patient..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

            </div>

          </div>

          {/* PATIENT LIST */}

          <div className="p-4 max-h-[650px] overflow-y-auto">

            {filteredPatients.length ===
            0 ? (

              <div className="text-center py-10">

                <UserCircleIcon className="w-12 h-12 text-gray-300 mx-auto" />

                <p className="text-gray-500 mt-3">
                  No patients found
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {filteredPatients.map(
                  (patient) => {

                    const isSelected =
                      selectedPatient?.patientId ===
                      patient.patientId;

                    return (

                      <button
                        key={
                          patient.patientId
                        }
                        onClick={() =>
                          openPatientHistory(
                            patient
                          )
                        }
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-50 border-blue-300 shadow-sm"
                            : "bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50 hover:shadow-sm"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          {/* AVATAR */}

                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-blue-600"
                                : "bg-blue-100"
                            }`}
                          >

                            <UserCircleIcon
                              className={`w-7 h-7 ${
                                isSelected
                                  ? "text-white"
                                  : "text-blue-600"
                              }`}
                            />

                          </div>

                          {/* DETAILS */}

                          <div className="min-w-0 flex-1">

                            <p className="font-semibold text-gray-900 truncate">

                              {patient.user
                                ?.first_name}{" "}

                              {patient.user
                                ?.last_name}

                            </p>

                            <p className="text-sm text-gray-500 truncate">
                              {patient.user?.email}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">

                              Blood Group:{" "}

                              <span className="font-medium text-gray-600">
                                {patient.blood_group ||
                                  "N/A"}
                              </span>

                            </p>

                          </div>

                        </div>

                      </button>

                    );
                  }
                )}

              </div>

            )}

          </div>

        </div>

        {/* ====================================
            RIGHT - MEDICAL HISTORY
        ==================================== */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {!selectedPatient ? (

            <div className="h-full min-h-[500px] flex items-center justify-center text-center p-10">

              <div>

                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">

                  <ClipboardDocumentListIcon className="w-10 h-10 text-blue-500" />

                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-5">
                  Select a Patient
                </h2>

                <p className="text-gray-500 mt-2 max-w-md">
                  Select a patient from the list to view their medical history and add new medical records.
                </p>

              </div>

            </div>

          ) : (

            <>

              {/* PATIENT HEADER */}

              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">

                      <UserCircleIcon className="w-9 h-9 text-white" />

                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-gray-900">

                        {selectedPatient.user
                          ?.first_name}{" "}

                        {selectedPatient.user
                          ?.last_name}

                      </h2>

                      <p className="text-sm text-gray-500">
                        {selectedPatient.user?.email}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setShowForm(
                        !showForm
                      )
                    }
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition"
                  >

                    {showForm ? (
                      <>
                        <XMarkIcon className="w-5 h-5" />
                        Close
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5" />
                        Add Medical Record
                      </>
                    )}

                  </button>

                </div>

              </div>

              {/* =================================
                  ADD MEDICAL RECORD FORM
              ================================= */}

              {showForm && (

                <div className="p-6 border-b border-gray-100 bg-gray-50">

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

                    <div className="flex items-center gap-3 mb-6">

                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">

                        <PlusIcon className="w-5 h-5 text-green-600" />

                      </div>

                      <div>

                        <h3 className="text-lg font-bold text-gray-900">
                          Add Medical Record
                        </h3>

                        <p className="text-sm text-gray-500">
                          Add clinical information for this patient
                        </p>

                      </div>

                    </div>

                    <div className="space-y-5">

                      {/* DIAGNOSIS */}

                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Diagnosis
                          <span className="text-red-500 ml-1">
                            *
                          </span>
                        </label>

                        <input
                          type="text"
                          value={
                            formData.diagnosis
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diagnosis:
                                e.target.value,
                            })
                          }
                          placeholder="Enter diagnosis"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                      </div>

                      {/* SYMPTOMS */}

                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Symptoms
                        </label>

                        <textarea
                          rows="3"
                          value={
                            formData.symptoms
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              symptoms:
                                e.target.value,
                            })
                          }
                          placeholder="Describe patient's symptoms"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />

                      </div>

                      {/* TREATMENT */}

                      <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Treatment
                        </label>

                        <textarea
                          rows="3"
                          value={
                            formData.treatment
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              treatment:
                                e.target.value,
                            })
                          }
                          placeholder="Enter treatment or recommendations"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />

                      </div>

                      {/* BUTTONS */}

                      <div className="flex justify-end gap-3 pt-3">

                        <button
                          type="button"
                          onClick={() =>
                            setShowForm(false)
                          }
                          className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={
                            saveMedicalRecord
                          }
                          disabled={saving}
                          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition disabled:opacity-50 flex items-center gap-2"
                        >

                          {saving ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                              Saving...
                            </>
                          ) : (
                            <>
                              <ClipboardDocumentListIcon className="w-5 h-5" />

                              Save Record
                            </>
                          )}

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              )}

              {/* =================================
                  MEDICAL HISTORY
              ================================= */}

              <div className="p-6">

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <h3 className="text-lg font-bold text-gray-900">
                      Medical History
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {medicalHistory.length} record
                      {medicalHistory.length !==
                      1
                        ? "s"
                        : ""}{" "}
                      available
                    </p>

                  </div>

                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">

                    <ClipboardDocumentListIcon className="w-5 h-5 text-purple-600" />

                  </div>

                </div>

                {medicalHistory.length ===
                0 ? (

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 text-center">

                    <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300 mx-auto" />

                    <h4 className="font-semibold text-gray-700 mt-4">
                      No medical history
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      No medical records have been added for this patient yet.
                    </p>

                    <button
                      onClick={() =>
                        setShowForm(true)
                      }
                      className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
                    >

                      <PlusIcon className="w-5 h-5" />

                      Add First Record

                    </button>

                  </div>

                ) : (

                  <div className="space-y-5">

                    {medicalHistory.map(
                      (record) => (

                        <div
                          key={record.id}
                          className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition"
                        >

                          {/* RECORD HEADER */}

                          <div className="bg-gray-50 px-5 py-4 flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">

                                <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />

                              </div>

                              <div>

                                <p className="font-semibold text-gray-900">
                                  Medical Record #
                                  {record.id}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {record.created_at
                                    ? new Date(
                                        record.created_at
                                      ).toLocaleString()
                                    : "Date unavailable"}
                                </p>

                              </div>

                            </div>

                          </div>

                          {/* RECORD CONTENT */}

                          <div className="p-5 space-y-4">

                            {/* DIAGNOSIS */}

                            <div>

                              <div className="flex items-center gap-2 mb-2">

                                <HeartIcon className="w-5 h-5 text-red-500" />

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                  Diagnosis
                                </p>

                              </div>

                              <div className="bg-red-50 border border-red-100 rounded-xl p-4">

                                <p className="text-gray-800 font-medium">
                                  {record.diagnosis ||
                                    "N/A"}
                                </p>

                              </div>

                            </div>

                            {/* SYMPTOMS */}

                            <div>

                              <div className="flex items-center gap-2 mb-2">

                                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                  Symptoms
                                </p>

                              </div>

                              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">

                                <p className="text-gray-700">
                                  {record.symptoms ||
                                    "N/A"}
                                </p>

                              </div>

                            </div>

                            {/* TREATMENT */}

                            <div>

                              <div className="flex items-center gap-2 mb-2">

                                <BeakerIcon className="w-5 h-5 text-green-600" />

                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                  Treatment
                                </p>

                              </div>

                              <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                                <p className="text-gray-700">
                                  {record.treatment ||
                                    "N/A"}
                                </p>

                              </div>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default DoctorPatients;