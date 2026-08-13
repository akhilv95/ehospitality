import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { appointmentAPI } from "../../services/api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const [completeModal, setCompleteModal] = useState(false);
  const [notes, setNotes] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const response = await appointmentAPI.getAll();

      console.log("Appointments response:", response.data);

      const data =
        response.data?.results ??
        response.data ??
        [];

      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Appointment loading error:",
        error.response?.data || error
      );

      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getPatientName = (appointment) => {
    if (appointment.patient_detail?.user) {
      const user = appointment.patient_detail.user;

      return (
        user.full_name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Unknown Patient"
      );
    }

    if (appointment.patient?.user) {
      const user = appointment.patient.user;

      return (
        user.full_name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Unknown Patient"
      );
    }

    if (appointment.patient_name) {
      return appointment.patient_name;
    }

    return "Unknown Patient";
  };

  const getDoctorName = (appointment) => {
    if (appointment.doctor_detail?.user) {
      const user = appointment.doctor_detail.user;

      return (
        user.full_name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Unknown Doctor"
      );
    }

    if (appointment.doctor?.user) {
      const user = appointment.doctor.user;

      return (
        user.full_name ||
        `Dr. ${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Unknown Doctor"
      );
    }

    if (appointment.doctor_name) {
      return appointment.doctor_name;
    }

    return "Unknown Doctor";
  };

  const getStatus = (appointment) => {
    return (
      appointment.status ||
      appointment.appointment_status ||
      "scheduled"
    ).toLowerCase();
  };

  const getDate = (appointment) => {
    return (
      appointment.date ||
      appointment.appointment_date ||
      "-"
    );
  };

  const getTime = (appointment) => {
    return appointment.time || appointment.appointment_time || "-";
  };

  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName = getPatientName(appointment).toLowerCase();
      const doctorName = getDoctorName(appointment).toLowerCase();

      const searchValue = search.toLowerCase();

      const matchesSearch =
        patientName.includes(searchValue) ||
        doctorName.includes(searchValue);

      const status = getStatus(appointment);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  // --------------------------------------------------
  // View
  // --------------------------------------------------

  const handleView = async (id) => {
    try {
      const response = await appointmentAPI.getById(id);

      setSelectedAppointment(response.data);
      setViewModal(true);
    } catch (error) {
      console.error(
        "View appointment error:",
        error.response?.data || error
      );

      toast.error("Failed to load appointment details");
    }
  };

  // --------------------------------------------------
  // Confirm
  // --------------------------------------------------

  const handleConfirm = async (id) => {
    try {
      setActionLoading(true);

      const response = await appointmentAPI.confirm(id);

      toast.success("Appointment confirmed");

      // Update locally
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                ...(response.data || {}),
                status: response.data?.status || "confirmed",
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(
        "Confirm appointment error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "Failed to confirm appointment"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // Cancel
  // --------------------------------------------------

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const response = await appointmentAPI.cancel(id);

      toast.success("Appointment cancelled");

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                ...(response.data || {}),
                status: response.data?.status || "cancelled",
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "Failed to cancel appointment"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // Complete
  // --------------------------------------------------

  const openCompleteModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNotes("");
    setCompleteModal(true);
  };

  const handleComplete = async (e) => {
    e.preventDefault();

    if (!selectedAppointment) return;

    try {
      setActionLoading(true);

      const response = await appointmentAPI.complete(
        selectedAppointment.id,
        notes
      );

      toast.success("Appointment completed");

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? {
                ...appointment,
                ...(response.data || {}),
                status: response.data?.status || "completed",
                notes:
                  response.data?.notes || notes,
              }
            : appointment
        )
      );

      setCompleteModal(false);
      setSelectedAppointment(null);
      setNotes("");
    } catch (error) {
      console.error(
        "Complete appointment error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.detail ||
          "Failed to complete appointment"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const totalAppointments = appointments.length;

  const scheduledAppointments = appointments.filter(
    (a) => getStatus(a) === "scheduled"
  ).length;

  const confirmedAppointments = appointments.filter(
    (a) => getStatus(a) === "confirmed"
  ).length;

  const completedAppointments = appointments.filter(
    (a) => getStatus(a) === "completed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (a) =>
      getStatus(a) === "cancelled" ||
      getStatus(a) === "canceled"
  ).length;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-gray-600">
          Loading Appointments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all patient appointments
          </p>
        </div>

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Total
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalAppointments}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Scheduled
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {scheduledAppointments}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Confirmed
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {confirmedAppointments}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Completed
          </p>

          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {completedAppointments}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Cancelled
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {cancelledAppointments}
          </h2>
        </div>

      </div>

      {/* SEARCH + FILTER */}

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <MagnifyingGlassIcon
              className="w-5 h-5 absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
          >

            <option value="all">
              All Status
            </option>

            <option value="scheduled">
              Scheduled
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>

          </select>

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
                  Doctor
                </th>

                <th className="text-left p-4">
                  Date
                </th>

                <th className="text-left p-4">
                  Time
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-center p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredAppointments.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-10 text-gray-500"
                  >
                    No appointments found
                  </td>

                </tr>

              ) : (

                filteredAppointments.map(
                  (appointment) => {

                    const status =
                      getStatus(appointment);

                    return (
                      <tr
                        key={appointment.id}
                        className="border-b hover:bg-slate-50"
                      >

                        {/* PATIENT */}

                        <td className="p-4">

                          <p className="font-semibold text-gray-900">
                            {getPatientName(
                              appointment
                            )}
                          </p>

                        </td>

                        {/* DOCTOR */}

                        <td className="p-4">

                          <p className="font-medium">
                            {getDoctorName(
                              appointment
                            )}
                          </p>

                        </td>

                        {/* DATE */}

                        <td className="p-4">
                          {getDate(appointment)}
                        </td>

                        {/* TIME */}

                        <td className="p-4">
                          {getTime(appointment)}
                        </td>

                        {/* STATUS */}

                        <td className="p-4">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              status === "scheduled"
                                ? "bg-blue-100 text-blue-700"
                                : status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : status === "completed"
                                ? "bg-purple-100 text-purple-700"
                                : status === "cancelled" ||
                                  status === "canceled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {status
                              .charAt(0)
                              .toUpperCase() +
                              status.slice(1)}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="p-4">

                          <div className="flex gap-3 justify-center">

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  appointment.id
                                )
                              }
                              title="View"
                              className="hover:scale-110 transition"
                            >
                              <EyeIcon className="w-5 h-5 text-blue-600" />
                            </button>

                            {/* CONFIRM */}

                            {status ===
                              "scheduled" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleConfirm(
                                    appointment.id
                                  )
                                }
                                title="Confirm"
                                disabled={
                                  actionLoading
                                }
                                className="hover:scale-110 transition"
                              >
                                <CheckIcon className="w-5 h-5 text-green-600" />
                              </button>
                            )}

                            {/* COMPLETE */}

                            {status ===
                              "confirmed" && (
                              <button
                                type="button"
                                onClick={() =>
                                  openCompleteModal(
                                    appointment
                                  )
                                }
                                title="Complete"
                                disabled={
                                  actionLoading
                                }
                                className="hover:scale-110 transition"
                              >
                                <PencilSquareIcon className="w-5 h-5 text-purple-600" />
                              </button>
                            )}

                            {/* CANCEL */}

                            {(status ===
                              "scheduled" ||
                              status ===
                                "confirmed") && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancel(
                                    appointment.id
                                  )
                                }
                                title="Cancel"
                                disabled={
                                  actionLoading
                                }
                                className="hover:scale-110 transition"
                              >
                                <XMarkIcon className="w-5 h-5 text-red-600" />
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* VIEW MODAL */}

      {viewModal &&
        selectedAppointment && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

              <div className="flex justify-between items-center p-6 border-b">

                <h2 className="text-xl font-bold">
                  Appointment Details
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setViewModal(false)
                  }
                  className="text-gray-500 hover:text-gray-800"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

              </div>

              <div className="p-6 space-y-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Patient
                  </p>

                  <p className="font-semibold">
                    {getPatientName(
                      selectedAppointment
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Doctor
                  </p>

                  <p className="font-semibold">
                    {getDoctorName(
                      selectedAppointment
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Date
                    </p>

                    <p className="font-medium">
                      {getDate(
                        selectedAppointment
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Time
                    </p>

                    <p className="font-medium">
                      {getTime(
                        selectedAppointment
                      )}
                    </p>
                  </div>

                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <p className="font-medium capitalize">
                    {getStatus(
                      selectedAppointment
                    )}
                  </p>
                </div>

                {selectedAppointment.reason && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Reason
                    </p>

                    <p>
                      {selectedAppointment.reason}
                    </p>
                  </div>
                )}

                {selectedAppointment.notes && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Notes
                    </p>

                    <p>
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      {/* COMPLETE MODAL */}

      {completeModal &&
        selectedAppointment && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

              <div className="flex justify-between items-center p-6 border-b">

                <h2 className="text-xl font-bold">
                  Complete Appointment
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setCompleteModal(false)
                  }
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>

              </div>

              <form
                onSubmit={handleComplete}
                className="p-6"
              >

                <p className="text-gray-600 mb-4">
                  Add completion notes for this appointment.
                </p>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  rows="5"
                  placeholder="Enter appointment notes..."
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end gap-3 mt-5">

                  <button
                    type="button"
                    onClick={() =>
                      setCompleteModal(false)
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    {actionLoading
                      ? "Completing..."
                      : "Complete Appointment"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

    </div>
  );
};

export default Appointments;