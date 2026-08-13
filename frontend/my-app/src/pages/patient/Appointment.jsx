import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import {
  CalendarIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';


const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    fetchAppointments();
  }, [filter]);


  const fetchAppointments = async () => {
    setLoading(true);

    try {
      const params =
        filter !== 'all'
          ? { status: filter }
          : {};

      const response = await appointmentAPI.getAll(params);

      setAppointments(
        response.data.results ||
        response.data ||
        []
      );

    } catch (error) {

      console.error(error);

      toast.error('Failed to load appointments');

    } finally {

      setLoading(false);

    }
  };


  const handleCancel = async (id) => {

    if (
      !window.confirm(
        'Are you sure you want to cancel this appointment?'
      )
    ) {
      return;
    }

    try {

      await appointmentAPI.cancel(id);

      toast.success('Appointment cancelled');

      fetchAppointments();

    } catch (error) {

      console.error(error);

      toast.error('Failed to cancel appointment');
    }
  };


  const getStatusConfig = (status) => {

    const configs = {

      scheduled: {
        label: 'Scheduled',
        className:
          'bg-blue-100 text-blue-700 border-blue-200',
        icon: CalendarIcon,
      },

      confirmed: {
        label: 'Confirmed',
        className:
          'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircleIcon,
      },

      completed: {
        label: 'Completed',
        className:
          'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: CheckCircleIcon,
      },

      cancelled: {
        label: 'Cancelled',
        className:
          'bg-red-100 text-red-700 border-red-200',
        icon: XMarkIcon,
      },

      no_show: {
        label: 'No Show',
        className:
          'bg-orange-100 text-orange-700 border-orange-200',
        icon: ExclamationCircleIcon,
      },

    };

    return (
      configs[status] || {
        label: status,
        className:
          'bg-gray-100 text-gray-700 border-gray-200',
        icon: CalendarIcon,
      }
    );
  };


  const getCount = (status) => {

    if (status === 'all') {
      return appointments.length;
    }

    return appointments.filter(
      (appointment) =>
        appointment.status === status
    ).length;
  };


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
            Loading your appointments...
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        <div className="flex items-center gap-4">

          <div
            className="
              w-14 h-14
              bg-blue-100
              rounded-2xl
              flex
              items-center
              justify-center
            "
          >
            <CalendarIcon className="w-8 h-8 text-blue-600" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              My Appointments
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your upcoming and previous appointments
            </p>

          </div>

        </div>


        <Link
          to="/patient/appointments/book"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            shadow-sm
            hover:shadow-md
            transition-all
          "
        >

          <PlusIcon className="w-5 h-5" />

          Book Appointment

        </Link>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        {/* TOTAL */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Total
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {appointments.length}
              </p>

            </div>

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">

              <CalendarIcon className="w-6 h-6 text-blue-600" />

            </div>

          </div>

        </div>


        {/* SCHEDULED */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Scheduled
              </p>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                {getCount('scheduled')}
              </p>

            </div>

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">

              <ClockIcon className="w-6 h-6 text-blue-600" />

            </div>

          </div>

        </div>


        {/* CONFIRMED */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Confirmed
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {getCount('confirmed')}
              </p>

            </div>

            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">

              <CheckCircleIcon className="w-6 h-6 text-green-600" />

            </div>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 font-medium">
                Completed
              </p>

              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {getCount('completed')}
              </p>

            </div>

            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">

              <CheckCircleIcon className="w-6 h-6 text-emerald-600" />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-7">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="font-bold text-gray-900">
              Appointment History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Filter your appointments by status
            </p>

          </div>


          <div className="flex gap-2 flex-wrap">

            {[
              'all',
              'scheduled',
              'confirmed',
              'completed',
              'cancelled',
            ].map((status) => (

              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  capitalize
                  transition-all
                  border

                  ${
                    filter === status
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }
                `}
              >

                {status === 'all'
                  ? 'All'
                  : status.replace('_', ' ')}

              </button>

            ))}

          </div>

        </div>

      </div>


      {/* =====================================================
          APPOINTMENTS
      ===================================================== */}

      {appointments.length === 0 ? (

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">

          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">

            <CalendarIcon className="w-10 h-10 text-blue-400" />

          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-5">
            No appointments found
          </h3>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            You don't have any appointments matching the selected filter.
          </p>

          <Link
            to="/patient/appointments/book"
            className="
              inline-flex
              items-center
              gap-2
              mt-6
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >

            <PlusIcon className="w-5 h-5" />

            Book Your First Appointment

          </Link>

        </div>

      ) : (

        <div className="space-y-5">

          {appointments.map((appointment) => {

            const statusConfig =
              getStatusConfig(
                appointment.status
              );

            const StatusIcon =
              statusConfig.icon;

            return (

              <div
                key={appointment.id}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  shadow-sm
                  overflow-hidden
                  hover:shadow-md
                  hover:border-blue-100
                  transition-all
                "
              >

                {/* TOP ACCENT */}

                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />


                <div className="p-5 md:p-6">

                  {/* HEADER */}

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    {/* DOCTOR */}

                    <div className="flex items-start gap-4">

                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">

                        <UserIcon className="w-7 h-7 text-blue-600" />

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                          Doctor
                        </p>

                        <h3 className="text-lg font-bold text-gray-900 mt-1">
                          {appointment.doctor_detail?.full_name ||
                            'Doctor'}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">

                          {appointment.doctor_detail?.specializations
                            ?.map((s) => s.name)
                            .join(', ') ||
                            'Medical Specialist'}

                        </p>

                      </div>

                    </div>


                    {/* STATUS */}

                    <div className="flex items-center gap-3">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-1.5
                          rounded-full
                          border
                          text-xs
                          font-bold
                          ${statusConfig.className}
                        `}
                      >

                        <StatusIcon className="w-4 h-4" />

                        {appointment.status_display ||
                          statusConfig.label}

                      </span>


                      {[
                        'scheduled',
                        'confirmed',
                      ].includes(
                        appointment.status
                      ) && (

                        <button
                          onClick={() =>
                            handleCancel(
                              appointment.id
                            )
                          }
                          className="
                            w-9
                            h-9
                            flex
                            items-center
                            justify-center
                            text-red-500
                            bg-red-50
                            hover:bg-red-100
                            rounded-xl
                            transition
                          "
                          title="Cancel appointment"
                        >

                          <XMarkIcon className="w-5 h-5" />

                        </button>

                      )}

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                    {/* DATE */}

                    <div className="bg-slate-50 rounded-xl p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">

                          <CalendarIcon className="w-5 h-5 text-blue-600" />

                        </div>

                        <div>

                          <p className="text-xs text-gray-400 font-semibold uppercase">
                            Date
                          </p>

                          <p className="text-sm font-semibold text-gray-800 mt-1">

                            {format(
                              new Date(
                                appointment.date
                              ),
                              'EEE, MMM d, yyyy'
                            )}

                          </p>

                        </div>

                      </div>

                    </div>


                    {/* TIME */}

                    <div className="bg-slate-50 rounded-xl p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">

                          <ClockIcon className="w-5 h-5 text-purple-600" />

                        </div>

                        <div>

                          <p className="text-xs text-gray-400 font-semibold uppercase">
                            Time
                          </p>

                          <p className="text-sm font-semibold text-gray-800 mt-1">
                            {appointment.time}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* TYPE */}

                    <div className="bg-slate-50 rounded-xl p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">

                          <CalendarIcon className="w-5 h-5 text-green-600" />

                        </div>

                        <div>

                          <p className="text-xs text-gray-400 font-semibold uppercase">
                            Appointment Type
                          </p>

                          <p className="text-sm font-semibold text-gray-800 mt-1 capitalize">
                            {appointment.appointment_type
                              ?.replace('_', ' ') ||
                              'Consultation'}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* REASON */}

                  {appointment.reason && (

                    <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">

                      <p className="text-xs uppercase tracking-wide text-blue-500 font-bold">
                        Reason for Visit
                      </p>

                      <p className="text-sm text-gray-700 mt-1">
                        {appointment.reason}
                      </p>

                    </div>

                  )}


                  {/* FOOTER */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-5 border-t border-gray-100">

                    <p className="text-xs text-gray-400">
                      Appointment ID: #{appointment.id}
                    </p>


                    {[
                      'scheduled',
                      'confirmed',
                    ].includes(
                      appointment.status
                    ) && (

                      <button
                        onClick={() =>
                          handleCancel(
                            appointment.id
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          px-4
                          py-2
                          rounded-xl
                          text-sm
                          font-semibold
                          text-red-600
                          bg-red-50
                          hover:bg-red-100
                          transition
                        "
                      >

                        <XMarkIcon className="w-4 h-4" />

                        Cancel Appointment

                      </button>

                    )}

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


export default PatientAppointments;