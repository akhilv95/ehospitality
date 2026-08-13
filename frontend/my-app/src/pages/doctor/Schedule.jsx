import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { doctorAPI } from '../../services/api';
import toast from 'react-hot-toast';

import {
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';


const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      day_of_week: 0,
      start_time: '09:00',
      end_time: '17:00',
      slot_duration: 30,
      is_active: true,
    },
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);

    try {
      const res = await doctorAPI.getSchedules();

      setSchedules(
        res.data.results ||
        res.data ||
        []
      );
    } catch (error) {
      console.error(error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };


  const onSubmit = async (data) => {
    setSaving(true);

    try {
      await doctorAPI.createSchedule({
        ...data,
        day_of_week: Number(data.day_of_week),
        slot_duration: Number(data.slot_duration),
        is_active: true,
      });

      toast.success('Schedule added successfully');

      reset({
        day_of_week: 0,
        start_time: '09:00',
        end_time: '17:00',
        slot_duration: 30,
        is_active: true,
      });

      fetchSchedules();

    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        'Failed to add schedule';

      toast.error(message);

    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this schedule?'
    );

    if (!confirmed) return;

    try {

      await doctorAPI.deleteSchedule(id);

      toast.success('Schedule deleted');

      fetchSchedules();

    } catch (error) {

      console.error(error);

      toast.error('Failed to delete schedule');
    }
  };


  const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];


  const totalSchedules = schedules.length;

  const activeSchedules = schedules.filter(
    (schedule) => schedule.is_active
  ).length;

  const inactiveSchedules = schedules.filter(
    (schedule) => !schedule.is_active
  ).length;


  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* ================= HEADER ================= */}

      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">

              <CalendarDaysIcon className="w-8 h-8 text-blue-600" />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Doctor Schedule
              </h1>

              <p className="text-gray-500 mt-1">
                Manage your availability and appointment time slots
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        {/* TOTAL */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Schedules
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalSchedules}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

              <CalendarDaysIcon className="w-6 h-6 text-blue-600" />

            </div>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Active Schedules
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {activeSchedules}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

              <SparklesIcon className="w-6 h-6 text-green-600" />

            </div>

          </div>

        </div>


        {/* INACTIVE */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Inactive
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {inactiveSchedules}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">

              <ClockIcon className="w-6 h-6 text-red-600" />

            </div>

          </div>

        </div>

      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-7">


        {/* ================= ADD SCHEDULE ================= */}

        <div className="xl:col-span-2">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* FORM HEADER */}

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">

                  <PlusIcon className="w-6 h-6 text-white" />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Add Schedule
                  </h2>

                  <p className="text-sm text-gray-500">
                    Set your available working hours
                  </p>

                </div>

              </div>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 space-y-5"
            >

              {/* DAY */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Day of Week
                </label>

                <select
                  {...register('day_of_week', {
                    required: 'Day is required',
                  })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500 transition"
                >

                  {dayNames.map((day, index) => (

                    <option
                      key={day}
                      value={index}
                    >
                      {day}
                    </option>

                  ))}

                </select>

                {errors.day_of_week && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.day_of_week.message}
                  </p>
                )}

              </div>


              {/* TIME GRID */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* START */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time
                  </label>

                  <div className="relative">

                    <ClockIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                    <input
                      type="time"
                      {...register('start_time', {
                        required: 'Start time is required',
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                      focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition"
                    />

                  </div>

                  {errors.start_time && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.start_time.message}
                    </p>
                  )}

                </div>


                {/* END */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time
                  </label>

                  <div className="relative">

                    <ClockIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                    <input
                      type="time"
                      {...register('end_time', {
                        required: 'End time is required',
                      })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                      focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition"
                    />

                  </div>

                  {errors.end_time && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.end_time.message}
                    </p>
                  )}

                </div>

              </div>


              {/* SLOT DURATION */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slot Duration
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="5"
                    step="5"
                    {...register('slot_duration', {
                      required: 'Slot duration is required',
                      min: {
                        value: 5,
                        message: 'Minimum duration is 5 minutes',
                      },
                    })}
                    className="w-full px-4 py-3 pr-20 bg-gray-50 border border-gray-200 rounded-xl
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition"
                  />

                  <span className="absolute right-4 top-3 text-sm text-gray-400">
                    minutes
                  </span>

                </div>

                {errors.slot_duration && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.slot_duration.message}
                  </p>
                )}

              </div>


              {/* INFO BOX */}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

                <div className="flex gap-3">

                  <ClockIcon className="w-5 h-5 text-blue-600 mt-0.5" />

                  <div>

                    <p className="text-sm font-semibold text-blue-900">
                      Schedule Preview
                    </p>

                    <p className="text-sm text-blue-700 mt-1">
                      Patients will be able to book appointments
                      during these available hours.
                    </p>

                  </div>

                </div>

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white
                py-3.5 rounded-xl font-semibold shadow-sm
                transition flex items-center justify-center gap-2
                disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {saving ? (

                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                    Saving...
                  </>

                ) : (

                  <>
                    <PlusIcon className="w-5 h-5" />

                    Add Schedule
                  </>

                )}

              </button>

            </form>

          </div>

        </div>


        {/* ================= MY SCHEDULE ================= */}

        <div className="xl:col-span-3">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    My Schedule
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Your current availability
                  </p>

                </div>

                <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                  {schedules.length} schedules
                </div>

              </div>

            </div>


            {/* CONTENT */}

            <div className="p-6">

              {loading ? (

                <div className="flex flex-col items-center justify-center py-16">

                  <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

                  <p className="text-gray-500 mt-4">
                    Loading schedules...
                  </p>

                </div>

              ) : schedules.length === 0 ? (

                <div className="text-center py-16">

                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">

                    <CalendarDaysIcon className="w-10 h-10 text-gray-400" />

                  </div>

                  <h3 className="text-lg font-semibold text-gray-700 mt-5">
                    No schedules yet
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Add your first schedule using the form.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {schedules.map((schedule) => (

                    <div
                      key={schedule.id}
                      className="group border border-gray-100 rounded-2xl p-5
                      hover:border-blue-200 hover:shadow-md
                      transition-all duration-200"
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        {/* LEFT */}

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">

                            <CalendarDaysIcon className="w-6 h-6 text-blue-600" />

                          </div>

                          <div>

                            <div className="flex items-center gap-2">

                              <h3 className="font-bold text-gray-900">
                                {schedule.day_name}
                              </h3>

                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  schedule.is_active
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {schedule.is_active
                                  ? 'Active'
                                  : 'Inactive'}
                              </span>

                            </div>

                            <div className="flex items-center gap-2 mt-2 text-gray-500">

                              <ClockIcon className="w-4 h-4" />

                              <span className="text-sm">
                                {schedule.start_time} - {schedule.end_time}
                              </span>

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="flex items-center justify-between sm:justify-end gap-4">

                          <div className="text-right">

                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                              Slot
                            </p>

                            <p className="font-semibold text-gray-700 mt-1">
                              {schedule.slot_duration} min
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(schedule.id)
                            }
                            className="w-10 h-10 rounded-xl flex items-center justify-center
                            text-red-500 bg-red-50 hover:bg-red-100
                            hover:text-red-600 transition"
                            title="Delete schedule"
                          >

                            <TrashIcon className="w-5 h-5" />

                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default DoctorSchedule;