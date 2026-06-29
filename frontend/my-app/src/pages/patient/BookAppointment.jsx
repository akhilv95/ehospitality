import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { doctorAPI, appointmentAPI, facilityAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  
  const selectedDoctor = watch('doctor');
  const selectedDate = watch('date');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchInitialData = async () => {
    try {
      const [doctorsRes, departmentsRes] = await Promise.all([
        doctorAPI.getAll(),
        facilityAPI.getDepartments(),
      ]);
      setDoctors(doctorsRes.data.results || doctorsRes.data);
      setDepartments(departmentsRes.data.results || departmentsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await doctorAPI.getAvailableSlots(selectedDoctor, selectedDate);
      setAvailableSlots(response.data.slots || []);
    } catch (error) {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await appointmentAPI.create({
        doctor: parseInt(data.doctor),
        department: data.department ? parseInt(data.department) : null,
        date: data.date,
        time: data.time,
        appointment_type: data.appointment_type,
        reason: data.reason,
      });
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (error) {
      const message = error.response?.data?.non_field_errors?.[0] || 'Failed to book appointment';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Doctor *
          </label>
          <select
            {...register('doctor', { required: 'Please select a doctor' })}
            className="input-field"
          >
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.full_name} - {doctor.specializations?.map(s => s.name).join(', ')}
              </option>
            ))}
          </select>
          {errors.doctor && (
            <p className="mt-1 text-sm text-red-600">{errors.doctor.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select {...register('department')} className="input-field">
            <option value="">Select department (optional)</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date *
          </label>
          <input
            type="date"
            {...register('date', { required: 'Please select a date' })}
            min={minDate}
            max={maxDate}
            className="input-field"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        {/* Time Slot Selection */}
        {selectedDoctor && selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots *
            </label>
            {loadingSlots ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No available slots for this date. Please try another date.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <label
                    key={slot}
                    className={`p-2 text-center border rounded-lg cursor-pointer transition-colors ${
                      watch('time') === slot
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('time', { required: 'Please select a time slot' })}
                      value={slot}
                      className="sr-only"
                    />
                    {slot}
                  </label>
                ))}
              </div>
            )}
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>
        )}

        {/* Appointment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Type *
          </label>
          <select
            {...register('appointment_type', { required: 'Please select appointment type' })}
            className="input-field"
          >
            <option value="consultation">Consultation</option>
            <option value="follow_up">Follow Up</option>
            <option value="checkup">Checkup</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Visit
          </label>
          <textarea
            {...register('reason')}
            rows={3}
            className="input-field"
            placeholder="Briefly describe your symptoms or reason for visit..."
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/patient/appointments')}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || availableSlots.length === 0}
            className="btn-primary flex-1 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Book Appointment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
