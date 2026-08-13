import { useEffect, useState } from "react";
import {
  ClipboardDocumentListIcon,
  UserCircleIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { medicalRecordAPI } from "../../services/api";
import toast from "react-hot-toast";

const DoctorMedicalRecords = () => {
  console.log("🔥🔥🔥 NEW MEDICAL RECORD PAGE 🔥🔥🔥");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await medicalRecordAPI.getAll();

      console.log(
        JSON.stringify(res.data, null, 2)
      );

      setRecords(
        res.data.results || res.data || []
      );
    } catch (error) {
      console.log(
        "Medical Record Error:",
        error.response?.data
      );

      console.log(error);

      toast.error(
        "Failed to load medical records"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // GET PATIENT NAME
  // -----------------------------------------

  const getPatientName = (record) => {
    const user =
      record.patient_detail?.user;

    if (!user) {
      return "Unknown Patient";
    }

    return (
      user.full_name ||
      `${user.first_name || ""} ${
        user.last_name || ""
      }`.trim() ||
      "Unknown Patient"
    );
  };

  // -----------------------------------------
  // SEARCH
  // -----------------------------------------

  const filteredRecords = records.filter(
    (record) =>
      getPatientName(record)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      record.diagnosis
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500 font-medium">
            Loading medical records...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">

            <ClipboardDocumentListIcon
              className="w-8 h-8 text-blue-600"
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Medical Records
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage your patients' medical records
            </p>

          </div>

        </div>

      </div>

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        {/* TOTAL RECORDS */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Records
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {records.length}
              </h2>

            </div>

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">

              <ClipboardDocumentListIcon
                className="w-6 h-6 text-blue-600"
              />

            </div>

          </div>

        </div>

        {/* PATIENTS */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Patient Records
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {
                  new Set(
                    records.map(
                      (record) =>
                        record.patient
                    )
                  ).size
                }
              </h2>

            </div>

            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">

              <UserCircleIcon
                className="w-6 h-6 text-green-600"
              />

            </div>

          </div>

        </div>

        {/* DIAGNOSIS */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Diagnoses
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {
                  new Set(
                    records
                      .map(
                        (record) =>
                          record.diagnosis
                      )
                      .filter(Boolean)
                  ).size
                }
              </h2>

            </div>

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">

              <HeartIcon
                className="w-6 h-6 text-purple-600"
              />

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

        <div className="relative">

          <MagnifyingGlassIcon
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by patient or diagnosis..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />

        </div>

      </div>

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {filteredRecords.length === 0 ? (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">

          <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center">

            <ClipboardDocumentListIcon
              className="w-10 h-10 text-blue-500"
            />

          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-5">
            No medical records found
          </h3>

          <p className="text-gray-500 mt-2">
            No records match your search.
          </p>

        </div>

      ) : (

        /* =====================================
           RECORD CARDS
        ===================================== */

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {filteredRecords.map(
            (record) => (

              <div
                key={record.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >

                {/* CARD HEADER */}

                <div className="p-6 border-b border-gray-100">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">

                        <UserCircleIcon
                          className="w-9 h-9 text-blue-600"
                        />

                      </div>

                      <div>

                        <h2 className="text-lg font-bold text-gray-900">
                          {getPatientName(
                            record
                          )}
                        </h2>

                        <p className="text-sm text-gray-500">
                          Medical Record #{record.id}
                        </p>

                      </div>

                    </div>

                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      Medical Record
                    </span>

                  </div>

                </div>

                {/* RECORD BODY */}

                <div className="p-6 space-y-5">

                  {/* DIAGNOSIS */}

                  <div>

                    <div className="flex items-center gap-2 mb-2">

                      <HeartIcon className="w-5 h-5 text-red-500" />

                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Diagnosis
                      </h3>

                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">

                      <p className="text-gray-800 font-medium">
                        {record.diagnosis ||
                          "No diagnosis provided"}
                      </p>

                    </div>

                  </div>

                  {/* SYMPTOMS */}

                  <div>

                    <div className="flex items-center gap-2 mb-2">

                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />

                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Symptoms
                      </h3>

                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">

                      <p className="text-gray-700 leading-relaxed">
                        {record.symptoms ||
                          "No symptoms recorded"}
                      </p>

                    </div>

                  </div>

                  {/* TREATMENT */}

                  <div>

                    <div className="flex items-center gap-2 mb-2">

                      <ClipboardDocumentListIcon className="w-5 h-5 text-green-600" />

                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Treatment
                      </h3>

                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">

                      <p className="text-gray-700 leading-relaxed">
                        {record.treatment ||
                          "No treatment information available"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* FOOTER */}

                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4">

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="text-xs text-gray-400">
                        Record ID
                      </p>

                      <p className="text-sm font-semibold text-gray-700">
                        #{record.id}
                      </p>

                    </div>

                    {record.created_at && (

                      <div className="text-right">

                        <p className="text-xs text-gray-400">
                          Created
                        </p>

                        <p className="text-sm font-medium text-gray-600">
                          {new Date(
                            record.created_at
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
};

export default DoctorMedicalRecords;