const RecentPatients = ({ patients }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-5">
        New Patients
      </h2>

      <div className="space-y-4">

        {patients.slice(0,5).map((patient)=>(
          <div
            key={patient.id}
            className="flex justify-between border-b pb-3"
          >

            <div>

              <h3 className="font-semibold">
                {patient.user?.full_name}
              </h3>

              <p className="text-gray-500">
                {patient.user?.email}
              </p>

            </div>

            <div>

              <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm">

                {patient.blood_group || "N/A"}

              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default RecentPatients;