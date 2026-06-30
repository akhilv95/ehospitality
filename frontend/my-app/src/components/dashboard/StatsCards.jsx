import {
  UserGroupIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({
  title,
  value,
  icon,
  color,
  bgColor,
  borderColor,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border-l-4 ${borderColor} p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-800">
            {value}
          </h2>
        </div>

        <div
          className={`${bgColor} ${color} p-4 rounded-2xl`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Doctors",
      value: stats.doctors,
      icon: <UserGroupIcon className="w-8 h-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
    },
    {
      title: "Patients",
      value: stats.patients,
      icon: <UsersIcon className="w-8 h-8" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-500",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: <CalendarDaysIcon className="w-8 h-8" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-500",
    },
    {
      title: "Revenue",
      value: `₹${Number(stats.revenue).toLocaleString()}`,
      icon: <CurrencyRupeeIcon className="w-8 h-8" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          bgColor={card.bgColor}
          borderColor={card.borderColor}
        />
      ))}
    </div>
  );
};

export default StatsCards;