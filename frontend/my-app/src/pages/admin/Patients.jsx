import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { patientAPI } from "../../services/api";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await patientAPI.getAll();

      setPatients(
        res.data.results ??
        res.data ??
        []
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const name =
        patient.user?.full_name ||
        `${patient.user?.first_name || ""} ${patient.user?.last_name || ""}`;

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        patient.user?.email
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [patients, search]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Patients...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Patient Management
          </h1>

          <p className="text-gray-500">
            Manage registered patients
          </p>
        </div>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <p>Total Patients</p>
          <h2 className="text-3xl font-bold mt-2">
            {patients.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p>Male</p>
          <h2 className="text-3xl font-bold mt-2">
            {
              patients.filter(
                (p) => p.gender === "male"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p>Female</p>
          <h2 className="text-3xl font-bold mt-2">
            {
              patients.filter(
                (p) => p.gender === "female"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="relative">

          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400"/>

          <input
            className="w-full border rounded-lg py-2 pl-10"
            placeholder="Search patient..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">
                Patient
              </th>

              <th>Email</th>

              <th>Blood Group</th>

              <th>Phone</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredPatients.map((patient)=>(

              <tr
                key={patient.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-4">

                  <div>

                    <p className="font-semibold">

                      {patient.user?.full_name}

                    </p>

                  </div>

                </td>

                <td>

                  {patient.user?.email}

                </td>

                <td>

                  {patient.blood_group || "-"}

                </td>

                <td>

                  {patient.user?.phone}

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

export default Patients;