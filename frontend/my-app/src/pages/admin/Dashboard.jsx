import { useEffect, useState } from "react";
import {
  doctorAPI,
  patientAPI,
  appointmentAPI,
  billingAPI,
} from "../../services/api";

import StatsCards from "../../components/dashboard/StatsCards";
import RevenueChart from "../../components/dashboard/RevenueChart";
import AppointmentChart from "../../components/dashboard/AppointmentChart";
import RecentAppointments from "../../components/dashboard/RecentAppointments";
import RecentPatients from "../../components/dashboard/RecentPatients";
import RecentPayments from "../../components/dashboard/RecentPayments";
import NotificationPanel from "../../components/dashboard/NotificationPanel";
//import QuickActions from "../../components/dashboard/QuickActions";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const getList = (response) => {
    if (!response?.data) return [];
    if (Array.isArray(response.data)) return response.data;
    return response.data.results || [];
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [
        doctorRes,
        patientRes,
        appointmentRes,
        invoiceRes,
        paymentRes,
      ] = await Promise.all([
        doctorAPI.getAll(),
        patientAPI.getAll(),
        appointmentAPI.getAll(),
        billingAPI.getInvoices(),
        billingAPI.getPayments(),
      ]);

      const doctorList = getList(doctorRes);
      const patientList = getList(patientRes);
      const appointmentList = getList(appointmentRes);
      const invoiceList = getList(invoiceRes);
      const paymentList = getList(paymentRes);

      const revenue = invoiceList.reduce(
        (sum, item) => sum + Number(item.amount_paid || 0),
        0
      );
      console.log({
  doctors: doctorRes.data,
  patients: patientRes.data,
  appointments: appointmentRes.data,
  invoices: invoiceRes.data,
});

      setStats({
        doctors: doctorRes.data?.count ?? doctorList.length,
        patients: patientRes.data?.count ?? patientList.length,
        appointments:
          appointmentRes.data?.count ?? appointmentList.length,
        revenue,
      });

      setAppointments(appointmentList);
      setPatients(patientList);
      setInvoices(invoiceList);
      setPayments(paymentList);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg px-8 py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Hospital Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back Administrator 👋
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
        >
          Refresh
        </button>

      </div>

      {/* Statistics */}
     <div className="grid grid-cols-4 gap-4 mb-8">
  <div className="bg-red-500 text-white p-6 rounded">
    Doctors: {stats.doctors}
  </div>

  <div className="bg-green-500 text-white p-6 rounded">
    Patients: {stats.patients}
  </div>

  <div className="bg-blue-500 text-white p-6 rounded">
    Appointments: {stats.appointments}
  </div>

  <div className="bg-purple-500 text-white p-6 rounded">
    Revenue: ₹{stats.revenue}
  </div>
</div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <RevenueChart invoices={invoices} />

        <AppointmentChart appointments={appointments} />

      </div>

     

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <RecentAppointments appointments={appointments} />

        <RecentPatients patients={patients} />

      </div>

      {/* Payments + Notifications */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <RecentPayments payments={payments} />

        <NotificationPanel />

      </div>

    </div>
  );
};

export default Dashboard;