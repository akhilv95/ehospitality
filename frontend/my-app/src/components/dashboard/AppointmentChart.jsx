import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const AppointmentChart = ({ appointments }) => {
  const data = [
    { name: "Scheduled", value: 0 },
    { name: "Confirmed", value: 0 },
    { name: "Completed", value: 0 },
    { name: "Cancelled", value: 0 },
  ];

  appointments.forEach((appointment) => {
    switch (appointment.status) {
      case "scheduled":
        data[0].value++;
        break;

      case "confirmed":
        data[1].value++;
        break;

      case "completed":
        data[2].value++;
        break;

      case "cancelled":
        data[3].value++;
        break;

      default:
        break;
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        Appointment Status
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentChart;