import { useEffect, useState } from "react";
import { doctorAPI } from "../../services/api";
import toast from "react-hot-toast";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    setFilteredDoctors(
      doctors.filter((doctor) => {
        const name =
          `${doctor.user?.first_name || ""} ${doctor.user?.last_name || ""}`.toLowerCase();

        return (
          name.includes(keyword) ||
          doctor.license_number?.toLowerCase().includes(keyword)
        );
      })
    );
  }, [search, doctors]);

  const loadDoctors = async () => {
    try {
      setLoading(true);

      const res = await doctorAPI.getAll();

      const list = res.data.results || res.data || [];

      setDoctors(list);
      setFilteredDoctors(list);
    } catch (error) {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await doctorAPI.delete(id);

      toast.success("Doctor deleted");

      loadDoctors();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-72">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Doctors
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg"  >
          + Add Doctor
        </button>

      </div>

      <input
        className="border rounded-lg p-3 w-full mb-6"
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Doctor</th>

              <th className="text-left">Email</th>

              <th className="text-left">License</th>

              <th className="text-left">Experience</th>

              <th className="text-left">Fee</th>

              <th className="text-left">Available</th>

              <th className="text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredDoctors.map((doctor) => (

              <tr
                key={doctor.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">
                  Dr. {doctor.user?.full_name}
                </td>

                <td>
                  {doctor.user?.email}
                </td>

                <td>
                  {doctor.license_number}
                </td>

                <td>
                  {doctor.experience_years} Years
                </td>

                <td>
                  ₹{doctor.consultation_fee}
                </td>

                <td>

                  {doctor.is_available ? (
                    <span className="text-green-600 font-semibold">
                      Available
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Not Available
                    </span>
                  )}

                </td>

                <td className="text-center space-x-2">

                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteDoctor(doctor.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Doctors;