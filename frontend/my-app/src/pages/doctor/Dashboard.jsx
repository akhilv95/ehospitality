import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI, doctorAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    scheduledAppointments: 0,
    totalPrescriptions: 0,
    totalSchedules: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [appointmentsRes, prescriptionsRes, schedulesRes] = await Promise.all([
        appointmentAPI.getAll(),
        prescriptionAPI.getAll(),
        doctorAPI.getSchedules(),
      ]);

      const appointmentList = appointmentsRes.data.results || appointmentsRes.data || [];
      const prescriptionList = prescriptionsRes.data.results || prescriptionsRes.data || [];
      const scheduleList = schedulesRes.data.results || schedulesRes.data || [];

      setAppointments(appointmentList.slice(0, 5));
      setStats({
        totalAppointments: appointmentList.length,
        scheduledAppointments: appointmentList.filter(
          (a) => a.status === 'scheduled' || a.status === 'confirmed'
        ).length,
        totalPrescriptions: prescriptionList.length,
        totalSchedules: scheduleList.length,
      });
    } catch (error) {
      console.error('Dashboard load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Appointments',
      value: stats.totalAppointments,
      icon: CalendarIcon,
      color: 'bg-blue-500',
      link: '/doctor/appointments',
    },
    {
      title: 'Scheduled Today/Upcoming',
      value: stats.scheduledAppointments,
      icon: ClockIcon,
      color: 'bg-green-500',
      link: '/doctor/appointments',
    },
    {
      title: 'Prescriptions',
      value: stats.totalPrescriptions,
      icon: ClipboardDocumentListIcon,
      color: 'bg-purple-500',
      link: '/doctor/prescriptions',
    },
    {
      title: 'Schedule Slots',
      value: stats.totalSchedules,
      icon: UserGroupIcon,
      color: 'bg-orange-500',
      link: '/doctor/schedule',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, Dr. {user?.first_name}
        </h1>
        <p className="text-gray-600">Here is your doctor dashboard overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          <Link to="/doctor/appointments" className="text-primary-600 text-sm hover:underline">
            View all
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {appointment.patient_detail?.user?.first_name} {appointment.patient_detail?.user?.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{appointment.type_display}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.date}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
