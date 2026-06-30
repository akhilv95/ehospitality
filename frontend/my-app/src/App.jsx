
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import Profile from './pages/patient/Profile';
import PatientAppointments from './pages/patient/Appointment';
import BookAppointment from './pages/patient/BookAppointment';
import PatientMedicalRecords from './pages/patient/MedicalRecords';
import PatientPrescriptions from './pages/patient/Prescriptions';
import PatientHealthResources from './pages/patient/HealthResources';
import PatientBilling from './pages/patient/Billing';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';
import DoctorPrescriptions from './pages/doctor/Prescriptions';
import DoctorMedicalRecords from "./pages/doctor/MedicalRecords";
import DoctorSchedule from './pages/doctor/Schedule';
//admin
import Dashboard from './pages/admin/Dashboard';
import Doctors from './pages/admin/Doctors';
import Patients from "./pages/admin/Patients";
import Analytics from "./pages/admin/Analytics";



// Create placeholder components for other pages
const PlaceholderPage = ({ title }) => (
  <div className="card">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-600 mt-2">This page is under construction.</p>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
    path="/patient/profile"
    element={
        <ProtectedRoute allowedRoles={["patient"]}>
            <Layout>
                <Profile />
            </Layout>
        </ProtectedRoute>
    }
/>
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientAppointments />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments/book"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <BookAppointment />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/records"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientMedicalRecords />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientPrescriptions />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/billing"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientBilling/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/resources"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientHealthResources/>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            {/* <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <PlaceholderPage title="Doctor Dashboard" />
                  </Layout>
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />



            <Route

  path="/doctor/appointments"
  element={
    <ProtectedRoute allowedRoles={['doctor']}>
      <Layout>
        <DoctorAppointments />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorPatients />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorPrescriptions />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
    path="/doctor/medical-records"
    element={
        <ProtectedRoute allowedRoles={["doctor"]}>
            <Layout>
                <DoctorMedicalRecords />
            </Layout>
        </ProtectedRoute>
    }
/>
            <Route
              path="/doctor/schedule"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorSchedule />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/*"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <PlaceholderPage title="Doctor Module" />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Dashboard/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <Doctors/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
    path="/admin/patients"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <Patients />
        </ProtectedRoute>
    }
/>
<Route
  path="/admin/analytics"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Analytics />
    </ProtectedRoute>
  }
/>
            {/* <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="doctors" element={<Doctors />} />
  <Route path="patients" element={<Patients />} />
  <Route path="appointments" element={<Appointments />} />
  <Route path="billing" element={<Billing />} />
  <Route path="reports" element={<Reports />} />
</Route> */}

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

