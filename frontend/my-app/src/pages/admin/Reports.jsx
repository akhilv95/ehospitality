import { useEffect, useState } from "react";
import {
  ArrowDownTrayIcon,
  PrinterIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

import {
  doctorAPI,
  patientAPI,
  appointmentAPI,
  billingAPI,
} from "../../services/api";

const Reports = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadReports();
  }, []);

  const getList = (response) => {
    if (!response?.data) return [];
    return response.data.results ?? response.data ?? [];
  };

  const loadReports = async () => {
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

      setSummary({
        doctors: doctors.length,
        patients: patients.length,
        appointments: appointments.length,
        revenue,
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  const exportCSV = () => {
    const rows = [
      ["Doctors", summary.doctors],
      ["Patients", summary.patients],
      ["Appointments", summary.appointments],
      ["Revenue", summary.revenue],
    ];

    let csv = "Report,Value\n";

    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "hospital_report.csv";

    link.click();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Reports...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Reports

          </h1>

          <p className="text-gray-500 mt-2">

            Hospital Report Center

          </p>

        </div>

        <div className="flex gap-4">

          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >

            <ArrowDownTrayIcon className="w-5 h-5"/>

            Export CSV

          </button>

          <button
            onClick={printReport}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >

            <PrinterIcon className="w-5 h-5"/>

            Print

          </button>

        </div>

      </div>

      {/* Summary */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">

          <DocumentChartBarIcon className="w-8 h-8 text-blue-600"/>

          <h3 className="mt-4 text-gray-500">

            Doctors

          </h3>

          <h2 className="text-3xl font-bold">

            {summary.doctors}

          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <DocumentChartBarIcon className="w-8 h-8 text-green-600"/>

          <h3 className="mt-4 text-gray-500">

            Patients

          </h3>

          <h2 className="text-3xl font-bold">

            {summary.patients}

          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <DocumentChartBarIcon className="w-8 h-8 text-orange-600"/>

          <h3 className="mt-4 text-gray-500">

            Appointments

          </h3>

          <h2 className="text-3xl font-bold">

            {summary.appointments}

          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <DocumentChartBarIcon className="w-8 h-8 text-purple-600"/>

          <h3 className="mt-4 text-gray-500">

            Revenue

          </h3>

          <h2 className="text-3xl font-bold">

            ₹{summary.revenue.toLocaleString()}

          </h2>

        </div>

      </div>

      {/* Reports */}

      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-5 text-left">

                Report

              </th>

              <th>

                Value

              </th>

            </tr>

          </thead>

          <tbody>

            <tr className="border-b">

              <td className="p-5">

                Total Doctors

              </td>

              <td>

                {summary.doctors}

              </td>

            </tr>

            <tr className="border-b">

              <td className="p-5">

                Total Patients

              </td>

              <td>

                {summary.patients}

              </td>

            </tr>

            <tr className="border-b">

              <td className="p-5">

                Total Appointments

              </td>

              <td>

                {summary.appointments}

              </td>

            </tr>

            <tr>

              <td className="p-5">

                Total Revenue

              </td>

              <td>

                ₹{summary.revenue.toLocaleString()}

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Reports;