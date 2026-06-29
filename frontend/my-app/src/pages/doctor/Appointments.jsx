import { useEffect, useState } from "react";
import { appointmentAPI } from "../../services/api";
import toast from "react-hot-toast";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentAPI.getAll();
      setAppointments(res.data.results || res.data || []);
    } catch (error) {
      toast.error("Failed to load appointments");
    }
  };

  const confirmAppointment = async (id) => {
    try {
      await appointmentAPI.confirm(id);

      toast.success("Appointment confirmed");

      fetchAppointments();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to confirm appointment");
    }
  };

  const completeAppointment = async (id) => {
    try {
      await appointmentAPI.complete(id);

      toast.success("Appointment completed");

      fetchAppointments();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to complete appointment");
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await appointmentAPI.cancel(id);

      toast.success("Appointment cancelled");

      fetchAppointments();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Failed to cancel appointment");
    }
  };

  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-6">
        Scheduled Appointments
      </h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="space-y-5">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-5 shadow-sm"
            >
              <p>
                <strong>Patient:</strong>{" "}
                {appointment.patient_detail?.user?.full_name}
              </p>

              <p>
                <strong>Date:</strong> {appointment.date}
              </p>

              <p>
                <strong>Time:</strong> {appointment.time}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {appointment.status_display}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {appointment.reason || "N/A"}
              </p>

              <div className="flex gap-3 mt-5">

                {appointment.status === "scheduled" && (
                  <button
                    onClick={() =>
                      confirmAppointment(appointment.id)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Confirm
                  </button>
                )}

                {(appointment.status === "scheduled" ||
                  appointment.status === "confirmed") && (
                  <button
                    onClick={() =>
                      completeAppointment(appointment.id)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Complete
                  </button>
                )}

                {(appointment.status === "scheduled" ||
                  appointment.status === "confirmed") && (
                  <button
                    onClick={() =>
                      cancelAppointment(appointment.id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;