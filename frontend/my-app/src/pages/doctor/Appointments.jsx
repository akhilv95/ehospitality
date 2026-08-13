import { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { appointmentAPI } from "../../services/api";
import toast from "react-hot-toast";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await appointmentAPI.getAll();

      console.log("Appointments:", res.data);

      setAppointments(
        res.data.results || res.data || []
      );
    } catch (error) {
      console.log(
        "Appointment error:",
        error.response?.data || error
      );

      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // CONFIRM
  // ---------------------------------------

  const confirmAppointment = async (id) => {
    try {
      await appointmentAPI.confirm(id);

      toast.success("Appointment confirmed");

      fetchAppointments();
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.detail ||
          "Failed to confirm appointment"
      );
    }
  };

  // ---------------------------------------
  // COMPLETE
  // ---------------------------------------

  const completeAppointment = async (id) => {
    try {
      await appointmentAPI.complete(id);

      toast.success("Appointment completed");

      fetchAppointments();
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.detail ||
          "Failed to complete appointment"
      );
    }
  };

  // ---------------------------------------
  // CANCEL
  // ---------------------------------------

  const cancelAppointment = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this appointment?"
      )
    ) {
      return;
    }

    try {
      await appointmentAPI.cancel(id);

      toast.success("Appointment cancelled");

      fetchAppointments();
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.detail ||
          "Failed to cancel appointment"
      );
    }
  };

  // ---------------------------------------
  // PATIENT NAME
  // ---------------------------------------

  const getPatientName = (appointment) => {
    const user =
      appointment.patient_detail?.user;

    if (!user) {
      return "Unknown Patient";
    }

    return (
      user.full_name ||
      `${user.first_name || ""} ${
        user.last_name || ""
      }`.trim() ||
      "Unknown Patient"
    );
  };

  // ---------------------------------------
  // FILTER
  // ---------------------------------------

  const filteredAppointments =
    appointments.filter((appointment) => {
      const patientName =
        getPatientName(appointment).toLowerCase();

      const searchMatch =
        patientName.includes(
          search.toLowerCase()
        );

      const statusMatch =
        filter === "all" ||
        appointment.status === filter;

      return searchMatch && statusMatch;
    });

  // ---------------------------------------
  // STATISTICS
  // ---------------------------------------

  const total = appointments.length;

  const scheduled = appointments.filter(
    (a) => a.status === "scheduled"
  ).length;

  const confirmed = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === "cancelled"
  ).length;

  // ---------------------------------------
  // LOADING
  // ---------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">
            Loading appointments...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">

                <CalendarDaysIcon className="w-7 h-7 text-blue-600" />

              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  My Appointments
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage and track your patient appointments
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          STATISTICS
      ========================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        {/* TOTAL */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Appointments
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {total}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

              <CalendarDaysIcon className="w-6 h-6 text-blue-600" />

            </div>

          </div>

        </div>

        {/* SCHEDULED */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Scheduled
              </p>

              <p className="text-3xl font-bold text-orange-500 mt-2">
                {scheduled}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">

              <ClockIcon className="w-6 h-6 text-orange-500" />

            </div>

          </div>

        </div>

        {/* CONFIRMED */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Confirmed
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {confirmed}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

              <CheckCircleIcon className="w-6 h-6 text-green-600" />

            </div>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Completed
              </p>

              <p className="text-3xl font-bold text-purple-600 mt-2">
                {completed}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">

              <ClipboardDocumentCheckIcon className="w-6 h-6 text-purple-600" />

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          SEARCH + FILTER
      ========================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="all">
              All Appointments
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

      {/* =========================================
          APPOINTMENTS
      ========================================= */}

      {filteredAppointments.length === 0 ? (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">

          <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center">

            <CalendarDaysIcon className="w-10 h-10 text-blue-500" />

          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-5">
            No appointments found
          </h3>

          <p className="text-gray-500 mt-2">
            There are no appointments matching your search.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {filteredAppointments.map(
            (appointment) => {

              const patientName =
                getPatientName(
                  appointment
                );

              return (

                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >

                  {/* TOP */}

                  <div className="p-6">

                    <div className="flex items-start justify-between gap-4">

                      {/* PATIENT */}

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">

                          <UserCircleIcon className="w-9 h-9 text-blue-600" />

                        </div>

                        <div>

                          <h3 className="text-lg font-bold text-gray-900">
                            {patientName}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Patient ID: #{appointment.patient}
                          </p>

                        </div>

                      </div>

                      {/* STATUS */}

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          appointment.status ===
                          "scheduled"
                            ? "bg-orange-100 text-orange-700"
                            : appointment.status ===
                              "confirmed"
                            ? "bg-green-100 text-green-700"
                            : appointment.status ===
                              "completed"
                            ? "bg-purple-100 text-purple-700"
                            : appointment.status ===
                              "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >

                        {appointment.status_display ||
                          appointment.status}

                      </span>

                    </div>

                    {/* DATE/TIME */}

                    <div className="grid grid-cols-2 gap-4 mt-6">

                      <div className="bg-blue-50 rounded-xl p-4">

                        <div className="flex items-center gap-2">

                          <CalendarDaysIcon className="w-5 h-5 text-blue-600" />

                          <span className="text-xs font-medium text-gray-500">
                            DATE
                          </span>

                        </div>

                        <p className="font-semibold text-gray-900 mt-2">
                          {appointment.date}
                        </p>

                      </div>

                      <div className="bg-purple-50 rounded-xl p-4">

                        <div className="flex items-center gap-2">

                          <ClockIcon className="w-5 h-5 text-purple-600" />

                          <span className="text-xs font-medium text-gray-500">
                            TIME
                          </span>

                        </div>

                        <p className="font-semibold text-gray-900 mt-2">
                          {appointment.time}
                        </p>

                      </div>

                    </div>

                    {/* REASON */}

                    <div className="mt-5">

                      <p className="text-xs uppercase tracking-wide font-semibold text-gray-400 mb-2">
                        Appointment Reason
                      </p>

                      <div className="bg-gray-50 rounded-xl p-4">

                        <p className="text-gray-700">
                          {appointment.reason ||
                            "No reason provided"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">

                    <div className="flex flex-wrap gap-3">

                      {appointment.status ===
                        "scheduled" && (

                        <button
                          onClick={() =>
                            confirmAppointment(
                              appointment.id
                            )
                          }
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow"
                        >

                          <CheckCircleIcon className="w-5 h-5" />

                          Confirm

                        </button>

                      )}

                      {(appointment.status ===
                        "scheduled" ||
                        appointment.status ===
                          "confirmed") && (

                        <button
                          onClick={() =>
                            completeAppointment(
                              appointment.id
                            )
                          }
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow"
                        >

                          <ClipboardDocumentCheckIcon className="w-5 h-5" />

                          Complete

                        </button>

                      )}

                      {(appointment.status ===
                        "scheduled" ||
                        appointment.status ===
                          "confirmed") && (

                        <button
                          onClick={() =>
                            cancelAppointment(
                              appointment.id
                            )
                          }
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-medium px-4 py-2.5 rounded-xl transition"
                        >

                          <XCircleIcon className="w-5 h-5" />

                          Cancel

                        </button>

                      )}

                    </div>

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
};

export default DoctorAppointments;