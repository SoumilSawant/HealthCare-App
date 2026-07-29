import { Link, Navigate, Route, Routes } from "react-router-dom";
import { ArrowRight, HeartHandshake, ShieldCheck, Stethoscope } from "lucide-react";
import {
  GuestOnly,
  RequireAdmin,
  RequireApprovedDoctor,
  RequireDoctor,
  RequirePatient
} from "./auth/guards";
import { useAuth } from "./auth/AuthProvider";
import { AdminShell, DoctorShell, PatientShell } from "./components/Shells";
import { Brand, LoadingPage } from "./components/ui";
import {
  DoctorPendingPage,
  DoctorRegisterPage,
  ForgotPasswordPage,
  OtpLoginPage,
  PatientRegisterPage,
  PortalLogin
} from "./pages/auth";
import {
  BookingConfirmedPage,
  BookingPage,
  DoctorDetailPage,
  DoctorDiscoveryPage,
  HelpPage,
  MoodCheckPage,
  MoodResultsPage,
  PatientAppointmentDetailPage,
  PatientAppointmentsPage,
  PatientConsultationPage,
  PatientDashboardPage,
  PatientPrescriptionsPage,
  PatientProfilePage,
  PatientSettingsPage,
  PaymentMethodsPage,
  ResourceDetailPage,
  ResourcesPage,
  SafetyPage
} from "./pages/patient";
import {
  ConsultationWorkspacePage,
  DoctorAppointmentDetailPage,
  DoctorAppointmentsPage,
  DoctorAvailabilityPage,
  DoctorConsultationsPage,
  DoctorDashboardPage,
  DoctorPrescriptionsPage,
  DoctorProfilePage,
  DoctorRequestsPage,
  DoctorSettingsPage,
  ScheduleExceptionsPage
} from "./pages/doctor";
import {
  AdminAppointmentsPage,
  AdminAuditPage,
  AdminConsentsPage,
  AdminConsultationsPage,
  AdminDashboardPage,
  AdminDoctorDetailPage,
  AdminDoctorsPage,
  AdminPatientsPage,
  AdminPrescriptionsPage,
  AdminScheduleExceptionsPage,
  AdminTeleconsultsPage
} from "./pages/admin";

function LandingPage() {
  const auth = useAuth();
  if (auth.status === "restoring") return <LoadingPage label="Welcome to SoulPlace" />;
  if (auth.status === "authenticated") {
    if (auth.portal === "doctor" && auth.doctor?.approval_status !== "Approved") {
      return <Navigate to="/doctor/pending" replace />;
    }
    return <Navigate to={`/${auth.portal}/dashboard`} replace />;
  }
  return (
    <main className="landing-page">
      <header><Brand /></header>
      <section>
        <p className="eyebrow">One place. Three focused care experiences.</p>
        <h1>Welcome to a calmer way to care.</h1>
        <p>Choose the secure SoulPlace portal that belongs to you.</p>
        <div className="portal-card-grid">
          <Link to="/patient/login" className="portal-card">
            <span className="shortcut-icon sage"><HeartHandshake /></span>
            <h2>Patient</h2>
            <p>Appointments, wellness check-ins, resources, and care summaries.</p>
            <strong>Open patient portal <ArrowRight /></strong>
          </Link>
          <Link to="/doctor/login" className="portal-card">
            <span className="shortcut-icon gold"><Stethoscope /></span>
            <h2>Doctor</h2>
            <p>Requests, calendar, consultation notes, and availability.</p>
            <strong>Open doctor portal <ArrowRight /></strong>
          </Link>
          <Link to="/admin/login" className="portal-card">
            <span className="shortcut-icon blue"><ShieldCheck /></span>
            <h2>Admin</h2>
            <p>Approvals, operations, records, and audit visibility.</p>
            <strong>Open admin portal <ArrowRight /></strong>
          </Link>
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="state-page">
      <span className="brand-mark">S</span>
      <h1>That page isn’t here</h1>
      <p>The link may be outdated or you may not have access to it.</p>
      <Link className="button button-primary" to="/">Return to SoulPlace</Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/patient/login" element={<GuestOnly portal="patient"><PortalLogin portal="patient" /></GuestOnly>} />
      <Route path="/patient/register" element={<GuestOnly portal="patient"><PatientRegisterPage /></GuestOnly>} />
      <Route path="/patient/otp-login" element={<GuestOnly portal="patient"><OtpLoginPage /></GuestOnly>} />
      <Route path="/patient/forgot-password" element={<GuestOnly portal="patient"><ForgotPasswordPage portal="patient" /></GuestOnly>} />
      <Route element={<RequirePatient />}>
        <Route path="/patient" element={<PatientShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboardPage />} />
          <Route path="mood-check" element={<MoodCheckPage />} />
          <Route path="mood-check/results" element={<MoodResultsPage />} />
          <Route path="safety" element={<SafetyPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="resources/:id" element={<ResourceDetailPage />} />
          <Route path="doctors" element={<DoctorDiscoveryPage />} />
          <Route path="doctors/:doctorId" element={<DoctorDetailPage />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="booking-confirmed" element={<BookingConfirmedPage />} />
          <Route path="appointments" element={<PatientAppointmentsPage />} />
          <Route path="appointments/:appointmentId" element={<PatientAppointmentDetailPage />} />
          <Route path="consultations/:consultationId" element={<PatientConsultationPage />} />
          <Route path="prescriptions" element={<PatientPrescriptionsPage />} />
          <Route path="profile" element={<PatientProfilePage />} />
          <Route path="settings" element={<PatientSettingsPage />} />
          <Route path="payment-methods" element={<PaymentMethodsPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>
      </Route>

      <Route path="/doctor/login" element={<GuestOnly portal="doctor"><PortalLogin portal="doctor" /></GuestOnly>} />
      <Route path="/doctor/register" element={<GuestOnly portal="doctor"><DoctorRegisterPage /></GuestOnly>} />
      <Route path="/doctor/forgot-password" element={<GuestOnly portal="doctor"><ForgotPasswordPage portal="doctor" /></GuestOnly>} />
      <Route element={<RequireDoctor />}>
        <Route path="/doctor/pending" element={<DoctorPendingPage />} />
        <Route element={<RequireApprovedDoctor />}>
          <Route path="/doctor" element={<DoctorShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboardPage />} />
            <Route path="requests" element={<DoctorRequestsPage />} />
            <Route path="appointments" element={<DoctorAppointmentsPage />} />
            <Route path="appointments/:appointmentId" element={<DoctorAppointmentDetailPage />} />
            <Route path="availability" element={<DoctorAvailabilityPage />} />
            <Route path="schedule-exceptions" element={<ScheduleExceptionsPage />} />
            <Route path="consultations" element={<DoctorConsultationsPage />} />
            <Route path="consultations/:consultationId" element={<ConsultationWorkspacePage />} />
            <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
            <Route path="profile" element={<DoctorProfilePage />} />
            <Route path="settings" element={<DoctorSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/admin/login" element={<GuestOnly portal="admin"><PortalLogin portal="admin" /></GuestOnly>} />
      <Route path="/admin/forgot-password" element={<GuestOnly portal="admin"><ForgotPasswordPage portal="admin" /></GuestOnly>} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="patients" element={<AdminPatientsPage />} />
          <Route path="doctors" element={<AdminDoctorsPage />} />
          <Route path="doctors/:doctorId" element={<AdminDoctorDetailPage />} />
          <Route path="appointments" element={<AdminAppointmentsPage />} />
          <Route path="consultations" element={<AdminConsultationsPage />} />
          <Route path="prescriptions" element={<AdminPrescriptionsPage />} />
          <Route path="consents" element={<AdminConsentsPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
          <Route path="teleconsults" element={<AdminTeleconsultsPage />} />
          <Route path="schedule-exceptions" element={<AdminScheduleExceptionsPage />} />
          <Route path="profile" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
