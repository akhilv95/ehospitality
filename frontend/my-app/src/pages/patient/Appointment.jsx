import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  CalendarIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await appointmentAPI.getAll(params);
      setAppointments(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await appointmentAPI.cancel(id);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'badge-info',
      confirmed: 'badge-success',
      completed: 'badge-success',
      cancelled: 'badge-danger',
      no_show: 'badge-warning',
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <Link to="/patient/appointments/book" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Book Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'scheduled', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="card text-center py-12">
          <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600 mb-4">You don't have any appointments yet.</p>
          <Link to="/patient/appointments/book" className="btn-primary">
            Book Your First Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointment.doctor_detail?.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {appointment.doctor_detail?.specializations?.map(s => s.name).join(', ')}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
                      </span>
                      <span className="text-gray-600">{appointment.time}</span>
                    </div>
                    {appointment.reason && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {appointment.reason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={getStatusBadge(appointment.status)}>
                    {appointment.status_display}
                  </span>
                  {['scheduled', 'confirmed'].includes(appointment.status) && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel appointment"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
