import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { doctorAPI } from "../../services/api";

const Doctors = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await doctorAPI.getAll();

      const list =
        res.data.results ??
        res.data ??
        [];

      setDoctors(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const fullName =
        doctor.full_name ||
        doctor.user?.full_name ||
        `${doctor.user?.first_name || ""} ${doctor.user?.last_name || ""}`;

      const matchesSearch =
        fullName.toLowerCase().includes(search.toLowerCase());

      const matchesAvailability =
        availability === "all"
          ? true
          : availability === "available"
          ? doctor.is_available
          : !doctor.is_available;

      return matchesSearch && matchesAvailability;
    });
  }, [search, availability, doctors]);

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        Loading Doctors...
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-100 min-h-screen">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Doctor Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all doctors
          </p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2">

          <PlusIcon className="w-5 h-5"/>

          Add Doctor

        </button>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl p-6 shadow">

          <h2 className="text-gray-500">
            Total Doctors
          </h2>

          <p className="text-3xl font-bold mt-3">
            {doctors.length}
          </p>

        </div>

        <div className="bg-white rounded-xl p-6 shadow">

          <h2 className="text-gray-500">
            Available
          </h2>

          <p className="text-3xl font-bold text-green-600 mt-3">

            {doctors.filter(d=>d.is_available).length}

          </p>

        </div>

        <div className="bg-white rounded-xl p-6 shadow">

          <h2 className="text-gray-500">
            Busy
          </h2>

          <p className="text-3xl font-bold text-red-600 mt-3">

            {doctors.filter(d=>!d.is_available).length}

          </p>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-5 mb-6 flex gap-5">

        <div className="relative flex-1">

          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400"/>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search Doctor..."
            className="border rounded-lg w-full pl-10 py-2"
          />

        </div>

        <select
          value={availability}
          onChange={(e)=>setAvailability(e.target.value)}
          className="border rounded-lg px-4"
        >

          <option value="all">
            All
          </option>

          <option value="available">
            Available
          </option>

          <option value="busy">
            Busy
          </option>

        </select>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Doctor
              </th>

              <th>
                Experience
              </th>

              <th>
                Fee
              </th>

              <th>
                Availability
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredDoctors.map((doctor)=>(

              <tr
                key={doctor.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-4">

                  <div>

                    <p className="font-semibold">

                      {doctor.full_name}

                    </p>

                    <p className="text-sm text-gray-500">

                      {doctor.user?.email}

                    </p>

                  </div>

                </td>

                <td>

                  {doctor.experience_years} yrs

                </td>

                <td>

                  ₹{doctor.consultation_fee}

                </td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      doctor.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {doctor.is_available
                      ? "Available"
                      : "Busy"}

                  </span>

                </td>

                <td>

                  <div className="flex gap-3 justify-center">

                    <button>

                      <EyeIcon className="w-5 h-5 text-blue-600"/>

                    </button>

                    <button>

                      <PencilSquareIcon className="w-5 h-5 text-green-600"/>

                    </button>

                    <button>

                      <TrashIcon className="w-5 h-5 text-red-600"/>

                    </button>

                  </div>

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