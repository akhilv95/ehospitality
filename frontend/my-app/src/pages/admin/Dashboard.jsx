import { useEffect, useState } from "react";
import RevenueChart from "../../components/dashboard/RevenueChart";
import AppointmentChart from "../../components/dashboard/AppointmentChart";
import RecentAppointments from "../../components/dashboard/RecentAppointments";
import RecentPatients from "../../components/dashboard/RecentPatients";
import RecentPayments from "../../components/dashboard/RecentPayments";
import NotificationPanel from "../../components/dashboard/NotificationPanel";
import StatsCards from "../../components/dashboard/StatsCards";

import {
  doctorAPI,
  patientAPI,
  appointmentAPI,
  billingAPI,
} from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [patients,setPatients]=useState([]);
  const [payments,setPayments]=useState([]);

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        doctors,
        patients,
        appointments,
        invoices,
      ] = await Promise.all([
        doctorAPI.getAll(),
        patientAPI.getAll(),
        appointmentAPI.getAll(),
        billingAPI.getInvoices(),
      ]);

      const doctorCount =
        doctors.data.count ??
        doctors.data.results?.length ??
        doctors.data.length ??
        0;

      const patientCount =
        patients.data.count ??
        patients.data.results?.length ??
        patients.data.length ??
        0;

      const appointmentCount =
        appointments.data.count ??
        appointments.data.results?.length ??
        appointments.data.length ??
        0;

      const invoiceList =
        invoices.data.results ??
        invoices.data ??
        [];

      const revenue = invoiceList.reduce(
        (sum, invoice) => sum + Number(invoice.amount_paid),
        0
      );

      setStats({
        doctors: doctorCount,
        patients: patientCount,
        appointments: appointmentCount,
        revenue,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  setAppointments(
  appointments.data.results ??
  appointments.data ??
  []
);

setInvoices(
  invoiceList
);
setPatients(
    patientsResponse.data.results ??
    patientsResponse.data ??
    []
);

setPayments(
    paymentsResponse.data.results ??
    paymentsResponse.data ??
    []
);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="p-8 bg-slate-100 min-h-screen">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Hospital Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back Admin 👋
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-6">

        <RevenueChart invoices={invoices} />

        <div className="bg-white rounded-2xl shadow-lg h-96 flex items-center justify-center">
          Appointment Chart
        </div>

      </div>

      <div className="mt-10 grid grid-cols-1 xl:grid-cols-2 gap-6">

        <AppointmentChart appointments={appointments} />

        <RecentAppointments appointments={appointments} />

<RecentPatients patients={patients} />

<RecentPayments payments={payments} />

<NotificationPanel />

      </div>

    </div>
  );
};

export default Dashboard;