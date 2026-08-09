import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Heart,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRoundCheck
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { authApi } from "../api/auth";
import { normalizeApiError, uploadFile } from "../api/client";
import { DEMO_ACCOUNTS, DEMO_MODE } from "../api/demo";
import {
  Brand,
  Button,
  FileUpload,
  FormField,
  IntegrationNotice,
  PasswordField,
  SelectField,
  TextAreaField,
  useToast
} from "../components/ui";
import type { PortalRole } from "../types/domain";

function AuthFrame({
  portal,
  eyebrow,
  title,
  description,
  children
}: {
  portal: PortalRole;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const highlights = {
    patient: [
      "Private, compassionate support",
      "Appointments and care plans in one place",
      "A gentle space for your wellbeing"
    ],
    doctor: [
      "A focused clinical workspace",
      "Secure appointment and consultation records",
      "Built around your daily schedule"
    ],
    admin: [
      "Operational visibility across care",
      "Protected approval workflows",
      "Auditable decisions and activity"
    ]
  }[portal];
  return (
    <main className={`auth-page auth-${portal}`}>
      <section className="auth-story">
        <Brand />
        <div className="auth-story-copy">
          <span className="auth-kicker">
            <Sparkles /> Mental health, thoughtfully supported
          </span>
          <h1>A calmer place to care, connect, and feel understood.</h1>
          <p>
            SoulPlace brings people and care teams together through private,
            human-centered mental-health support.
          </p>
          <ul>
            {highlights.map((highlight) => (
              <li key={highlight}>
                <CheckCircle2 aria-hidden="true" /> {highlight}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth-privacy">
          <ShieldCheck /> Protected by role-based access and secure Frappe
          sessions.
        </p>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-icon" aria-hidden="true">
            {portal === "patient" ? (
              <Heart />
            ) : portal === "doctor" ? (
              <Stethoscope />
            ) : (
              <LockKeyhole />
            )}
          </div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="auth-description">{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

export function PortalLogin({ portal }: { portal: PortalRole }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const labels = {
    patient: {
      eyebrow: "Patient sign in",
      title: "Welcome back",
      description: "Continue to your personal care space.",
      userLabel: "Phone number",
      placeholder: "+91 98765 43210"
    },
    doctor: {
      eyebrow: "Doctor portal",
      title: "Welcome, doctor",
      description: "Sign in to review requests and manage care.",
      userLabel: "Professional email",
      placeholder: "doctor@clinic.com"
    },
    admin: {
      eyebrow: "Administration",
      title: "Operations sign in",
      description: "Restricted to authorized administrative roles.",
      userLabel: "Work email",
      placeholder: "admin@soulplace.com"
    }
  }[portal];
  const demoAccount = DEMO_ACCOUNTS.find(
    (account) =>
      account.portal === portal &&
      (portal !== "doctor" || account.username === "doctor@soulplace.demo")
  );
  const pendingDoctorAccount =
    portal === "doctor"
      ? DEMO_ACCOUNTS.find(
          (account) => account.username === "pending.doctor@soulplace.demo"
        )
      : undefined;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const session = await auth.login({ username, password, portal });
      if (
        portal === "doctor" &&
        session.doctor?.approval_status !== "Approved"
      ) {
        navigate("/doctor/pending", { replace: true });
      } else {
        navigate(`/${portal}/dashboard`, { replace: true });
      }
    } catch (unknownError) {
      setError(normalizeApiError(unknownError).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame portal={portal} {...labels}>
      {DEMO_MODE && demoAccount && (
        <IntegrationNotice title="Frontend demo mode">
          No Frappe requests are made. Use{" "}
          <strong>{demoAccount.username}</strong> with password{" "}
          <strong>{demoAccount.password}</strong>
          {pendingDoctorAccount && (
            <>
              . To test approval blocking, use{" "}
              <strong>{pendingDoctorAccount.username}</strong> with the same
              password
            </>
          )}
          .
        </IntegrationNotice>
      )}
      <form className="auth-form" onSubmit={submit} noValidate>
        <FormField
          label={labels.userLabel}
          type={portal === "patient" ? "tel" : "email"}
          autoComplete="username"
          placeholder={labels.placeholder}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <div className="form-between">
          <label className="check-field">
            <input type="checkbox" /> <span>Keep me signed in</span>
          </label>
          <Link to={`/${portal}/forgot-password`}>Forgot password?</Link>
        </div>
        {error && (
          <p className="form-alert" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy || !username || !password}>
          {busy ? "Signing in…" : "Sign in securely"} <ArrowRight />
        </Button>
      </form>
      {portal !== "admin" && (
        <p className="auth-switch">
          New to SoulPlace?{" "}
          <Link to={`/${portal}/register`}>
            {portal === "doctor" ? "Apply as a doctor" : "Create an account"}
          </Link>
        </p>
      )}
      {portal === "patient" && (
        <div className="auth-alt">
          <span>or</span>
          <Link className="button button-secondary" to="/patient/otp-login">
            Sign in with a one-time code
          </Link>
        </div>
      )}
      <nav className="portal-switcher" aria-label="Switch portal">
        {portal !== "patient" && <Link to="/patient/login">Patient</Link>}
        {portal !== "doctor" && <Link to="/doctor/login">Doctor</Link>}
        {portal !== "admin" && <Link to="/admin/login">Admin</Link>}
      </nav>
    </AuthFrame>
  );
}

interface PatientRegistrationState {
  name1: string;
  phoneno: string;
  email: string;
  password: string;
  age: string;
  gender: string;
  livingstatus: string;
  therapyexp: string;
  preferred_language: "English" | "Hindi" | "Marathi";
  emergency_contact_name: string;
  emergency_contact_phone: string;
  consent: boolean;
}

export function PatientRegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<PatientRegistrationState>({
    name1: "",
    phoneno: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    livingstatus: "",
    therapyexp: "",
    preferred_language: "English",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    consent: false
  });
  const set = <K extends keyof PatientRegistrationState>(
    key: K,
    value: PatientRegistrationState[K]
  ) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await authApi.registerPatient({
        phoneno: form.phoneno,
        email: form.email,
        password: form.password,
        name1: form.name1,
        age: Number(form.age),
        gender: form.gender,
        livingstatus: form.livingstatus,
        therapyexp: form.therapyexp,
        preferred_language: form.preferred_language,
        emergency_contact_name: form.emergency_contact_name,
        emergency_contact_phone: form.emergency_contact_phone,
        consent_accepted: form.consent,
        consent_version: import.meta.env.VITE_CONSENT_VERSION || "1.0"
      });
      if (!result.patient?.name) {
        throw new Error("Patient profile was not returned by the backend.");
      }
      const session = await auth.restore();
      if (session.portal !== "patient") {
        throw new Error(
          "Account created, but the backend did not assign or link the Patient App User role. An administrator must correct the account before sign-in."
        );
      }
      toast.notify("Your SoulPlace account has been created.");
      navigate("/patient/dashboard", { replace: true });
    } catch (unknownError) {
      setError(normalizeApiError(unknownError).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame
      portal="patient"
      eyebrow={`Create account · Step ${step} of 2`}
      title={step === 1 ? "Let’s start with you" : "Your care preferences"}
      description="We only ask for details configured in your SoulPlace patient profile."
    >
      <div className="progress-track" aria-label={`Step ${step} of 2`}>
        <span style={{ transform: `scaleX(${step / 2})` }} />
      </div>
      <form className="auth-form" onSubmit={submit}>
        {step === 1 ? (
          <>
            <FormField
              label="Name"
              autoComplete="name"
              value={form.name1}
              onChange={(event) => set("name1", event.target.value)}
              required
            />
            <FormField
              label="Phone number"
              type="tel"
              autoComplete="tel"
              value={form.phoneno}
              onChange={(event) => set("phoneno", event.target.value)}
              required
            />
            <FormField
              label="Email address"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
              hint="We’ll send appointment updates here."
              required
            />
            <PasswordField
              label="Password"
              autoComplete="new-password"
              minLength={8}
              value={form.password}
              onChange={(event) => set("password", event.target.value)}
              hint="Use at least 8 characters."
              required
            />
            <div className="form-grid two-column">
              <FormField
                label="Age"
                type="number"
                min={13}
                max={120}
                value={form.age}
                onChange={(event) => set("age", event.target.value)}
                required
              />
              <SelectField
                label="Gender"
                value={form.gender}
                onChange={(event) => set("gender", event.target.value)}
                required
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </SelectField>
            </div>
          </>
        ) : (
          <>
            <SelectField
              label="Living status"
              value={form.livingstatus}
              onChange={(event) => set("livingstatus", event.target.value)}
              required
            >
              <option value="">Select</option>
              <option>With family</option>
              <option>Independently</option>
            </SelectField>
            <SelectField
              label="Therapy experience"
              value={form.therapyexp}
              onChange={(event) => set("therapyexp", event.target.value)}
              required
            >
              <option value="">Select</option>
              <option>New to therapy</option>
              <option>Some previous experience</option>
              <option>Currently in therapy</option>
            </SelectField>
            <SelectField
              label="Preferred language"
              value={form.preferred_language}
              onChange={(event) =>
                set(
                  "preferred_language",
                  event.target.value as PatientRegistrationState["preferred_language"]
                )
              }
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
            </SelectField>
            <div className="form-grid two-column">
              <FormField
                label="Emergency contact name"
                value={form.emergency_contact_name}
                onChange={(event) =>
                  set("emergency_contact_name", event.target.value)
                }
              />
              <FormField
                label="Emergency contact phone"
                type="tel"
                value={form.emergency_contact_phone}
                onChange={(event) =>
                  set("emergency_contact_phone", event.target.value)
                }
              />
            </div>
            <label className="consent-check">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => set("consent", event.target.checked)}
                required
              />
              <span>
                <strong>I accept privacy and treatment consent.</strong>
                I understand how SoulPlace processes my care information and that
                I can review or revoke consent later.
              </span>
            </label>
          </>
        )}
        {error && (
          <p className="form-alert" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          {step === 2 && (
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              busy ||
              !form.name1 ||
              !form.phoneno ||
              !form.email ||
              !form.password ||
              !form.age ||
              !form.gender ||
              (step === 2 && (!form.livingstatus || !form.therapyexp || !form.consent))
            }
          >
            {step === 1 ? "Continue" : busy ? "Creating account…" : "Create account"}
          </Button>
        </div>
      </form>
      <p className="auth-switch">
        Already registered? <Link to="/patient/login">Sign in</Link>
      </p>
    </AuthFrame>
  );
}

export function DoctorRegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [verification, setVerification] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setVerification(file);
    setUploading(true);
    setUploadError("");
    try {
      const result = await uploadFile(file, true);
      setUploadedUrl(result.file_url);
    } catch (error) {
      setUploadError(normalizeApiError(error).message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setSubmitError("");

    try {
      const result = await authApi.registerDoctor({
        fullName: String(form.get("fullName") || ""),
        email: String(form.get("email") || ""),
        mobileNumber: String(form.get("mobileNumber") || ""),
        password: String(form.get("password") || ""),
        specialization: String(form.get("specialization") || ""),
        consultationFee: Number(form.get("consultationFee") || 0),
        avgConsultDurationMins: Number(form.get("avgConsultDurationMins") || 0),
        specializationTags: String(form.get("specializationTags") || ""),
        teleconsultEnabled: form.get("teleconsultEnabled") === "on",
        professionalTermsConsent:
          form.get("professionalTermsConsent") === "on",
        verificationProof: uploadedUrl || undefined
      });
      toast.notify(result.message || "Doctor application submitted.");
      navigate("/doctor/login", { replace: true });
    } catch (error) {
      setSubmitError(normalizeApiError(error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame
      portal="doctor"
      eyebrow="Doctor application"
      title="Join the SoulPlace care network"
      description="Applications are reviewed before clinical access is enabled."
    >
      <form className="auth-form" onSubmit={submit}>
        <FormField label="Full name" name="fullName" required />
        <FormField label="Professional email" name="email" type="email" required />
        <div className="form-grid two-column">
          <FormField label="Mobile number" name="mobileNumber" type="tel" required />
          <PasswordField label="Password" name="password" minLength={8} required />
        </div>
        <FormField label="Specialty" name="specialization" required />
        <div className="form-grid two-column">
          <FormField label="Consultation fee" name="consultationFee" type="number" min={0} required />
          <FormField
            label="Average duration (minutes)"
            name="avgConsultDurationMins"
            type="number"
            min={5}
            step={5}
            required
          />
        </div>
        <TextAreaField
          label="Specialization tags"
          name="specializationTags"
          hint="Comma-separated, as configured by Doctor.specialization_tags."
        />
        <FormField
          label="Medical registration information"
          disabled
          hint="No matching Doctor field exists in the backend."
        />
        <FileUpload
          label={uploading ? "Uploading verification…" : "Verification document"}
          accept=".pdf,image/png,image/jpeg"
          onFile={(file) => void upload(file)}
          value={uploadedUrl || verification?.name}
        />
        {uploadError && <p className="form-alert">{uploadError}</p>}
        <label className="check-field">
          <input type="checkbox" name="teleconsultEnabled" /> <span>Available for teleconsultation</span>
        </label>
        <label className="consent-check">
          <input type="checkbox" name="professionalTermsConsent" />
          <span>
            <strong>Professional terms and consent</strong>I confirm the
            information supplied is accurate and agree to clinical standards.
          </span>
        </label>
        {submitError && <p className="form-alert">{submitError}</p>}
        <Button type="submit" disabled={busy || uploading}>
          {busy ? "Submitting application…" : "Submit application"}
        </Button>
      </form>
      <p className="auth-switch">
        Already applied? <Link to="/doctor/login">Sign in</Link>
      </p>
    </AuthFrame>
  );
}

export function DoctorPendingPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const status = auth.doctor?.approval_status ?? "Pending";

  if (auth.status === "anonymous") return <Navigate to="/doctor/login" replace />;
  if (status === "Approved") return <Navigate to="/doctor/dashboard" replace />;

  const refresh = async () => {
    setBusy(true);
    const session = await auth.restore();
    setBusy(false);
    if (session.doctor?.approval_status === "Approved") {
      navigate("/doctor/dashboard", { replace: true });
    }
  };

  return (
    <AuthFrame
      portal="doctor"
      eyebrow="Application status"
      title={status === "Rejected" ? "Application not approved" : "Application under review"}
      description={
        status === "Rejected"
          ? "Your current application status is Rejected."
          : "Your clinical workspace remains protected while our team verifies your application."
      }
    >
      <div className={`approval-state approval-${status.toLowerCase()}`}>
        {status === "Rejected" ? <LockKeyhole /> : <Clock3 />}
        <div>
          <StatusLine
            complete
            title="Application submitted"
            detail="Your Doctor record is on file."
          />
          <StatusLine
            complete={status === "Rejected"}
            active={status === "Pending"}
            title="Credential review"
            detail={
              status === "Rejected"
                ? "Review completed"
                : "Verification is in progress"
            }
          />
          <StatusLine
            active={status === "Rejected"}
            title={status === "Rejected" ? "Rejected" : "Access approval"}
            detail={
              status === "Rejected"
                ? "The backend has no rejection-reason field to display."
                : "Dashboard access unlocks after approval."
            }
          />
        </div>
      </div>
      <Button onClick={() => void refresh()} disabled={busy} icon={<RefreshCw />}>
        {busy ? "Refreshing…" : "Refresh approval status"}
      </Button>
      <Button variant="ghost" onClick={() => void auth.logout()}>
        Sign out
      </Button>
    </AuthFrame>
  );
}

function StatusLine({
  complete,
  active,
  title,
  detail
}: {
  complete?: boolean;
  active?: boolean;
  title: string;
  detail: string;
}) {
  return (
    <div className={`status-line ${complete ? "complete" : ""} ${active ? "active" : ""}`}>
      <span>{complete ? <CheckCircle2 /> : active ? <Clock3 /> : null}</span>
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </div>
  );
}

export function OtpLoginPage() {
  return (
    <AuthFrame
      portal="patient"
      eyebrow="One-time code"
      title="Sign in with your phone"
      description="A secure OTP flow needs a server-side verification endpoint."
    >
      <IntegrationNotice>
        The audited backend has no OTP request or verification RPC. Password
        authentication remains available without storing credentials in the
        browser.
      </IntegrationNotice>
      <Link className="button button-primary" to="/patient/login">
        Use password sign in
      </Link>
    </AuthFrame>
  );
}

export function ForgotPasswordPage({ portal }: { portal: PortalRole }) {
  return (
    <AuthFrame
      portal={portal}
      eyebrow="Account recovery"
      title="Reset your password"
      description="Password recovery must be issued and delivered by your Frappe site."
    >
      <IntegrationNotice>
        No SoulPlace password-reset RPC or delivery channel is configured in the
        backend. Ask your site administrator to reset access securely.
      </IntegrationNotice>
      <Link className="button button-primary" to={`/${portal}/login`}>
        Return to sign in
      </Link>
    </AuthFrame>
  );
}
