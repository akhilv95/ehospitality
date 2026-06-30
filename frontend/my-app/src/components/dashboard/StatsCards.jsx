import {
  UserGroupIcon,
  UserIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Doctors",
      value: stats?.doctors || 0,
      color: "bg-blue-600",
      icon: UserIcon,
    },
    {
      title: "Patients",
      value: stats?.patients || 0,
      color: "bg-green-600",
      icon: UserGroupIcon,
    },
    {
      title: "Appointments",
      value: stats?.appointments || 0,
      color: "bg-orange-500",
      icon: CalendarDaysIcon,
    },
    {
      title: "Revenue",
      value: `₹${Number(stats?.revenue || 0).toLocaleString()}`,
      color: "bg-purple-600",
      icon: CurrencyRupeeIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`${card.color} h-14 w-14 rounded-xl flex items-center justify-center`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;