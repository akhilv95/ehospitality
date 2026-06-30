import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import {
  doctorAPI,
  patientAPI,
  appointmentAPI,
  billingAPI,
} from "../../services/api";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
];

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  const [statusData, setStatusData] = useState([]);
  const [doctorFeeData, setDoctorFeeData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const getList = (response) => {
    if (!response?.data) return [];
    return response.data.results ?? response.data ?? [];
  };

  const loadAnalytics = async () => {
    try {
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

      const doctors = getList(doctorRes);
      const patients = getList(patientRes);
      const appointments = getList(appointmentRes);
      const invoices = getList(invoiceRes);

      const revenue = invoices.reduce(
        (sum, inv) => sum + Number(inv.amount_paid || 0),
        0
      );

      setStats({
        doctors: doctors.length,
        patients: patients.length,
        appointments: appointments.length,
        revenue,
      });

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

      setStatusData([
        { name: "Scheduled", value: scheduled },
        { name: "Confirmed", value: confirmed },
        { name: "Completed", value: completed },
        { name: "Cancelled", value: cancelled },
      ]);

      setDoctorFeeData(
        doctors.map((doc) => ({
          name: doc.full_name,
          fee: Number(doc.consultation_fee),
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Analytics...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Analytics
      </h1>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Doctors</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.doctors}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Patients</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.patients}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Appointments</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.appointments}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            ₹{stats.revenue.toLocaleString()}
          </p>
        </div>

      </div>

      {/* Charts */}

      <div className="grid xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-bold mb-4">
            Appointment Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={statusData}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="name"/>

              <YAxis/>

              <Tooltip/>

              <Bar dataKey="value" fill="#2563eb"/>

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-bold mb-4">
            Consultation Fee
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={doctorFeeData}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="name"/>

              <YAxis/>

              <Tooltip/>

              <Line
                dataKey="fee"
                stroke="#16a34a"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="grid xl:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="font-bold mb-4">
            Appointment Distribution
          </h2>

          <ResponsiveContainer width="100%" height={350}>

            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={120}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip/>

              <Legend/>

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default Analytics;