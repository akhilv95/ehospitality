import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RevenueChart = ({ invoices }) => {
  const revenueData = Array(12)
    .fill(0)
    .map((_, index) => ({
      month: new Date(2026, index).toLocaleString("default", {
        month: "short",
      }),
      revenue: 0,
    }));

  invoices.forEach((invoice) => {
    const month = new Date(invoice.created_at).getMonth();
    revenueData[month].revenue += Number(invoice.amount_paid);
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        Monthly Revenue
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;