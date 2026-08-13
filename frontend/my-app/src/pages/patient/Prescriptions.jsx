import { useEffect, useState } from 'react';
import { prescriptionAPI } from '../../services/api';
import toast from 'react-hot-toast';

import {
  DocumentTextIcon,
  UserIcon,
  CalendarDaysIcon,
  BeakerIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';


const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchPrescriptions();
  }, []);


  const fetchPrescriptions = async () => {
    setLoading(true);

    try {
      const res = await prescriptionAPI.getAll();

      setPrescriptions(
        res.data.results ||
        res.data ||
        []
      );

    } catch (error) {

      console.error(
        'Prescription error:',
        error.response?.data || error
      );

      toast.error('Failed to load prescriptions');

    } finally {

      setLoading(false);

    }
  };


  /* =========================================================
     STATUS
  ========================================================= */

  const getStatusConfig = (status) => {

    const statuses = {

      active: {
        label: 'Active',
        className: 'bg-green-50 text-green-700 border-green-200',
        icon: CheckCircleIcon,
      },

      completed: {
        label: 'Completed',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: CheckCircleIcon,
      },

      cancelled: {
        label: 'Cancelled',
        className: 'bg-red-50 text-red-700 border-red-200',
        icon: ExclamationCircleIcon,
      },

    };

    return (
      statuses[status] || {
        label: status || 'Unknown',
        className: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: InformationCircleIcon,
      }
    );
  };


  /* =========================================================
     STATISTICS
  ========================================================= */

  const activeCount = prescriptions.filter(
    (prescription) =>
      prescription.status === 'active'
  ).length;


  const completedCount = prescriptions.filter(
    (prescription) =>
      prescription.status === 'completed'
  ).length;


  const totalMedications = prescriptions.reduce(
    (total, prescription) =>
      total +
      (prescription.medications?.length || 0),
    0
  );


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div
            className="
              w-14
              h-14
              border-4
              border-blue-100
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-500 font-medium">
            Loading your prescriptions...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">

        <div className="flex items-center gap-4">

          <div
            className="
              w-14
              h-14
              bg-indigo-100
              rounded-2xl
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >

            <DocumentTextIcon className="w-8 h-8 text-indigo-600" />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Prescriptions
            </h1>

            <p className="text-gray-500 mt-1">
              Review your prescribed medications and treatment instructions.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">


        {/* TOTAL */}

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
                Total Prescriptions
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {prescriptions.length}
              </p>

            </div>

            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">

              <DocumentTextIcon className="w-6 h-6 text-indigo-600" />

            </div>

          </div>

        </div>


        {/* ACTIVE */}

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
                Active Prescriptions
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {activeCount}
              </p>

            </div>

            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">

              <CheckCircleIcon className="w-6 h-6 text-green-600" />

            </div>

          </div>

        </div>


        {/* MEDICATIONS */}

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
                Medications
              </p>

              <p className="text-3xl font-bold text-purple-600 mt-2">
                {totalMedications}
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

      {prescriptions.length === 0 ? (

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
              bg-indigo-50
              rounded-2xl
              flex
              items-center
              justify-center
              mx-auto
            "
          >

            <DocumentTextIcon className="w-10 h-10 text-indigo-400" />

          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-5">
            No Prescriptions Found
          </h3>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Prescriptions provided by your doctor will appear here.
          </p>

        </div>

      ) : (

        /* =====================================================
           PRESCRIPTION LIST
        ===================================================== */

        <div className="space-y-6">

          {prescriptions.map((prescription) => {

            const status =
              getStatusConfig(
                prescription.status
              );

            const StatusIcon =
              status.icon;


            return (

              <div
                key={prescription.id}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  shadow-sm
                  overflow-hidden
                  hover:shadow-lg
                  hover:border-indigo-100
                  transition-all
                  duration-200
                "
              >

                {/* TOP ACCENT */}

                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />


                <div className="p-5 md:p-7">


                  {/* =================================================
                      HEADER
                  ================================================= */}

                  <div
                    className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-start
                      lg:justify-between
                      gap-5
                    "
                  >


                    {/* DOCTOR */}

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          w-14
                          h-14
                          bg-indigo-50
                          rounded-2xl
                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                        "
                      >

                        <UserIcon className="w-7 h-7 text-indigo-600" />

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                          Prescribed By
                        </p>

                        <h2 className="text-lg font-bold text-gray-900 mt-1">

                          {prescription.doctor_detail?.full_name ||
                            'Doctor'}

                        </h2>

                      </div>

                    </div>


                    {/* STATUS */}

                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        border
                        text-sm
                        font-semibold
                        self-start
                        ${status.className}
                      `}
                    >

                      <StatusIcon className="w-4 h-4" />

                      {prescription.status_display ||
                        status.label}

                    </div>

                  </div>


                  {/* =================================================
                      INFORMATION GRID
                  ================================================= */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-4
                      mt-6
                    "
                  >


                    {/* DIAGNOSIS */}

                    <div
                      className="
                        bg-slate-50
                        rounded-xl
                        p-5
                        border
                        border-gray-100
                      "
                    >

                      <div className="flex items-center gap-2 mb-2">

                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">

                          <ClipboardDocumentListIcon className="w-4 h-4 text-blue-600" />

                        </div>

                        <span className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                          Diagnosis
                        </span>

                      </div>

                      <p className="font-semibold text-gray-900">

                        {prescription.diagnosis ||
                          'N/A'}

                      </p>

                    </div>


                    {/* PHARMACY */}

                    <div
                      className="
                        bg-slate-50
                        rounded-xl
                        p-5
                        border
                        border-gray-100
                      "
                    >

                      <div className="flex items-center gap-2 mb-2">

                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">

                          <BuildingStorefrontIcon className="w-4 h-4 text-green-600" />

                        </div>

                        <span className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                          Pharmacy
                        </span>

                      </div>

                      <p className="font-semibold text-gray-900">

                        {prescription.pharmacy_name ||
                          'Not assigned'}

                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      NOTES
                  ================================================= */}

                  <div className="mt-5">

                    <div
                      className="
                        bg-yellow-50
                        border
                        border-yellow-100
                        rounded-xl
                        p-5
                      "
                    >

                      <div className="flex items-start gap-3">

                        <InformationCircleIcon
                          className="
                            w-5
                            h-5
                            text-yellow-600
                            flex-shrink-0
                          "
                        />

                        <div>

                          <p className="text-xs uppercase tracking-wide text-yellow-600 font-bold">
                            Doctor's Notes
                          </p>

                          <p className="text-gray-700 text-sm leading-6 mt-1">

                            {prescription.notes ||
                              'No additional notes.'}

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      MEDICATIONS
                  ================================================= */}

                  <div className="mt-7">

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
                            Medications
                          </h3>

                          <p className="text-sm text-gray-500">

                            {prescription.medications?.length || 0}
                            {' '}
                            medication
                            {prescription.medications?.length !== 1
                              ? 's'
                              : ''}

                          </p>

                        </div>

                      </div>

                    </div>


                    {prescription.medications?.length > 0 ? (

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {prescription.medications.map((med) => (

                          <div
                            key={med.id}
                            className="
                              border
                              border-gray-100
                              rounded-xl
                              p-5
                              bg-white
                              hover:bg-slate-50
                              hover:shadow-sm
                              transition
                            "
                          >

                            {/* MEDICATION NAME */}

                            <div className="flex items-start justify-between gap-4">

                              <div>

                                <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                                  Medication
                                </p>

                                <h4 className="text-lg font-bold text-gray-900 mt-1">
                                  {med.name}
                                </h4>

                              </div>

                              <div
                                className="
                                  w-9
                                  h-9
                                  bg-purple-50
                                  rounded-lg
                                  flex
                                  items-center
                                  justify-center
                                "
                              >

                                <BeakerIcon className="w-5 h-5 text-purple-600" />

                              </div>

                            </div>


                            {/* DOSAGE */}

                            <div className="mt-5 space-y-3">


                              <div className="flex items-center gap-3">

                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">

                                  <BeakerIcon className="w-4 h-4 text-blue-600" />

                                </div>

                                <div>

                                  <p className="text-xs text-gray-400 font-semibold">
                                    Dosage
                                  </p>

                                  <p className="text-sm font-semibold text-gray-800">
                                    {med.dosage || 'N/A'}
                                  </p>

                                </div>

                              </div>


                              {/* FREQUENCY */}

                              <div className="flex items-center gap-3">

                                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">

                                  <ClockIcon className="w-4 h-4 text-orange-600" />

                                </div>

                                <div>

                                  <p className="text-xs text-gray-400 font-semibold">
                                    Frequency
                                  </p>

                                  <p className="text-sm font-semibold text-gray-800">
                                    {med.frequency_display ||
                                      'N/A'}
                                  </p>

                                </div>

                              </div>


                              {/* DURATION */}

                              <div className="flex items-center gap-3">

                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">

                                  <CalendarDaysIcon className="w-4 h-4 text-green-600" />

                                </div>

                                <div>

                                  <p className="text-xs text-gray-400 font-semibold">
                                    Duration
                                  </p>

                                  <p className="text-sm font-semibold text-gray-800">

                                    {med.duration_days || 0}
                                    {' '}
                                    day(s)

                                  </p>

                                </div>

                              </div>


                            </div>


                            {/* INSTRUCTIONS */}

                            <div
                              className="
                                mt-5
                                pt-4
                                border-t
                                border-gray-100
                              "
                            >

                              <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">
                                Instructions
                              </p>

                              <p className="text-sm text-gray-600 leading-6 mt-1">

                                {med.instructions ||
                                  'No specific instructions.'}

                              </p>

                            </div>

                          </div>

                        ))}

                      </div>

                    ) : (

                      <div
                        className="
                          bg-gray-50
                          rounded-xl
                          p-6
                          text-center
                          border
                          border-dashed
                          border-gray-200
                        "
                      >

                        <BeakerIcon className="w-8 h-8 text-gray-300 mx-auto" />

                        <p className="text-gray-500 text-sm mt-2">
                          No medications listed.
                        </p>

                      </div>

                    )}

                  </div>


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
                      gap-4
                      mt-7
                      pt-5
                      border-t
                      border-gray-100
                    "
                  >

                    <div className="flex items-center gap-3">

                      <CalendarDaysIcon className="w-4 h-4 text-gray-400" />

                      <p className="text-xs text-gray-400">

                        Prescription ID: #{prescription.id}

                      </p>

                    </div>


                    <div className="flex items-center gap-2">

                      <span className="w-2 h-2 bg-indigo-500 rounded-full" />

                      <span className="text-xs text-gray-500 font-medium">
                        E-Hospitality Prescription
                      </span>

                    </div>

                  </div>


                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
};


export default PatientPrescriptions;