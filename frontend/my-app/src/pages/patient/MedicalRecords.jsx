import { useEffect, useState } from 'react';
import { medicalRecordAPI } from '../../services/api';
import toast from 'react-hot-toast';

import {
  DocumentTextIcon,
  UserIcon,
  CalendarDaysIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';


const PatientMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchRecords();
  }, []);


  const fetchRecords = async () => {
    setLoading(true);

    try {
      const res = await medicalRecordAPI.getAll();

      setRecords(
        res.data.results ||
        res.data ||
        []
      );

    } catch (error) {

      console.error(error);

      toast.error('Failed to load medical records');

    } finally {

      setLoading(false);

    }
  };


  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div
            className="
              w-14 h-14
              border-4
              border-blue-100
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-500 font-medium">
            Loading your medical records...
          </p>

        </div>

      </div>
    );
  }


  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center gap-4">

          <div
            className="
              w-14 h-14
              bg-blue-100
              rounded-2xl
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Medical Records
            </h1>

            <p className="text-gray-500 mt-1">
              View your diagnoses, symptoms, treatments and laboratory results.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">


        {/* TOTAL RECORDS */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Records
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {records.length}
              </p>

            </div>

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">

              <DocumentTextIcon className="w-6 h-6 text-blue-600" />

            </div>

          </div>

        </div>


        {/* DOCTORS */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Medical Visits
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {records.length}
              </p>

            </div>

            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">

              <HeartIcon className="w-6 h-6 text-green-600" />

            </div>

          </div>

        </div>


        {/* LAB RESULTS */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            p-6
            hover:shadow-md
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Lab Results
              </p>

              <p className="text-3xl font-bold text-purple-600 mt-2">
                {
                  records.reduce(
                    (total, record) =>
                      total +
                      (record.lab_results?.length || 0),
                    0
                  )
                }
              </p>

            </div>

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">

              <BeakerIcon className="w-6 h-6 text-purple-600" />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {records.length === 0 ? (

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            shadow-sm
            text-center
            py-16
            px-6
          "
        >

          <div
            className="
              w-20
              h-20
              bg-blue-50
              rounded-2xl
              flex
              items-center
              justify-center
              mx-auto
            "
          >

            <DocumentTextIcon className="w-10 h-10 text-blue-400" />

          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-5">
            No Medical Records
          </h3>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Your medical records will appear here after a doctor adds
            a diagnosis or treatment record.
          </p>

        </div>

      ) : (


        /* =====================================================
            RECORD LIST
        ===================================================== */

        <div className="space-y-6">

          {records.map((record, index) => (

            <div
              key={record.id}
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                overflow-hidden
                hover:shadow-lg
                hover:border-blue-100
                transition-all
                duration-200
              "
            >

              {/* TOP ACCENT */}

              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />


              <div className="p-5 md:p-7">


                {/* =================================================
                    RECORD HEADER
                ================================================= */}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                  {/* DOCTOR */}

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-14
                        h-14
                        bg-blue-50
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                    >

                      <UserIcon className="w-7 h-7 text-blue-600" />

                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                        Attending Doctor
                      </p>

                      <h2 className="text-lg font-bold text-gray-900 mt-1">

                        {record.doctor_detail?.full_name ||
                          'Doctor'}

                      </h2>

                    </div>

                  </div>


                  {/* DATE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      bg-slate-50
                      rounded-xl
                      px-4
                      py-3
                    "
                  >

                    <CalendarDaysIcon className="w-5 h-5 text-blue-600" />

                    <div>

                      <p className="text-xs text-gray-400 font-semibold">
                        Recorded On
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1">

                        {record.created_at
                          ? new Date(
                              record.created_at
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : 'N/A'}

                      </p>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    DIAGNOSIS
                ================================================= */}

                <div className="mt-6">

                  <div
                    className="
                      bg-blue-50
                      border
                      border-blue-100
                      rounded-xl
                      p-5
                    "
                  >

                    <div className="flex items-start gap-3">

                      <ClipboardDocumentCheckIcon
                        className="
                          w-6
                          h-6
                          text-blue-600
                          flex-shrink-0
                        "
                      />

                      <div>

                        <p className="text-xs uppercase tracking-wide text-blue-500 font-bold">
                          Diagnosis
                        </p>

                        <p className="text-gray-900 font-semibold mt-1">
                          {record.diagnosis || 'N/A'}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    SYMPTOMS + TREATMENT
                ================================================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">


                  {/* SYMPTOMS */}

                  <div
                    className="
                      border
                      border-gray-100
                      rounded-xl
                      p-5
                      hover:bg-gray-50
                      transition
                    "
                  >

                    <div className="flex items-center gap-2 mb-3">

                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">

                        <HeartIcon className="w-4 h-4 text-orange-600" />

                      </div>

                      <h3 className="font-bold text-gray-900">
                        Symptoms
                      </h3>

                    </div>

                    <p className="text-gray-600 text-sm leading-6">
                      {record.symptoms || 'No symptoms recorded.'}
                    </p>

                  </div>


                  {/* TREATMENT */}

                  <div
                    className="
                      border
                      border-gray-100
                      rounded-xl
                      p-5
                      hover:bg-gray-50
                      transition
                    "
                  >

                    <div className="flex items-center gap-2 mb-3">

                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">

                        <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-600" />

                      </div>

                      <h3 className="font-bold text-gray-900">
                        Treatment
                      </h3>

                    </div>

                    <p className="text-gray-600 text-sm leading-6">
                      {record.treatment || 'No treatment recorded.'}
                    </p>

                  </div>

                </div>


                {/* =================================================
                    LAB RESULTS
                ================================================= */}

                {record.lab_results?.length > 0 && (

                  <div className="mt-6">

                    <div className="flex items-center justify-between mb-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-10
                            h-10
                            bg-purple-100
                            rounded-xl
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <BeakerIcon className="w-5 h-5 text-purple-600" />

                        </div>

                        <div>

                          <h3 className="text-lg font-bold text-gray-900">
                            Laboratory Results
                          </h3>

                          <p className="text-sm text-gray-500">
                            {record.lab_results.length} result
                            {record.lab_results.length !== 1
                              ? 's'
                              : ''}
                          </p>

                        </div>

                      </div>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {record.lab_results.map((lab) => (

                        <div
                          key={lab.id}
                          className="
                            bg-slate-50
                            border
                            border-gray-100
                            rounded-xl
                            p-5
                            hover:bg-white
                            hover:shadow-sm
                            transition
                          "
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                                Test
                              </p>

                              <p className="font-bold text-gray-900 mt-1">
                                {lab.test_name}
                              </p>

                            </div>

                            <div
                              className="
                                w-9
                                h-9
                                bg-white
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                shadow-sm
                              "
                            >

                              <BeakerIcon className="w-5 h-5 text-purple-600" />

                            </div>

                          </div>


                          <div className="mt-4 pt-4 border-t border-gray-200">

                            <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                              Result
                            </p>

                            <p className="text-gray-800 font-semibold mt-1">
                              {lab.result || 'N/A'}
                            </p>

                          </div>


                          {lab.normal_range && (

                            <div className="mt-3">

                              <span
                                className="
                                  inline-flex
                                  items-center
                                  px-3
                                  py-1.5
                                  rounded-lg
                                  bg-green-50
                                  text-green-700
                                  text-xs
                                  font-semibold
                                "
                              >

                                Normal Range: {lab.normal_range}

                              </span>

                            </div>

                          )}

                        </div>

                      ))}

                    </div>

                  </div>

                )}


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                    mt-6
                    pt-5
                    border-t
                    border-gray-100
                  "
                >

                  <p className="text-xs text-gray-400">
                    Medical Record ID: #{record.id}
                  </p>

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      bg-green-50
                      text-green-700
                      text-xs
                      font-semibold
                    "
                  >

                    <span className="w-2 h-2 bg-green-500 rounded-full" />

                    Medical Record

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};


export default PatientMedicalRecords;