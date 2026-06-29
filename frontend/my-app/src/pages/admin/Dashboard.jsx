import { useEffect, useState } from "react";
import {
  doctorAPI,
  patientAPI,
  appointmentAPI,
  billingAPI,
} from "../../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        doctorRes,
        patientRes,
        appointmentRes,
        invoiceRes,
      ] = await Promise.all([
        doctorAPI.getAll(),
        patientAPI.getAll(),
        appointmentAPI.getAll(),
        billingAPI.getInvoices(),
      ]);

      const doctors = doctorRes.data.results || doctorRes.data || [];
      const patients = patientRes.data.results || patientRes.data || [];
      const appointments =
        appointmentRes.data.results || appointmentRes.data || [];
      const invoices =
        invoiceRes.data.results || invoiceRes.data || [];

      let revenue = 0;

      invoices.forEach((invoice) => {
        revenue += Number(invoice.amount_paid || 0);
      });

      setStats({
        doctors: doctors.length,
        patients: patients.length,
        appointments: appointments.length,
        revenue,
      });

      setRecentAppointments(appointments.slice(0, 5));
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome to the Hospital Management System
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">
            Doctors
          </h3>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {stats.doctors}
          </h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">
            Patients
          </h3>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {stats.patients}
          </h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">
            Appointments
          </h3>

          <h2 className="text-4xl font-bold text-purple-600 mt-3">
            {stats.appointments}
          </h2>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-500">
            Revenue
          </h3>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            ₹ {stats.revenue}
          </h2>
        </div>

      </div>

      {/* Recent Appointments */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-5">
          Recent Appointments
        </h2>

        {recentAppointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Patient
                </th>

                <th className="text-left">
                  Doctor
                </th>

                <th className="text-left">
                  Date
                </th>

                <th className="text-left">
                  Time
                </th>

                <th className="text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentAppointments.map((appointment) => (

                <tr
                  key={appointment.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3">
                    {appointment.patient_detail?.user?.full_name}
                  </td>

                  <td>
                    Dr. {appointment.doctor_detail?.user?.full_name}
                  </td>

                  <td>
                    {appointment.date}
                  </td>

                  <td>
                    {appointment.time}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm
                      ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.status_display}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
};

export default Dashboard;