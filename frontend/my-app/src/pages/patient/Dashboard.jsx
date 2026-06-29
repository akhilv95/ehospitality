import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, prescriptionAPI, billingAPI, } from '../../services/api';
import {
  CalendarIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    pendingBills: 0,
    
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, prescriptionsRes, invoicesRes,recordRes] = await Promise.all([
        appointmentAPI.getAll({ status: 'scheduled' }),
        prescriptionAPI.getAll({ status: 'active' }),
        billingAPI.getInvoices({ status: 'pending' }),
       
      ]);

      setStats({
        upcomingAppointments: appointmentsRes.data.count || appointmentsRes.data.results?.length || 0,
        activePrescriptions: prescriptionsRes.data.count || prescriptionsRes.data.results?.length || 0,
        pendingBills: invoicesRes.data.count || invoicesRes.data.results?.length || 0,
      
      });

      setUpcomingAppointments(appointmentsRes.data.results?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: CalendarIcon,
      color: 'bg-blue-500',
      link: '/patient/appointments',
    },
    {
      title: 'Active Prescriptions',
      value: stats.activePrescriptions,
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
      link: '/patient/prescriptions',
    },
    {
      title: 'Pending Bills',
      value: stats.pendingBills,
      icon: CreditCardIcon,
      color: 'bg-orange-500',
      link: '/patient/billing',
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
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your health today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          <Link to="/patient/appointments" className="text-primary-600 text-sm hover:underline">
            View all
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming appointments</p>
            <Link
              to="/patient/appointments/book"
              className="btn-primary mt-4 inline-block"
            >
              Book Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.doctor_detail?.full_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.type_display}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {format(new Date(appointment.date), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/patient/appointments/book"
            className="p-4 bg-primary-50 rounded-lg text-center hover:bg-primary-100 transition-colors"
          >
            <CalendarIcon className="w-8 h-8 mx-auto text-primary-600 mb-2" />
            <p className="text-sm font-medium text-primary-900">Book Appointment</p>
          </Link>
          <Link
            to="/patient/records"
            className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
          >
            <ClipboardDocumentListIcon className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p className="text-sm font-medium text-green-900">View Records</p>
          </Link>
          <Link
            to="/patient/prescriptions"
            className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
          >
            <ClipboardDocumentListIcon className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <p className="text-sm font-medium text-purple-900">Prescriptions</p>
          </Link>
          <Link
            to="/patient/billing"
            className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors"
          >
            <CreditCardIcon className="w-8 h-8 mx-auto text-orange-600 mb-2" />
            <p className="text-sm font-medium text-orange-900">Pay Bills</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
