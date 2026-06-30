import CountUp from "react-countup";
import {
  UserGroupIcon,
  UserIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Doctors",
    valueKey: "doctors",
    icon: UserGroupIcon,
    color: "bg-blue-500",
  },
  {
    title: "Patients",
    valueKey: "patients",
    icon: UserIcon,
    color: "bg-green-500",
  },
  {
    title: "Appointments",
    valueKey: "appointments",
    icon: CalendarDaysIcon,
    color: "bg-yellow-500",
  },
  {
    title: "Revenue",
    valueKey: "revenue",
    icon: CurrencyRupeeIcon,
    color: "bg-purple-600",
    prefix: "₹",
  },
];

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{card.title}</p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.prefix}
                  <CountUp
                    end={stats[card.valueKey]}
                    duration={2}
                  />
                </h2>
              </div>

              <div
                className={`${card.color} p-4 rounded-xl text-white`}
              >
                <Icon className="h-8 w-8" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;