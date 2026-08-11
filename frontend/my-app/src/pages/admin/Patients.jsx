import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { patientAPI } from "../../services/api";
import toast from "react-hot-toast";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    blood_group: "",
    height: "",
    weight: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    insurance_provider: "",
    insurance_policy_number: "",
  });

  useEffect(() => {
    loadPatients();
  }, []);

  // ============================
  // LOAD PATIENTS
  // ============================

  const loadPatients = async () => {
    try {
      setLoading(true);

      const res = await patientAPI.getAll();

      setPatients(res.data.results ?? res.data ?? []);
    } catch (err) {
      console.error(
        "Load patients error:",
        err.response?.data || err
      );

      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // VIEW PATIENT
  // ============================

  const handleView = async (id) => {
    try {
      const response = await patientAPI.getById(id);

      setSelectedPatient(response.data);
      setViewModal(true);
    } catch (error) {
      console.error(
        "View patient error:",
        error.response?.data || error
      );

      toast.error("Failed to load patient details");
    }
  };

  // ============================
  // EDIT PATIENT
  // ============================

  const handleEdit = (patient) => {
    setSelectedPatient(patient);

    setEditData({
      first_name: patient.user?.first_name || "",
      last_name: patient.user?.last_name || "",
      email: patient.user?.email || "",
      phone: patient.user?.phone || "",
      blood_group: patient.blood_group || "",
      height: patient.height || "",
      weight: patient.weight || "",
      emergency_contact_name:
        patient.emergency_contact_name || "",
      emergency_contact_phone:
        patient.emergency_contact_phone || "",
      insurance_provider:
        patient.insurance_provider || "",
      insurance_policy_number:
        patient.insurance_policy_number || "",
    });

    setEditModal(true);
  };

  // ============================
  // HANDLE INPUT
  // ============================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // UPDATE PATIENT
  // ============================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      return;
    }

    try {
      setSaving(true);

      await patientAPI.update(
        selectedPatient.id,
        editData
      );

      toast.success(
        "Patient updated successfully"
      );

      setEditModal(false);
      setSelectedPatient(null);

      await loadPatients();
    } catch (error) {
      console.error(
        "Update patient error:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.detail ||
        error.response?.data ||
        "Failed to update patient";

      toast.error(
        typeof message === "string"
          ? message
          : "Failed to update patient"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // DELETE PATIENT
  // ============================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await patientAPI.delete(id);

      toast.success(
        "Patient deleted successfully"
      );

      setPatients((current) =>
        current.filter(
          (patient) => patient.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete patient error:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.detail ||
        "Failed to delete patient";

      toast.error(message);
    }
  };

  // ============================
  // SEARCH
  // ============================

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const name =
        patient.user?.full_name ||
        `${patient.user?.first_name || ""} ${
          patient.user?.last_name || ""
        }`;

      const searchValue =
        search.toLowerCase();

      return (
        name
          .toLowerCase()
          .includes(searchValue) ||
        patient.user?.email
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [patients, search]);

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">
          Loading Patients...
        </p>
      </div>
    );
  }

  // ============================
  // UI
  // ============================

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Patient Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage registered patients
        </p>
      </div>

      {/* STATISTICS */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600">
            Total Patients
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {patients.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600">
            Male
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {
              patients.filter(
                (p) => p.gender === "male"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600">
            Female
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {
              patients.filter(
                (p) => p.gender === "female"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="relative">

          <MagnifyingGlassIcon
            className="w-5 h-5 absolute left-3 top-3 text-gray-400"
          />

          <input
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search patient..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="text-left p-4">
                  Patient
                </th>

                <th className="text-left p-4">
                  Email
                </th>

                <th className="text-left p-4">
                  Blood Group
                </th>

                <th className="text-left p-4">
                  Phone
                </th>

                <th className="text-center p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPatients.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No patients found
                  </td>
                </tr>

              ) : (

                filteredPatients.map((patient) => (

                  <tr
                    key={patient.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4">
                      <p className="font-semibold">
                        {patient.user?.full_name ||
                          `${patient.user?.first_name || ""} ${
                            patient.user?.last_name || ""
                          }`}
                      </p>
                    </td>

                    <td className="p-4">
                      {patient.user?.email || "-"}
                    </td>

                    <td className="p-4">
                      {patient.blood_group || "-"}
                    </td>

                    <td className="p-4">
                      {patient.user?.phone || "-"}
                    </td>

                    {/* ACTIONS */}

                    <td className="p-4">

                      <div className="flex gap-4 justify-center">

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            handleView(patient.id)
                          }
                          title="View patient"
                          className="hover:scale-110 transition"
                        >
                          <EyeIcon className="w-5 h-5 text-blue-600" />
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(patient)
                          }
                          title="Edit patient"
                          className="hover:scale-110 transition"
                        >
                          <PencilSquareIcon className="w-5 h-5 text-green-600" />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(patient.id)
                          }
                          title="Delete patient"
                          className="hover:scale-110 transition"
                        >
                          <TrashIcon className="w-5 h-5 text-red-600" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================================== */}
      {/* VIEW MODAL */}
      {/* ================================================== */}

      {viewModal && selectedPatient && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

            <div className="flex justify-between items-center p-6 border-b">

              <h2 className="text-xl font-bold">
                Patient Details
              </h2>

              <button
                type="button"
                onClick={() => {
                  setViewModal(false);
                  setSelectedPatient(null);
                }}
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>

            </div>

            <div className="p-6 space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  First Name
                </p>

                <p className="font-medium">
                  {selectedPatient.user?.first_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Last Name
                </p>

                <p className="font-medium">
                  {selectedPatient.user?.last_name || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-medium">
                  {selectedPatient.user?.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="font-medium">
                  {selectedPatient.user?.phone || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Blood Group
                </p>

                <p className="font-medium">
                  {selectedPatient.blood_group || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Height
                </p>

                <p className="font-medium">
                  {selectedPatient.height
                    ? `${selectedPatient.height} cm`
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Weight
                </p>

                <p className="font-medium">
                  {selectedPatient.weight
                    ? `${selectedPatient.weight} kg`
                    : "-"}
                </p>
              </div>

            </div>

            <div className="p-6 border-t flex justify-end">

              <button
                type="button"
                onClick={() => {
                  setViewModal(false);
                  setSelectedPatient(null);
                }}
                className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================================================== */}
      {/* EDIT MODAL */}
      {/* ================================================== */}

      {editModal && selectedPatient && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

            <div className="flex justify-between items-center p-6 border-b">

              <h2 className="text-xl font-bold">
                Edit Patient
              </h2>

              <button
                type="button"
                onClick={() => {
                  setEditModal(false);
                  setSelectedPatient(null);
                }}
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>

            </div>

            <form
              onSubmit={handleUpdate}
              className="p-6"
            >

              <div className="grid md:grid-cols-2 gap-5">

                {/* FIRST NAME */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    value={editData.first_name}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* LAST NAME */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    value={editData.last_name}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* BLOOD GROUP */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Blood Group
                  </label>

                  <select
                    name="blood_group"
                    value={editData.blood_group}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">
                      Select Blood Group
                    </option>

                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* HEIGHT */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Height (cm)
                  </label>

                  <input
                    type="number"
                    name="height"
                    value={editData.height}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* WEIGHT */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    name="weight"
                    value={editData.weight}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* EMERGENCY NAME */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Emergency Contact Name
                  </label>

                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={
                      editData.emergency_contact_name
                    }
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* EMERGENCY PHONE */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Emergency Contact Phone
                  </label>

                  <input
                    type="text"
                    name="emergency_contact_phone"
                    value={
                      editData.emergency_contact_phone
                    }
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* INSURANCE */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Insurance Provider
                  </label>

                  <input
                    type="text"
                    name="insurance_provider"
                    value={
                      editData.insurance_provider
                    }
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* POLICY */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Insurance Policy Number
                  </label>

                  <input
                    type="text"
                    name="insurance_policy_number"
                    value={
                      editData.insurance_policy_number
                    }
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 mt-8">

                <button
                  type="button"
                  onClick={() => {
                    setEditModal(false);
                    setSelectedPatient(null);
                  }}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Patients;