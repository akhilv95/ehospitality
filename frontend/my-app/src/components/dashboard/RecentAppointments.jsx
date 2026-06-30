import { ClockIcon } from "@heroicons/react/24/outline";

const statusColor = {
  scheduled: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const RecentAppointments = ({ appointments }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-5">
        Recent Appointments
      </h2>

      <div className="space-y-4">

        {appointments.slice(0,5).map((appointment)=>(
          <div
            key={appointment.id}
            className="flex justify-between items-center border-b pb-3"
          >

            <div>

              <p className="font-semibold">
                {appointment.patient_detail?.user?.full_name}
              </p>

              <p className="text-gray-500 text-sm">
                Dr. {appointment.doctor_detail?.user?.full_name}
              </p>

            </div>

            <div className="text-right">

              <div className="flex items-center gap-2">

                <ClockIcon className="h-4 w-4"/>

                {appointment.time}

              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  statusColor[appointment.status]
                }`}
              >
                {appointment.status}
              </span>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default RecentAppointments;