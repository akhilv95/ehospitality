import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { doctorAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
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
      setSchedules(res.data.results || res.data || []);
    } catch (error) {
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
      toast.error('Failed to add schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await doctorAPI.deleteSchedule(id);
      toast.success('Schedule deleted');
      fetchSchedules();
    } catch (error) {
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Add Schedule</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select
              {...register('day_of_week', { required: 'Day is required' })}
              className="input-field"
            >
              {dayNames.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </select>
            {errors.day_of_week && (
              <p className="mt-1 text-sm text-red-600">{errors.day_of_week.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              {...register('start_time', { required: 'Start time is required' })}
              className="input-field"
            />
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              {...register('end_time', { required: 'End time is required' })}
              className="input-field"
            />
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slot Duration (minutes)
            </label>
            <input
              type="number"
              {...register('slot_duration', { required: 'Slot duration is required' })}
              className="input-field"
            />
            {errors.slot_duration && (
              <p className="mt-1 text-sm text-red-600">{errors.slot_duration.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Add Schedule'
            )}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Schedule</h2>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : schedules.length === 0 ? (
          <p className="text-gray-500">No schedules added yet.</p>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{schedule.day_name}</p>
                  <p className="text-sm text-gray-600">
                    {schedule.start_time} - {schedule.end_time}
                  </p>
                  <p className="text-sm text-gray-500">
                    {schedule.slot_duration} min/slot
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(schedule.id)}
                  className="btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedule;
