import { useEffect, useState } from "react";

import StatsCards from "../../components/dashboard/StatsCards";
import RevenueChart from "../../components/dashboard/RevenueChart";
import AppointmentChart from "../../components/dashboard/AppointmentChart";
import RecentAppointments from "../../components/dashboard/RecentAppointments";
import RecentPatients from "../../components/dashboard/RecentPatients";
import RecentPayments from "../../components/dashboard/RecentPayments";
import NotificationPanel from "../../components/dashboard/NotificationPanel";

import {
  doctorAPI,
  patientAPI,
  appointmentAPI,
  billingAPI,
} from "../../services/api";

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

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
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

      const doctorList =
        doctorRes.data.results ??
        doctorRes.data ??
        [];

      const patientList =
        patientRes.data.results ??
        patientRes.data ??
        [];

      const appointmentList =
        appointmentRes.data.results ??
        appointmentRes.data ??
        [];

      const invoiceList =
        invoiceRes.data.results ??
        invoiceRes.data ??
        [];

      const paymentList =
        paymentRes.data.results ??
        paymentRes.data ??
        [];

      const revenue = invoiceList.reduce(
        (sum, invoice) => sum + Number(invoice.amount_paid || 0),
        0
      );

      setStats({
        doctors: doctorRes.data.count ?? doctorList.length,
        patients: patientRes.data.count ?? patientList.length,
        appointments:
          appointmentRes.data.count ??
          appointmentList.length,
        revenue,
      });

      setAppointments(appointmentList);
      setPatients(patientList);
      setInvoices(invoiceList);
      setPayments(paymentList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Hospital Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back, Administrator 👋
        </p>
      </div>

      {/* Statistics */}
      <StatsCards stats={stats} />

      Charts vanno
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <RevenueChart invoices={invoices} />
        <AppointmentChart appointments={appointments} />
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <RecentAppointments appointments={appointments} />
        <RecentPatients patients={patients} />
      </div>

      {/* Payments + Notifications */}
      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <RecentPayments payments={payments} />
        <NotificationPanel />
      </div> */}

    </div>
  );
};

export default Dashboard;