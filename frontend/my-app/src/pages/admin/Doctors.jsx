import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { doctorAPI } from "../../services/api";
import toast from "react-hot-toast";

const Doctors = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  // Add Doctor
const [addModal, setAddModal] = useState(false);
const [adding, setAdding] = useState(false);

const [specializations, setSpecializations] = useState([]);

const [addData, setAddData] = useState({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  license_number: "",
  qualifications: "",
  experience_years: 0,
  consultation_fee: "",
  specializations: [],
  bio:"",
});

  // View
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  // Edit
  const [editModal, setEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    license_number: "",
    qualifications: "",
    experience_years: "",
    consultation_fee: "",
    bio: "",
    is_available: true,
  });
const handleAddDoctor = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    const payload = {
      first_name: addData.first_name,
      last_name: addData.last_name,
      email: addData.email,
      password: addData.password,
      phone: addData.phone,
      license_number: addData.license_number,
      qualifications: addData.qualifications,
      experience_years: Number(addData.experience_years),
      consultation_fee: addData.consultation_fee,
      specializations: addData.specializations,
      bio: addData.bio,
    };

    console.log("Creating doctor:", payload);

    const response = await doctorAPI.adminCreate(payload);

    console.log("Create doctor response:", response);
    console.log("Created doctor:", response.data);

    // Add the newly created doctor directly to the list
    if (response.data) {
      setDoctors((current) => [
        ...current,
        response.data,
      ]);
    }

    toast.success("Doctor created successfully");

    setAddModal(false);

    setAddData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      license_number: "",
      qualifications: "",
      experience_years: 0,
      consultation_fee: "",
      specializations: [],
      bio: "",
    });

  } catch (error) {

    console.error(
      "Create doctor error:",
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.detail ||
      error.response?.data?.error ||
      "Failed to create doctor"
    );

  } finally {
    setSaving(false);
  }
};

const loadSpecializations = async () => {
  try {
    const response =
      await doctorAPI.getSpecializations();

    setSpecializations(
      response.data.results ??
      response.data ??
      []
    );
  } catch (error) {
    console.error(
      "Specialization error:",
      error.response?.data || error
    );

    toast.error(
      "Failed to load specializations"
    );
  }
};


  // ==========================================
  // LOAD DOCTORS
  // ==========================================

  useEffect(() => {
  loadDoctors();
  loadSpecializations();
}, []);
  
  const handleAddChange = (e) => {
  const { name, value } = e.target;

  setAddData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleSpecializationChange = (e) => {
  const values = Array.from(
    e.target.selectedOptions,
    (option) => Number(option.value)
  );

  setAddData((prev) => ({
    ...prev,
    specializations: values,
  }));
};


  const loadDoctors = async () => {
    try {
      setLoading(true);

      // IMPORTANT:
      // Use Admin API instead of public doctor API
      const res = await doctorAPI.adminGetAll();

      const list =
        res.data.results ??
        res.data ??
        [];

      setDoctors(list);
    } catch (err) {
      console.error(
        "Load doctors error:",
        err.response?.data || err
      );

      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VIEW DOCTOR
  // ==========================================

  const handleView = async (id) => {
    try {
      const response =
        await doctorAPI.adminGetById(id);

      setSelectedDoctor(response.data);
      setViewModal(true);
    } catch (error) {
      console.error(
        "View doctor error:",
        error.response?.data || error
      );

      toast.error("Failed to load doctor details");
    }
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);

    setEditData({
      first_name:
        doctor.first_name ||
        doctor.user?.first_name ||
        "",

      last_name:
        doctor.last_name ||
        doctor.user?.last_name ||
        "",

      email:
        doctor.email ||
        doctor.user?.email ||
        "",

      phone:
        doctor.phone ||
        doctor.user?.phone ||
        "",

      license_number:
        doctor.license_number || "",

      qualifications:
        doctor.qualifications || "",

      experience_years:
        doctor.experience_years ?? "",

      consultation_fee:
        doctor.consultation_fee ?? "",

      bio:
        doctor.bio || "",

      is_available:
        doctor.is_available ?? true,
    });

    setEditModal(true);
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };



  // ==========================================
  // UPDATE DOCTOR
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        first_name: editData.first_name,
        last_name: editData.last_name,
        email: editData.email,
        phone: editData.phone,

        license_number:
          editData.license_number,

        qualifications:
          editData.qualifications,

        experience_years:
          Number(editData.experience_years),

        consultation_fee:
          editData.consultation_fee,

        bio:
          editData.bio,

        is_available:
          editData.is_available,
      };

      await doctorAPI.adminUpdate(
        selectedDoctor.id,
        payload
      );

      toast.success(
        "Doctor updated successfully"
      );

      setEditModal(false);
      setSelectedDoctor(null);

      await loadDoctors();
    } catch (error) {
      console.error(
        "Update doctor error:",
        error.response?.data || error
      );

      const errorData =
        error.response?.data;

      if (typeof errorData === "object") {
        Object.entries(errorData).forEach(
          ([field, messages]) => {
            const message = Array.isArray(messages)
              ? messages.join(", ")
              : messages;

            toast.error(
              `${field}: ${message}`
            );
          }
        );
      } else {
        toast.error(
          "Failed to update doctor"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE DOCTOR
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor? This will also delete the doctor's login account."
    );

    if (!confirmed) {
      return;
    }

    try {
      await doctorAPI.adminDelete(id);

      toast.success(
        "Doctor deleted successfully"
      );

      setDoctors((current) =>
        current.filter(
          (doctor) => doctor.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete doctor error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "Failed to delete doctor"
      );
    }
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const fullName =
        doctor.full_name ||
        `${doctor.first_name || ""} ${
          doctor.last_name || ""
        }` ||
        `${doctor.user?.first_name || ""} ${
          doctor.user?.last_name || ""
        }`;

      const email =
        doctor.email ||
        doctor.user?.email ||
        "";

      const matchesSearch =
        fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesAvailability =
        availability === "all"
          ? true
          : availability === "available"
          ? doctor.is_available
          : !doctor.is_available;

      return (
        matchesSearch &&
        matchesAvailability
      );
    });
  }, [
    search,
    availability,
    doctors,
  ]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <p className="text-gray-600">
          Loading Doctors...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-8 bg-slate-100 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Doctor Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all doctors
          </p>
        </div>

        <button
  type="button"
  onClick={() => setAddModal(true)}
  className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700"
>
  <PlusIcon className="w-5 h-5" />
  Add Doctor
</button>

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Total Doctors
          </h2>

          <p className="text-3xl font-bold mt-3">
            {doctors.length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Available
          </h2>

          <p className="text-3xl font-bold text-green-600 mt-3">
            {
              doctors.filter(
                (d) => d.is_available
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Busy
          </h2>

          <p className="text-3xl font-bold text-red-600 mt-3">
            {
              doctors.filter(
                (d) => !d.is_available
              ).length
            }
          </p>
        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-xl shadow p-5 mb-6 flex gap-5">

        <div className="relative flex-1">

          <MagnifyingGlassIcon
            className="w-5 h-5 absolute left-3 top-3 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search Doctor..."
            className="border rounded-lg w-full pl-10 py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <select
          value={availability}
          onChange={(e) =>
            setAvailability(e.target.value)
          }
          className="border rounded-lg px-4"
        >
          <option value="all">
            All
          </option>

          <option value="available">
            Available
          </option>

          <option value="busy">
            Busy
          </option>
        </select>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Doctor
                </th>

                <th className="p-4">
                  Experience
                </th>

                <th className="p-4">
                  Fee
                </th>

                <th className="p-4">
                  Availability
                </th>

                <th className="p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredDoctors.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No doctors found
                  </td>
                </tr>

              ) : (

                filteredDoctors.map(
                  (doctor) => (

                    <tr
                      key={doctor.id}
                      className="border-b hover:bg-slate-50"
                    >

                      {/* DOCTOR */}

                      <td className="p-4">

                        <div>

                          <p className="font-semibold">
                            {doctor.full_name ||
                              `Dr. ${
                                doctor.first_name ||
                                doctor.user?.first_name ||
                                ""
                              } ${
                                doctor.last_name ||
                                doctor.user?.last_name ||
                                ""
                              }`}
                          </p>

                          <p className="text-sm text-gray-500">
                            {doctor.email ||
                              doctor.user?.email ||
                              "-"}
                          </p>

                        </div>

                      </td>

                      {/* EXPERIENCE */}

                      <td className="text-center">
                        {doctor.experience_years ?? 0} yrs
                      </td>

                      {/* FEE */}

                      <td className="text-center">
                        ₹
                        {doctor.consultation_fee ?? "0.00"}
                      </td>

                      {/* AVAILABILITY */}

                      <td className="text-center">

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            doctor.is_available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {doctor.is_available
                            ? "Available"
                            : "Busy"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="p-4">

                        <div className="flex gap-4 justify-center">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(
                                doctor.id
                              )
                            }
                            title="View doctor"
                            className="hover:scale-110 transition"
                          >
                            <EyeIcon className="w-5 h-5 text-blue-600" />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                doctor
                              )
                            }
                            title="Edit doctor"
                            className="hover:scale-110 transition"
                          >
                            <PencilSquareIcon className="w-5 h-5 text-green-600" />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                doctor.id
                              )
                            }
                            title="Delete doctor"
                            className="hover:scale-110 transition"
                          >
                            <TrashIcon className="w-5 h-5 text-red-600" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>
      {/* ================================================= */}
{/* ADD DOCTOR MODAL */}
{/* ================================================= */}

{addModal && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">

    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8">

      {/* HEADER */}

      <div className="flex justify-between items-center p-6 border-b">

        <div>
          <h2 className="text-xl font-bold">
            Add Doctor
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Create a new doctor account
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModal(false)}
        >
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleAddDoctor}
        className="p-6"
      >

        <div className="grid md:grid-cols-2 gap-5">

          {/* FIRST NAME */}

          <div>
            <label className="block text-sm font-medium mb-2">
              First Name *
            </label>

            <input
              type="text"
              name="first_name"
              value={addData.first_name}
              onChange={handleAddChange}
              placeholder="Enter first name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LAST NAME */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Last Name *
            </label>

            <input
              type="text"
              name="last_name"
              value={addData.last_name}
              onChange={handleAddChange}
              placeholder="Enter last name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={addData.email}
              onChange={handleAddChange}
              placeholder="doctor@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Password *
            </label>

            <input
              type="password"
              name="password"
              value={addData.password}
              onChange={handleAddChange}
              placeholder="Create login password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={addData.phone}
              onChange={handleAddChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LICENSE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              License Number *
            </label>

            <input
              type="text"
              name="license_number"
              value={addData.license_number}
              onChange={handleAddChange}
              placeholder="Medical license number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* QUALIFICATIONS */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Qualifications
            </label>

            <input
              type="text"
              name="qualifications"
              value={addData.qualifications}
              onChange={handleAddChange}
              placeholder="MBBS, MD, etc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* EXPERIENCE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Experience (Years)
            </label>

            <input
              type="number"
              name="experience_years"
              min="0"
              value={addData.experience_years}
              onChange={handleAddChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CONSULTATION FEE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Consultation Fee *
            </label>

            <input
              type="number"
              name="consultation_fee"
              min="0"
              step="0.01"
              value={addData.consultation_fee}
              onChange={handleAddChange}
              placeholder="500.00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SPECIALIZATIONS */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Specializations
            </label>

            <select
              multiple
              value={addData.specializations.map(
                String
              )}
              onChange={
                handleSpecializationChange
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              {specializations.map(
                (specialization) => (

                  <option
                    key={specialization.id}
                    value={specialization.id}
                  >
                    {specialization.name}
                  </option>

                )
              )}

            </select>

            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple
            </p>

          </div>

          {/* BIO */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium mb-2">
              Bio
            </label>

            <textarea
              name="bio"
              rows="4"
              placeholder="Doctor biography..."
              value={addData.bio || ""}
              onChange={handleAddChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* BUTTONS */}

        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={() => setAddModal(false)}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={adding}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {adding
              ? "Creating..."
              : "Create Doctor"}
          </button>

        </div>

      </form>

    </div>

  </div>

)}





      {/* ================================================= */}
      {/* VIEW DOCTOR MODAL */}
      {/* ================================================= */}

      {viewModal &&
        selectedDoctor && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

              {/* HEADER */}

              <div className="flex justify-between items-center p-6 border-b">

                <h2 className="text-xl font-bold">
                  Doctor Details
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setViewModal(false);
                    setSelectedDoctor(null);
                  }}
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>

              </div>

              {/* DETAILS */}

              <div className="p-6 space-y-5">

                <div>
                  <p className="text-sm text-gray-500">
                    First Name
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.first_name ||
                      selectedDoctor.user?.first_name ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Last Name
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.last_name ||
                      selectedDoctor.user?.last_name ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.email ||
                      selectedDoctor.user?.email ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.phone ||
                      selectedDoctor.user?.phone ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    License Number
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.license_number ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Qualifications
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.qualifications ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Experience
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.experience_years ?? 0} years
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Consultation Fee
                  </p>

                  <p className="font-medium">
                    ₹
                    {selectedDoctor.consultation_fee ||
                      "0.00"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Availability
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.is_available
                      ? "Available"
                      : "Busy"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Bio
                  </p>

                  <p className="font-medium">
                    {selectedDoctor.bio ||
                      "-"}
                  </p>
                </div>

              </div>

              {/* FOOTER */}

              <div className="p-6 border-t flex justify-end">

                <button
                  type="button"
                  onClick={() => {
                    setViewModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      {/* ================================================= */}
      {/* EDIT DOCTOR MODAL */}
      {/* ================================================= */}

      {editModal &&
        selectedDoctor && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

              {/* HEADER */}

              <div className="flex justify-between items-center p-6 border-b">

                <h2 className="text-xl font-bold">
                  Edit Doctor
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setEditModal(false);
                    setSelectedDoctor(null);
                  }}
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>

              </div>

              {/* FORM */}

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

                  {/* LICENSE */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      License Number
                    </label>

                    <input
                      type="text"
                      name="license_number"
                      value={editData.license_number}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {/* QUALIFICATIONS */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Qualifications
                    </label>

                    <input
                      type="text"
                      name="qualifications"
                      value={editData.qualifications}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {/* EXPERIENCE */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Experience (Years)
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="experience_years"
                      value={editData.experience_years}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {/* FEE */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Consultation Fee
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="consultation_fee"
                      value={editData.consultation_fee}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {/* BIO */}

                  <div className="md:col-span-2">

                    <label className="block text-sm font-medium mb-2">
                      Bio
                    </label>

                    <textarea
                      name="bio"
                      rows="4"
                      value={editData.bio}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />

                  </div>

                  {/* AVAILABILITY */}

                  <div className="md:col-span-2">

                    <label className="flex items-center gap-3">

                      <input
                        type="checkbox"
                        name="is_available"
                        checked={
                          editData.is_available
                        }
                        onChange={
                          handleEditChange
                        }
                        className="w-4 h-4"
                      />

                      <span className="font-medium">
                        Doctor is available
                      </span>

                    </label>

                  </div>

                </div>

                {/* FORM BUTTONS */}

                <div className="flex justify-end gap-3 mt-8">

                  <button
                    type="button"
                    onClick={() => {
                      setEditModal(false);
                      setSelectedDoctor(null);
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

export default Doctors;