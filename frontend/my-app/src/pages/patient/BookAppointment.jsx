import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  UserIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  doctorAPI,
  appointmentAPI,
  facilityAPI,
} from "../../services/api";
import toast from "react-hot-toast";
import { format, addDays } from "date-fns";

const BookAppointment = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedDoctor = watch("doctor");
  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const selectedType = watch("appointment_type");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  const fetchInitialData = async () => {
    try {
      const [doctorsRes, departmentsRes] =
        await Promise.all([
          doctorAPI.getAll(),
          facilityAPI.getDepartments(),
        ]);

      setDoctors(
        doctorsRes.data.results ||
          doctorsRes.data ||
          []
      );

      setDepartments(
        departmentsRes.data.results ||
          departmentsRes.data ||
          []
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctors and departments");
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);

    try {
      const response =
        await doctorAPI.getAvailableSlots(
          selectedDoctor,
          selectedDate
        );

      setAvailableSlots(
        response.data.slots || []
      );
    } catch (error) {
      console.error(
        "Available slots error:",
        error.response?.data || error
      );

      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await appointmentAPI.create({
        doctor: parseInt(data.doctor),
        department: data.department
          ? parseInt(data.department)
          : null,
        date: data.date,
        time: data.time,
        appointment_type:
          data.appointment_type,
        reason: data.reason,
      });

      toast.success(
        "Appointment booked successfully!"
      );

      navigate("/patient/appointments");
    } catch (error) {
      console.error(
        "Booking error:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        "Failed to book appointment";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const minDate = format(
    new Date(),
    "yyyy-MM-dd"
  );

  const maxDate = format(
    addDays(new Date(), 30),
    "yyyy-MM-dd"
  );

  const selectedDoctorData = doctors.find(
    (doctor) =>
      String(doctor.id) === String(selectedDoctor)
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-10">

      <div className="max-w-6xl mx-auto">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate("/patient/appointments")
            }
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-5"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Appointments
          </button>

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">

              <CalendarDaysIcon className="w-8 h-8 text-blue-600" />

            </div>

            <div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Book an Appointment
              </h1>

              <p className="text-gray-500 mt-1">
                Schedule an appointment with one of our doctors
              </p>

            </div>

          </div>

        </div>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===================================
              FORM
          =================================== */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >

              {/* FORM HEADER */}

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">

                <div className="flex items-center gap-3">

                  <ClipboardDocumentCheckIcon className="w-7 h-7" />

                  <div>

                    <h2 className="text-xl font-bold">
                      Appointment Details
                    </h2>

                    <p className="text-blue-100 text-sm mt-1">
                      Please provide the details for your visit
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6 md:p-8 space-y-7">

                {/* =================================
                    DOCTOR
                ================================= */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">

                    <UserIcon className="w-5 h-5 text-blue-600" />

                    Select Doctor

                    <span className="text-red-500">
                      *
                    </span>

                  </label>

                  <select
                    {...register("doctor", {
                      required:
                        "Please select a doctor",
                    })}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.doctor
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >

                    <option value="">
                      Choose a doctor
                    </option>

                    {doctors.map((doctor) => (

                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.full_name}
                        {doctor.specializations?.length
                          ? ` - ${doctor.specializations
                              .map(
                                (s) => s.name
                              )
                              .join(", ")}`
                          : ""}
                      </option>

                    ))}

                  </select>

                  {errors.doctor && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.doctor.message}
                    </p>
                  )}

                </div>

                {/* SELECTED DOCTOR PREVIEW */}

                {selectedDoctorData && (

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">

                        <UserIcon className="w-8 h-8 text-blue-600" />

                      </div>

                      <div className="flex-1">

                        <h3 className="font-bold text-gray-900">
                          {selectedDoctorData.full_name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">

                          {selectedDoctorData.specializations
                            ?.map((s) => s.name)
                            .join(", ") ||
                            "Medical Specialist"}

                        </p>

                        {selectedDoctorData.consultation_fee && (

                          <p className="text-sm font-semibold text-blue-600 mt-1">
                            Consultation Fee: ₹
                            {
                              selectedDoctorData.consultation_fee
                            }
                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                )}

                {/* =================================
                    DEPARTMENT
                ================================= */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">

                    <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />

                    Department

                  </label>

                  <select
                    {...register("department")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >

                    <option value="">
                      Select department (optional)
                    </option>

                    {departments.map((dept) => (

                      <option
                        key={dept.id}
                        value={dept.id}
                      >
                        {dept.name}
                      </option>

                    ))}

                  </select>

                </div>

                {/* =================================
                    DATE
                ================================= */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">

                    <CalendarDaysIcon className="w-5 h-5 text-blue-600" />

                    Preferred Date

                    <span className="text-red-500">
                      *
                    </span>

                  </label>

                  <input
                    type="date"
                    {...register("date", {
                      required:
                        "Please select a date",
                    })}
                    min={minDate}
                    max={maxDate}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.date
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  />

                  <p className="text-xs text-gray-400 mt-2">
                    You can book an appointment within the next 30 days.
                  </p>

                  {errors.date && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.date.message}
                    </p>
                  )}

                </div>

                {/* =================================
                    TIME SLOTS
                ================================= */}

                {selectedDoctor &&
                  selectedDate && (

                    <div>

                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                        <ClockIcon className="w-5 h-5 text-blue-600" />

                        Available Time Slots

                        <span className="text-red-500">
                          *
                        </span>

                      </label>

                      {loadingSlots ? (

                        <div className="bg-gray-50 rounded-2xl p-10 text-center">

                          <div className="w-9 h-9 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                          <p className="text-gray-500 mt-3 text-sm">
                            Checking available slots...
                          </p>

                        </div>

                      ) : availableSlots.length ===
                        0 ? (

                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">

                          <ClockIcon className="w-8 h-8 text-orange-500 mx-auto" />

                          <p className="font-medium text-orange-800 mt-2">
                            No available slots
                          </p>

                          <p className="text-sm text-orange-600 mt-1">
                            Please select another date.
                          </p>

                        </div>

                      ) : (

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                          {availableSlots.map(
                            (slot) => (

                              <label
                                key={slot}
                                className={`relative cursor-pointer rounded-xl border-2 p-3 text-center font-medium transition-all duration-200 ${
                                  selectedTime ===
                                  slot
                                    ? "border-blue-600 bg-blue-600 text-white shadow-md scale-[1.02]"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                                }`}
                              >

                                <input
                                  type="radio"
                                  {...register(
                                    "time",
                                    {
                                      required:
                                        "Please select a time slot",
                                    }
                                  )}
                                  value={slot}
                                  className="sr-only"
                                />

                                <ClockIcon
                                  className={`w-5 h-5 mx-auto mb-1 ${
                                    selectedTime ===
                                    slot
                                      ? "text-white"
                                      : "text-blue-500"
                                  }`}
                                />

                                {slot}

                              </label>

                            )
                          )}

                        </div>

                      )}

                      {errors.time && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.time.message}
                        </p>
                      )}

                    </div>

                  )}

                {/* =================================
                    APPOINTMENT TYPE
                ================================= */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">

                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-600" />

                    Appointment Type

                    <span className="text-red-500">
                      *
                    </span>

                  </label>

                  <select
                    {...register(
                      "appointment_type",
                      {
                        required:
                          "Please select appointment type",
                      }
                    )}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >

                    <option value="consultation">
                      Consultation
                    </option>

                    <option value="follow_up">
                      Follow Up
                    </option>

                    <option value="checkup">
                      Checkup
                    </option>

                    <option value="emergency">
                      Emergency
                    </option>

                  </select>

                  {errors.appointment_type && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.appointment_type.message}
                    </p>
                  )}

                </div>

                {/* TYPE INFO */}

                {selectedType && (

                  <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">

                    <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />

                    <p className="text-sm text-blue-700">

                      {selectedType ===
                        "consultation" &&
                        "A general consultation with your selected doctor."}

                      {selectedType ===
                        "follow_up" &&
                        "A follow-up appointment for an existing condition or treatment."}

                      {selectedType ===
                        "checkup" &&
                        "A routine health checkup."}

                      {selectedType ===
                        "emergency" &&
                        "For urgent medical concerns. Please contact emergency services for life-threatening situations."}

                    </p>

                  </div>

                )}

                {/* =================================
                    REASON
                ================================= */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">

                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-600" />

                    Reason for Visit

                  </label>

                  <textarea
                    {...register("reason")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    placeholder="Briefly describe your symptoms or reason for your visit..."
                  />

                  <p className="text-xs text-gray-400 mt-2">
                    Please provide relevant information to help the doctor prepare for your visit.
                  </p>

                </div>

                {/* =================================
                    BUTTONS
                ================================= */}

                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-gray-100">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/patient/appointments"
                      )
                    }
                    className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      availableSlots.length === 0
                    }
                    className="flex-1 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >

                    {loading ? (

                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                        Booking...
                      </>

                    ) : (

                      <>
                        <CalendarDaysIcon className="w-5 h-5" />

                        Book Appointment
                      </>

                    )}

                  </button>

                </div>

              </div>

            </form>

          </div>

          {/* ===================================
              RIGHT SIDE SUMMARY
          =================================== */}

          <div className="lg:col-span-1">

            <div className="lg:sticky lg:top-6 space-y-5">

              {/* SUMMARY CARD */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white">

                  <h2 className="font-bold text-lg">
                    Appointment Summary
                  </h2>

                  <p className="text-blue-100 text-sm mt-1">
                    Review your selection
                  </p>

                </div>

                <div className="p-6 space-y-5">

                  {/* DOCTOR */}

                  <div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Doctor
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">

                      {selectedDoctorData
                        ? selectedDoctorData.full_name
                        : "Not selected"}

                    </p>

                  </div>

                  {/* DATE */}

                  <div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Date
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">

                      {selectedDate ||
                        "Not selected"}

                    </p>

                  </div>

                  {/* TIME */}

                  <div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Time
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">

                      {selectedTime ||
                        "Not selected"}

                    </p>

                  </div>

                  {/* TYPE */}

                  <div>

                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                      Appointment Type
                    </p>

                    <p className="font-semibold text-gray-900 mt-1 capitalize">

                      {selectedType
                        ?.replace("_", " ") ||
                        "Consultation"}

                    </p>

                  </div>

                </div>

              </div>

              {/* INFO CARD */}

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

                <div className="flex gap-3">

                  <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />

                  <div>

                    <h3 className="font-semibold text-blue-900">
                      Before your appointment
                    </h3>

                    <ul className="text-sm text-blue-700 mt-3 space-y-2">

                      <li>
                        • Arrive 10 minutes early.
                      </li>

                      <li>
                        • Bring your medical documents if required.
                      </li>

                      <li>
                        • Keep your appointment details available.
                      </li>

                      <li>
                        • Contact the hospital if you need to reschedule.
                      </li>

                    </ul>

                  </div>

                </div>

              </div>

              {/* SECURITY / HELP */}

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

                <p className="text-sm text-gray-500 leading-relaxed">
                  Your appointment information is securely handled and is only accessible to authorized healthcare professionals.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookAppointment;