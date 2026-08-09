import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  BookOpen,
  Brain,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  HeartHandshake,
  Languages,
  LifeBuoy,
  MessageCircleHeart,
  PhoneCall,
  PlayCircle,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Video,
  WalletCards
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { appointmentsApi } from "../api/appointments";
import { consentsApi } from "../api/consents";
import { consultationsApi } from "../api/consultations";
import { doctorsApi } from "../api/doctors";
import { patientsApi } from "../api/patients";
import { prescriptionsApi } from "../api/prescriptions";
import { teleconsultApi } from "../api/teleconsult";
import {
  AppointmentCard,
  AppointmentTimeline,
  Breadcrumbs,
  Button,
  Calendar,
  ConsentBanner,
  ConfirmDialog,
  DoctorCard,
  EmptyState,
  ErrorState,
  FormField,
  IntegrationNotice,
  LoadingSkeleton,
  PageHeader,
  SearchFilterBar,
  SelectField,
  StatCard,
  StatusBadge,
  TextAreaField,
  TimeSlotPicker,
  useToast
} from "../components/ui";
import { UtilityLinks } from "../components/Shells";
import type {
  Appointment,
  Consultation,
  Doctor,
  PatientConsentRecord
} from "../types/domain";

function usePatientAppointments() {
  const auth = useAuth();
  return useQuery({
    queryKey: ["appointments", "patient", auth.patient?.name],
    queryFn: () =>
      appointmentsApi.list({
        filters: [["patient", "=", auth.patient?.name || ""]],
        orderBy: "appointment_date asc, appointment_time asc",
        limitPageLength: 100
      }),
    enabled: Boolean(auth.patient?.name)
  });
}

export function PatientDashboardPage() {
  const auth = useAuth();
  const appointments = usePatientAppointments();
  const consultations = useQuery({
    queryKey: ["consultations", "patient-dashboard", auth.patient?.name],
    queryFn: () =>
      consultationsApi.list({
        orderBy: "creation desc",
        limitPageLength: 3
      }),
    enabled: Boolean(auth.patient?.name)
  });
  const now = new Date();
  const upcoming = appointments.data?.data.find((appointment) => {
    const date = new Date(
      `${appointment.appointment_date}T${appointment.appointment_time || "00:00"}`
    );
    return date >= now && appointment.status !== "Cancelled";
  });
  const firstName = auth.patient?.name1?.split(" ")[0] || "there";
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <section className="patient-hero">
        <div>
          <p className="eyebrow">{greeting}, {firstName}</p>
          <h1>How are you feeling today?</h1>
          <p>Your care space is ready whenever you are.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/patient/mood-check">
              <MessageCircleHeart /> Check in with yourself
            </Link>
            <Link className="button button-secondary" to="/patient/doctors">
              Find a doctor <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="hero-orb" aria-hidden="true">
          <span />
          <HeartHandshake />
        </div>
      </section>

      <div className="shortcut-grid">
        <Link className="shortcut-card" to="/patient/mood-check">
          <span className="shortcut-icon sage"><Brain /></span>
          <strong>Mood check</strong>
          <small>A gentle 2-minute reflection</small>
        </Link>
        <Link className="shortcut-card" to="/patient/doctors">
          <span className="shortcut-icon gold"><Stethoscope /></span>
          <strong>Find a doctor</strong>
          <small>Explore approved professionals</small>
        </Link>
        <Link className="shortcut-card" to="/patient/resources">
          <span className="shortcut-icon blue"><BookOpen /></span>
          <strong>Wellness library</strong>
          <small>Guides for everyday support</small>
        </Link>
        <Link className="shortcut-card crisis" to="/patient/safety">
          <span className="shortcut-icon rose"><LifeBuoy /></span>
          <strong>Emergency support</strong>
          <small>Immediate safety resources</small>
        </Link>
      </div>

      <div className="dashboard-grid patient-dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Next in your care</p>
              <h2>Upcoming appointment</h2>
            </div>
            <Link to="/patient/appointments">View all</Link>
          </div>
          {appointments.isLoading ? (
            <LoadingSkeleton rows={2} />
          ) : appointments.isError ? (
            <ErrorState error={appointments.error} onRetry={() => void appointments.refetch()} />
          ) : upcoming ? (
            <AppointmentCard
              appointment={upcoming}
              actions={
                <>
                  <Link className="text-link" to={`/patient/appointments/${upcoming.name}`}>
                    View details <ArrowRight />
                  </Link>
                  {upcoming.is_teleconsult ? (
                    <Link className="button button-secondary" to={`/patient/appointments/${upcoming.name}`}>
                      <Video /> Join when ready
                    </Link>
                  ) : null}
                </>
              }
            />
          ) : (
            <EmptyState
              title="Nothing scheduled yet"
              description="When you’re ready, find a doctor who feels right for you."
              action={<Link className="button button-primary" to="/patient/doctors">Find a doctor</Link>}
              icon={<CalendarDays />}
            />
          )}
        </section>

        <aside className="panel care-note">
          <span className="shortcut-icon gold"><Sparkles /></span>
          <p className="eyebrow">A note for today</p>
          <blockquote>
            “You don’t have to have everything figured out to take one kind step
            toward yourself.”
          </blockquote>
          <Link to="/patient/resources">Explore a 5-minute reset <ArrowRight /></Link>
        </aside>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Your care journey</p>
            <h2>Recent consultation summary</h2>
          </div>
        </div>
        {consultations.isLoading ? (
          <LoadingSkeleton rows={2} compact />
        ) : consultations.isError ? (
          <ErrorState error={consultations.error} onRetry={() => void consultations.refetch()} />
        ) : consultations.data?.data.length ? (
          <div className="summary-list">
            {consultations.data.data.map((consultation) => (
              <Link key={consultation.name} to={`/patient/consultations/${consultation.name}`}>
                <span className="shortcut-icon sage"><BookHeart /></span>
                <span>
                  <strong>{consultation.patient_friendly_summary || "Consultation summary"}</strong>
                  <small>{consultation.follow_up_date ? `Follow-up ${consultation.follow_up_date}` : "Open summary"}</small>
                </span>
                <ArrowRight />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No consultation summaries"
            description="Patient-friendly notes will appear here after a completed consultation."
          />
        )}
      </section>
    </>
  );
}

export function DoctorDiscoveryPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [teleconsult, setTeleconsult] = useState(false);
  const [maxFee, setMaxFee] = useState("");
  const doctors = useQuery({
    queryKey: ["doctors", "discovery"],
    queryFn: () =>
      doctorsApi.list({
        filters: [
          ["approval_status", "=", "Approved"]
        ],
        orderBy: "full_name asc",
        limitPageLength: 200
      })
  });
  const specialties = useMemo(
    () =>
      Array.from(new Set(doctors.data?.data.map((doctor) => doctor.specialty).filter(Boolean))).sort(),
    [doctors.data]
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (doctors.data?.data || []).filter((doctor) => {
      const matchesSearch =
        !query ||
        doctor.full_name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.specialization_tags?.toLowerCase().includes(query);
      return (
        matchesSearch &&
        (!specialty || doctor.specialty === specialty) &&
        (!teleconsult || Boolean(doctor.teleconsult_enabled)) &&
        (!maxFee || Number(doctor.consultation_fee) <= Number(maxFee))
      );
    });
  }, [doctors.data, search, specialty, teleconsult, maxFee]);

  return (
    <>
      <PageHeader
        eyebrow="Find the right support"
        title="Doctors who listen"
        description="Explore approved SoulPlace professionals by specialty, fee, and consultation format."
      />
      <SearchFilterBar value={search} onChange={setSearch} placeholder="Search by name, specialty, or focus area">
        <SelectField label="Specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
          <option value="">All specialties</option>
          {specialties.map((item) => <option key={item}>{item}</option>)}
        </SelectField>
        <FormField label="Maximum fee" type="number" min={0} value={maxFee} onChange={(event) => setMaxFee(event.target.value)} placeholder="₹ Any" />
        <label className="toggle-field">
          <input type="checkbox" checked={teleconsult} onChange={(event) => setTeleconsult(event.target.checked)} />
          <span />
          Video available
        </label>
      </SearchFilterBar>
      {doctors.isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : doctors.isError ? (
        <ErrorState error={doctors.error} onRetry={() => void doctors.refetch()} />
      ) : filtered.length ? (
        <div className="doctor-grid">
          {filtered.map((doctor) => <DoctorCard doctor={doctor} key={doctor.name} />)}
        </div>
      ) : (
        <EmptyState
          title="No doctors match those filters"
          description="Try a broader specialty, fee range, or search term."
          action={<Button variant="secondary" onClick={() => { setSearch(""); setSpecialty(""); setMaxFee(""); setTeleconsult(false); }}>Clear filters</Button>}
          icon={<Search />}
        />
      )}
    </>
  );
}

export function DoctorDetailPage() {
  const { doctorId } = useParams();
  const doctor = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => doctorsApi.get(doctorId || ""),
    enabled: Boolean(doctorId)
  });
  if (doctor.isLoading) return <LoadingSkeleton rows={7} />;
  if (doctor.isError) return <ErrorState error={doctor.error} onRetry={() => void doctor.refetch()} />;
  if (!doctor.data) return <EmptyState title="Doctor not found" description="This doctor profile may no longer be available." />;
  const item = doctor.data;
  const tags = item.specialization_tags?.split(",").map((tag) => tag.trim()).filter(Boolean) || [];
  return (
    <>
      <Breadcrumbs items={[{ label: "Doctors", to: "/patient/doctors" }, { label: item.full_name }]} />
      <section className="doctor-profile-hero">
        <div className="avatar avatar-profile">{item.full_name.charAt(0)}</div>
        <div>
          <div className="profile-title">
            <div>
              <p className="eyebrow">{item.specialty}</p>
              <h1>{item.full_name}</h1>
            </div>
            <StatusBadge status={item.status} />
          </div>
          <div className="tag-list">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <p className="profile-intro">A verified SoulPlace professional offering thoughtful, confidential support.</p>
        </div>
        <div className="booking-summary-card">
          <p>Consultation fee</p>
          <strong>₹{Number(item.consultation_fee || 0).toLocaleString()}</strong>
          <ul>
            <li><Clock3 /> {item.avg_consult_duration_mins || 30} minutes</li>
            <li><Video /> {item.teleconsult_enabled ? "Teleconsult available" : "In-person consultation"}</li>
            <li><CalendarCheck /> {item.availability || "Availability not configured"}</li>
          </ul>
          <Link className="button button-primary" to={`/patient/book?doctor=${encodeURIComponent(item.name)}`}>
            Book consultation
          </Link>
        </div>
      </section>
      <div className="detail-grid">
        <section className="panel">
          <h2>About this practice</h2>
          <p>Specialty: {item.specialty}</p>
          <p>Professional availability is read directly from the Doctor record.</p>
        </section>
        <section className="panel">
          <h2>Available slots</h2>
          <p className="text-secondary" style={{ marginBottom: "1rem" }}>
            The doctor's actual availability will be calculated during the booking process based on their schedule and existing appointments.
          </p>
          <Link className="button button-secondary" to={`/patient/book?doctor=${encodeURIComponent(item.name)}`}>
            Check times and book <ArrowRight />
          </Link>
        </section>
      </div>
    </>
  );
}

interface BookingForm {
  doctor: string;
  date: string;
  time: string;
  type: "teleconsult" | "in-person";
  symptoms: string;
  privacyConsent: boolean;
  telemedicineConsent: boolean;
}

function AvailableSlots({ doctor, date, value, onChange }: { doctor: string; date: string; value: string; onChange: (v: string) => void }) {
  const query = useQuery({
    queryKey: ["doctor-slots", doctor, date],
    queryFn: () => doctorsApi.getSlots(doctor, date)
  });
  
  if (query.isLoading) return <div className="slots-container"><LoadingSkeleton rows={2} /></div>;
  if (query.isError) return <div className="slots-container"><ErrorState error={query.error} /></div>;
  
  const slots = query.data || [];
  
  return (
    <div className="slots-container">
      <h3 style={{ margin: "1rem 0 0.5rem" }}>Available Times</h3>
      {slots.length ? (
        <div className="time-grid">
          {slots.map((time: string) => (
            <button
              key={time}
              type="button"
              className={`time-pill ${value === time ? "selected" : ""}`}
              onClick={() => onChange(time)}
            >
              {time.substring(0, 5)}
            </button>
          ))}
        </div>
      ) : (
        <EmptyState title="No slots available" description="This doctor has no available time slots on this date." />
      )}
    </div>
  );
}

export function BookingPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingForm>({
    doctor: params.get("doctor") || "",
    date: "",
    time: "",
    type: "teleconsult",
    symptoms: "",
    privacyConsent: false,
    telemedicineConsent: false
  });
  const doctors = useQuery({
    queryKey: ["doctors", "booking"],
    queryFn: () => doctorsApi.list({
      filters: [["approval_status", "=", "Approved"], ["status", "=", "Active"]],
      fields: ["*"],
      limitPageLength: 200
    })
  });
  const selectedDoctor = doctors.data?.data.find((doctor) => doctor.name === form.doctor);
  const create = useMutation({
    mutationFn: async () => {
      if (!auth.patient?.name) throw new Error("No patient profile is linked.");
      const appointment = await appointmentsApi.create({
        patient: auth.patient.name,
        doctor: form.doctor,
        appointment_date: form.date,
        appointment_time: form.time,
        status: "Pending",
        symptoms: form.symptoms,
        booking_source: "Web",
        is_teleconsult: form.type === "teleconsult" ? 1 : 0
      });
      await consentsApi.grant(auth.patient.name, "Privacy");
      if (form.type === "teleconsult") {
        await consentsApi.grant(auth.patient.name, "Telemedicine");
      }
      return appointment;
    },
    onSuccess: (appointment) => {
      void queryClient.invalidateQueries({ queryKey: ["appointments", "patient"] });
      toast.notify("Appointment request sent.");
      navigate("/patient/booking-confirmed", {
        replace: true,
        state: { appointment }
      });
    }
  });
  const set = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const minDate = new Date().toISOString().slice(0, 10);
  const canContinue =
    step === 1
      ? Boolean(form.doctor)
      : step === 2
        ? Boolean(form.date && form.time)
        : step === 3
          ? Boolean(form.symptoms.trim() && form.privacyConsent && (form.type !== "teleconsult" || form.telemedicineConsent))
          : true;

  return (
    <>
      <Breadcrumbs items={[{ label: "Doctors", to: "/patient/doctors" }, { label: "Book consultation" }]} />
      <PageHeader
        eyebrow={`Booking · Step ${step} of 4`}
        title={["Choose your doctor", "Choose a time", "Tell us what you need", "Review your request"][step - 1]}
        description="Your request is sent to the doctor for confirmation."
      />
      <div className="booking-layout">
        <section className="panel booking-form-panel">
          <div className="progress-track"><span style={{ transform: `scaleX(${step / 4})` }} /></div>
          {step === 1 && (
            doctors.isLoading ? <LoadingSkeleton rows={4} /> :
            doctors.isError ? <ErrorState error={doctors.error} onRetry={() => void doctors.refetch()} /> :
            <SelectField label="Doctor" value={form.doctor} onChange={(event) => set("doctor", event.target.value)} required>
              <option value="">Select a doctor</option>
              {doctors.data!.data.map((doctor) => <option value={doctor.name} key={doctor.name}>{doctor.full_name} · {doctor.specialty}</option>)}
            </SelectField>
          )}
          {step === 2 && (
            <>
              <Calendar value={form.date} onChange={(value) => set("date", value)} min={minDate} />
              {form.date && <AvailableSlots doctor={form.doctor} date={form.date} value={form.time} onChange={(val) => set("time", val)} />}
            </>
          )}
          {step === 3 && (
            <>
              <fieldset className="choice-cards">
                <legend>Consultation type</legend>
                <label className={form.type === "teleconsult" ? "selected" : ""}>
                  <input type="radio" name="type" value="teleconsult" checked={form.type === "teleconsult"} onChange={() => set("type", "teleconsult")} disabled={!selectedDoctor?.teleconsult_enabled} />
                  <Video /><span><strong>Video consultation</strong><small>{selectedDoctor?.teleconsult_enabled ? "Join securely online" : "Not offered by this doctor"}</small></span>
                </label>
                <label className={form.type === "in-person" ? "selected" : ""}>
                  <input type="radio" name="type" value="in-person" checked={form.type === "in-person"} onChange={() => set("type", "in-person")} />
                  <Stethoscope /><span><strong>In-person</strong><small>Visit the care location</small></span>
                </label>
              </fieldset>
              <TextAreaField label="Symptoms or reason for consultation" value={form.symptoms} onChange={(event) => set("symptoms", event.target.value)} placeholder="Share what you’d like support with. This goes to your doctor." required />
              <label className="consent-check">
                <input type="checkbox" checked={form.privacyConsent} onChange={(event) => set("privacyConsent", event.target.checked)} />
                <span><strong>Privacy consent</strong>I agree to the processing of this appointment information.</span>
              </label>
              {form.type === "teleconsult" && (
                <label className="consent-check">
                  <input type="checkbox" checked={form.telemedicineConsent} onChange={(event) => set("telemedicineConsent", event.target.checked)} />
                  <span><strong>Telemedicine consent</strong>I understand the benefits and limitations of remote care.</span>
                </label>
              )}
            </>
          )}
          {step === 4 && (
            <div className="booking-review">
              <div className="avatar avatar-doctor">{selectedDoctor?.full_name?.charAt(0) || "D"}</div>
              <h2>{selectedDoctor?.full_name}</h2>
              <p>{selectedDoctor?.specialty}</p>
              <dl>
                <div><dt>Date</dt><dd>{form.date}</dd></div>
                <div><dt>Time</dt><dd>{form.time}</dd></div>
                <div><dt>Format</dt><dd>{form.type === "teleconsult" ? "Video consultation" : "In-person"}</dd></div>
                <div><dt>Fee</dt><dd>₹{Number(selectedDoctor?.consultation_fee || 0).toLocaleString()}</dd></div>
                <div><dt>Status</dt><dd><StatusBadge status="Pending" /></dd></div>
              </dl>
              <p className="review-symptoms"><strong>Your note</strong>{form.symptoms}</p>
            </div>
          )}
          {create.isError && <ErrorState error={create.error} title="Appointment could not be created" />}
          <div className="sticky-actions">
            {step > 1 && <Button variant="ghost" onClick={() => setStep((value) => value - 1)}>Back</Button>}
            {step < 4 ? (
              <Button disabled={!canContinue} onClick={() => setStep((value) => value + 1)}>Continue <ArrowRight /></Button>
            ) : (
              <Button disabled={create.isPending} onClick={() => create.mutate()}>
                {create.isPending ? "Sending request…" : "Confirm appointment request"}
              </Button>
            )}
          </div>
        </section>
        <aside className="panel trust-panel">
          <ShieldCheck />
          <h2>Your privacy matters</h2>
          <p>Appointment details are sent directly to your configured Frappe site using its authenticated session.</p>
          <ul>
            <li><CheckCircle2 /> No medical data in localStorage</li>
            <li><CheckCircle2 /> Role-protected portal</li>
            <li><CheckCircle2 /> Explicit consent record</li>
          </ul>
        </aside>
      </div>
    </>
  );
}

export function BookingConfirmedPage() {
  const location = useLocation();
  const appointment = (location.state as { appointment?: Appointment } | null)?.appointment;
  if (!appointment) return <Navigate to="/patient/appointments" replace />;
  return (
    <section className="confirmation-page">
      <span className="confirmation-icon"><CheckCircle2 /></span>
      <p className="eyebrow">Request received</p>
      <h1>Your appointment is on its way</h1>
      <p>The doctor will review your request. You’ll see the status update in your appointments.</p>
      <div className="confirmation-card">
        <StatusBadge status={appointment.status} />
        <dl>
          <div><dt>Date</dt><dd>{appointment.appointment_date}</dd></div>
          <div><dt>Time</dt><dd>{appointment.appointment_time}</dd></div>
          <div><dt>Reference</dt><dd>{appointment.name}</dd></div>
        </dl>
      </div>
      <div className="hero-actions">
        <Link className="button button-primary" to={`/patient/appointments/${appointment.name}`}>View appointment</Link>
        <Link className="button button-secondary" to="/patient/dashboard">Back to dashboard</Link>
      </div>
    </section>
  );
}

export function PatientAppointmentsPage() {
  const query = usePatientAppointments();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const now = new Date().toISOString().slice(0, 10);
  const rows = (query.data?.data || []).filter((appointment) =>
    tab === "upcoming"
      ? appointment.appointment_date >= now && appointment.status !== "Cancelled"
      : appointment.appointment_date < now || ["Completed", "Cancelled"].includes(appointment.status)
  );
  return (
    <>
      <PageHeader
        eyebrow="Your care calendar"
        title="Appointments"
        description="Review upcoming requests, completed care, and cancellations."
        actions={<Link className="button button-primary" to="/patient/doctors">Book a consultation</Link>}
      />
      <div className="tab-list" role="tablist">
        <button className={tab === "upcoming" ? "active" : ""} onClick={() => setTab("upcoming")} role="tab">Upcoming</button>
        <button className={tab === "past" ? "active" : ""} onClick={() => setTab("past")} role="tab">Past</button>
      </div>
      {query.isLoading ? <LoadingSkeleton rows={5} /> :
        query.isError ? <ErrorState error={query.error} onRetry={() => void query.refetch()} /> :
        rows.length ? (
          <div className="appointment-list">
            {rows.map((appointment) => (
              <AppointmentCard
                key={appointment.name}
                appointment={appointment}
                actions={<Link className="text-link" to={`/patient/appointments/${appointment.name}`}>View details <ArrowRight /></Link>}
              />
            ))}
          </div>
        ) : (
          <EmptyState title={tab === "upcoming" ? "No upcoming appointments" : "No past appointments"} description={tab === "upcoming" ? "Find a doctor when you’re ready to take the next step." : "Completed and cancelled appointments will appear here."} action={tab === "upcoming" ? <Link className="button button-primary" to="/patient/doctors">Find a doctor</Link> : undefined} icon={<CalendarDays />} />
        )}
    </>
  );
}

export function PatientAppointmentDetailPage() {
  const auth = useAuth();
  const { appointmentId } = useParams();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reason, setReason] = useState("");
  const appointment = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => appointmentsApi.get(appointmentId || ""),
    enabled: Boolean(appointmentId)
  });
  const timeline = useQuery({
    queryKey: ["appointment-timeline", appointmentId],
    queryFn: () => appointmentsApi.timeline(appointmentId || ""),
    enabled: Boolean(appointmentId)
  });
  const teleconsult = useQuery({
    queryKey: ["teleconsult", appointmentId],
    queryFn: () => teleconsultApi.list({ filters: [["appointment", "=", appointmentId || ""]], fields: ["*"], limitPageLength: 1 }),
    enabled: Boolean(appointmentId && appointment.data?.is_teleconsult)
  });
  const cancel = useMutation({
    mutationFn: () => appointmentsApi.cancel(appointmentId || "", reason),
    onSuccess: () => {
      toast.notify("Appointment cancelled.");
      setConfirmOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
      void queryClient.invalidateQueries({ queryKey: ["appointments", "patient"] });
    }
  });
  if (appointment.isLoading) return <LoadingSkeleton rows={6} />;
  if (appointment.isError) return <ErrorState error={appointment.error} onRetry={() => void appointment.refetch()} />;
  if (!appointment.data || appointment.data.patient !== auth.patient?.name) {
    return <ErrorState error={new Error("You do not have access to this appointment.")} />;
  }
  const item = appointment.data;
  const session = teleconsult.data?.data[0];
  return (
    <>
      <Breadcrumbs items={[{ label: "Appointments", to: "/patient/appointments" }, { label: item.name }]} />
      <PageHeader title="Appointment details" description={`Reference ${item.name}`} actions={<StatusBadge status={item.status} />} />
      <div className="detail-grid">
        <section className="panel detail-card">
          <dl className="detail-list">
            <div><dt>Doctor</dt><dd>{item.doctor}</dd></div>
            <div><dt>Date</dt><dd>{item.appointment_date}</dd></div>
            <div><dt>Time</dt><dd>{item.appointment_time}</dd></div>
            <div><dt>Consultation type</dt><dd>{item.is_teleconsult ? "Teleconsult" : "In-person"}</dd></div>
            <div><dt>Reason</dt><dd>{item.symptoms || "Not provided"}</dd></div>
            {item.cancel_reason && <div><dt>Cancellation reason</dt><dd>{item.cancel_reason}</dd></div>}
          </dl>
          <div className="card-actions">
            {session?.meeting_link && ["Created", "Live"].includes(session.session_status) && (
              <a className="button button-primary" href={session.meeting_link} target="_blank" rel="noreferrer"><Video /> Join teleconsult</a>
            )}
            {["Pending", "Confirmed"].includes(item.status) && (
              <>
                <Button variant="secondary" onClick={() => setConfirmOpen(true)}>Cancel appointment</Button>
                <Link className="button button-ghost" to={`/patient/book?doctor=${encodeURIComponent(item.doctor)}`}>Request reschedule</Link>
              </>
            )}
          </div>
        </section>
        <section className="panel">
          <h2>Appointment timeline</h2>
          {timeline.isLoading ? <LoadingSkeleton rows={3} compact /> :
            timeline.isError ? <ErrorState error={timeline.error} onRetry={() => void timeline.refetch()} /> :
            timeline.data?.data.length ? <AppointmentTimeline events={timeline.data.data} /> :
            <EmptyState title="No audit events" description="Timeline events will appear when the backend records them." />}
        </section>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this appointment?"
        description="This updates the appointment status to Cancelled. Add a reason before continuing."
        confirmLabel="Cancel appointment"
        destructive
        busy={cancel.isPending}
        confirmDisabled={!reason.trim()}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => cancel.mutate()}
      >
        <div className="dialog-inline-field">
          <TextAreaField label="Cancellation reason" value={reason} onChange={(event) => setReason(event.target.value)} />
        </div>
      </ConfirmDialog>
    </>
  );
}

export function PatientConsultationPage() {
  const { consultationId } = useParams();
  const consultation = useQuery({
    queryKey: ["consultation", consultationId],
    queryFn: () => consultationsApi.get(consultationId || ""),
    enabled: Boolean(consultationId)
  });
  const prescriptions = useQuery({
    queryKey: ["prescriptions", consultationId],
    queryFn: () => prescriptionsApi.list({ filters: [["consultation", "=", consultationId || ""]], fields: ["*"], limitPageLength: 100 }),
    enabled: Boolean(consultationId)
  });
  if (consultation.isLoading) return <LoadingSkeleton rows={7} />;
  if (consultation.isError) return <ErrorState error={consultation.error} onRetry={() => void consultation.refetch()} />;
  if (!consultation.data) return <EmptyState title="Consultation not found" description="This consultation summary is unavailable." />;
  return (
    <>
      <Breadcrumbs items={[{ label: "Appointments", to: "/patient/appointments" }, { label: "Consultation summary" }]} />
      <PageHeader eyebrow="Your care summary" title="Consultation notes" description="A patient-friendly view shared by your doctor." />
      <div className="detail-grid">
        <section className="panel patient-summary">
          <span className="shortcut-icon sage"><BookHeart /></span>
          <h2>Summary from your doctor</h2>
          <p>{consultation.data.patient_friendly_summary || "Your doctor has not added a patient-friendly summary yet."}</p>
          <dl className="detail-list">
            <div><dt>Follow-up date</dt><dd>{consultation.data.follow_up_date || "Not scheduled"}</dd></div>
            <div><dt>Care plan</dt><dd>{consultation.data.soap_plan || "Not shared"}</dd></div>
          </dl>
        </section>
        <section className="panel">
          <h2>Prescriptions</h2>
          {prescriptions.isLoading ? <LoadingSkeleton rows={3} compact /> :
            prescriptions.isError ? <ErrorState error={prescriptions.error} onRetry={() => void prescriptions.refetch()} /> :
            prescriptions.data?.data.length ? (
              <div className="prescription-list">
                {prescriptions.data.data.map((item) => (
                  <article key={item.name}><PillIcon /><div><strong>{item.medicine_name}</strong><p>{item.dosage}</p><small>{item.instructions}</small></div></article>
                ))}
              </div>
            ) : <EmptyState title="No prescriptions" description="No medicines are linked to this consultation." />}
        </section>
      </div>
    </>
  );
}

function PillIcon() {
  return <span className="shortcut-icon gold"><CreditCard /></span>;
}

export function PatientPrescriptionsPage() {
  const prescriptions = useQuery({
    queryKey: ["prescriptions", "patient"],
    queryFn: () => prescriptionsApi.list({ fields: ["*"], orderBy: "creation desc", limitPageLength: 100 })
  });
  return (
    <>
      <PageHeader eyebrow="Medication" title="Prescriptions" description="Medicines recorded by your care team." />
      <IntegrationNotice>
        The current backend grants Prescription access only to System Manager. Patient access requires corrected read permissions and record-level scoping.
      </IntegrationNotice>
      {prescriptions.isLoading ? <LoadingSkeleton rows={5} /> :
        prescriptions.isError ? <ErrorState error={prescriptions.error} onRetry={() => void prescriptions.refetch()} /> :
        prescriptions.data!.data.length ? <div className="prescription-list">{prescriptions.data!.data.map((item) => <article key={item.name}><PillIcon /><div><strong>{item.medicine_name}</strong><p>{item.dosage}</p><small>{item.instructions || "No additional instructions"}</small></div></article>)}</div> :
        <EmptyState title="No prescriptions" description="Prescriptions from your consultations will appear here." />}
    </>
  );
}

const moodQuestions = [
  "Over the last two weeks, how often have you felt little interest or pleasure in doing things?",
  "How often have you felt down, low, or without hope?",
  "How often have worry or anxious thoughts felt difficult to control?",
  "How often have you had trouble relaxing or sleeping well?",
  "How supported and connected have you felt to people you trust?"
];
const moodOptions = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 }
];

export function MoodCheckPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const answer = (value: number) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    if (index === moodQuestions.length - 1) {
      navigate("/patient/mood-check/results", { state: { score: next.reduce((sum, item) => sum + item, 0) } });
    } else setIndex(index + 1);
  };
  return (
    <section className="assessment-page">
      <Link className="back-link" to="/patient/dashboard"><ArrowLeft /> Leave check-in</Link>
      <div className="assessment-card">
        <div className="assessment-head">
          <span className="shortcut-icon sage"><Brain /></span>
          <p className="eyebrow">A private moment for you</p>
          <h1>Mood check-in</h1>
          <p>Choose the answer that feels closest. This is a wellness reflection, not a diagnosis.</p>
        </div>
        <div className="assessment-progress">
          <span>Question {index + 1} of {moodQuestions.length}</span>
          <div className="progress-track"><span style={{ transform: `scaleX(${(index + 1) / moodQuestions.length})` }} /></div>
        </div>
        <h2>{moodQuestions[index]}</h2>
        <div className="answer-list">
          {moodOptions.map((option) => (
            <button key={option.value} onClick={() => answer(option.value)}>
              <span>{option.label}</span><ArrowRight />
            </button>
          ))}
        </div>
        {index > 0 && <Button variant="ghost" onClick={() => setIndex(index - 1)}><ArrowLeft /> Previous question</Button>}
      </div>
    </section>
  );
}

export function MoodResultsPage() {
  const location = useLocation();
  const score = (location.state as { score?: number } | null)?.score;
  if (score === undefined) return <Navigate to="/patient/mood-check" replace />;
  const level = score <= 4 ? "Steady" : score <= 9 ? "Some strain" : "Extra support may help";
  const description = score <= 4 ? "Your responses suggest things feel fairly manageable right now." : score <= 9 ? "Your responses suggest some difficult moments. Small acts of care and connection may help." : "Your responses suggest you may be carrying a lot. Consider reaching out to a trusted person or professional.";
  return (
    <section className="results-page">
      <span className="results-orb"><Sparkles /></span>
      <p className="eyebrow">Your check-in</p>
      <h1>{level}</h1>
      <p>{description}</p>
      <div className="result-meter" aria-label={`Wellness reflection score ${score} out of 15`}>
        <span style={{ transform: `scaleX(${Math.max(0.12, score / 15)})` }} />
      </div>
      <small>Reflection score {score}/15 · not a clinical diagnosis</small>
      <div className="recommendation-grid">
        <article><span className="shortcut-icon sage"><BookOpen /></span><h2>Try a gentle reset</h2><p>Explore breathing, grounding, and sleep resources.</p><Link to="/patient/resources">Open library <ArrowRight /></Link></article>
        <article><span className="shortcut-icon gold"><Stethoscope /></span><h2>Talk with a professional</h2><p>Find an approved SoulPlace doctor.</p><Link to="/patient/doctors">Find support <ArrowRight /></Link></article>
        <article className="crisis-card"><span className="shortcut-icon rose"><LifeBuoy /></span><h2>Need urgent help?</h2><p>Open immediate safety guidance and local emergency options.</p><Link to="/patient/safety">Safety support <ArrowRight /></Link></article>
      </div>
      <Link className="button button-secondary" to="/patient/dashboard">Return to dashboard</Link>
    </section>
  );
}

const wellnessResources = [
  { id: "grounding-54321", title: "The 5–4–3–2–1 grounding practice", category: "Anxiety", format: "Guide", duration: "5 min", summary: "Use your senses to reconnect with the present moment.", body: "Pause and notice five things you can see, four you can feel, three you can hear, two you can smell, and one you can taste. Move gently and breathe naturally." },
  { id: "gentle-sleep", title: "A gentler wind-down for sleep", category: "Sleep", format: "Guide", duration: "8 min", summary: "Create a low-pressure bridge from a busy day to rest.", body: "Dim the room, set tomorrow’s concerns down on paper, and choose one quiet activity. Rest is useful even before sleep arrives." },
  { id: "name-the-feeling", title: "Name what you’re feeling", category: "Emotions", format: "Article", duration: "6 min", summary: "Build emotional clarity without judging the feeling.", body: "Try: I notice I feel ___. It makes sense because ___. What I need most right now may be ___. You do not have to solve the feeling to listen to it." },
  { id: "breathing-space", title: "Three-minute breathing space", category: "Stress", format: "Video", duration: "3 min", summary: "A short pause for a crowded mind.", body: "Notice what is here, gather attention around the breath, then expand awareness to the whole body. Let your next action be deliberate." },
  { id: "support-conversation", title: "Starting a support conversation", category: "Connection", format: "Article", duration: "7 min", summary: "Simple words for telling someone you need company.", body: "You might say: I’ve been having a difficult time and I don’t need you to fix it. Could you stay with me and listen for a while?" },
  { id: "self-compassion", title: "A self-compassion break", category: "Self-care", format: "Guide", duration: "4 min", summary: "Respond to a hard moment with less self-criticism.", body: "Acknowledge: this is hard. Remember: difficulty is part of being human. Offer: may I be kind to myself in this moment." }
];

export function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const categories = Array.from(new Set(wellnessResources.map((item) => item.category)));
  const rows = wellnessResources.filter((item) =>
    (!search || `${item.title} ${item.summary}`.toLowerCase().includes(search.toLowerCase())) &&
    (!category || item.category === category)
  );
  return (
    <>
      <PageHeader eyebrow="Wellness library" title="Support for everyday moments" description="Short, accessible practices you can return to at your own pace." />
      <SearchFilterBar value={search} onChange={setSearch} placeholder="Search the library">
        <SelectField label="Category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}
        </SelectField>
      </SearchFilterBar>
      <IntegrationNotice title="Editorial content">
        No Resource DocType or saved-resource endpoint exists in the audited backend. These wellness guides are packaged editorial content; saving is intentionally disabled.
      </IntegrationNotice>
      {rows.length ? <div className="resource-grid">{rows.map((item) => (
        <article className="resource-card" key={item.id}>
          <div className={`resource-art art-${item.category.toLowerCase()}`}><span>{item.format === "Video" ? <PlayCircle /> : <BookOpen />}</span></div>
          <div><p className="eyebrow">{item.category} · {item.duration}</p><h2>{item.title}</h2><p>{item.summary}</p><div className="card-actions"><Link className="text-link" to={`/patient/resources/${item.id}`}>Open resource <ArrowRight /></Link><Button variant="ghost" disabled aria-label="Save resource unavailable"><Save /> Save</Button></div></div>
        </article>
      ))}</div> : <EmptyState title="No resources found" description="Try a different keyword or category." />}
    </>
  );
}

export function ResourceDetailPage() {
  const { id } = useParams();
  const resource = wellnessResources.find((item) => item.id === id);
  if (!resource) return <EmptyState title="Resource not found" description="This wellness resource is unavailable." action={<Link className="button button-secondary" to="/patient/resources">Back to library</Link>} />;
  return (
    <article className="resource-detail">
      <Breadcrumbs items={[{ label: "Resources", to: "/patient/resources" }, { label: resource.title }]} />
      <p className="eyebrow">{resource.category} · {resource.duration}</p>
      <h1>{resource.title}</h1>
      <p className="resource-lede">{resource.summary}</p>
      <div className={`resource-hero-art art-${resource.category.toLowerCase()}`}><BookHeart /></div>
      <section className="article-body">
        <h2>Take this at your own pace</h2>
        <p>{resource.body}</p>
        <aside><strong>A gentle reminder</strong><p>This resource supports wellbeing but does not replace professional or emergency care.</p></aside>
      </section>
      <div className="card-actions"><Link className="button button-secondary" to="/patient/resources"><ArrowLeft /> Back to library</Link><Button disabled variant="ghost"><Save /> Save resource</Button></div>
    </article>
  );
}

export function SafetyPage() {
  return (
    <section className="safety-page">
      <div className="safety-hero">
        <span><HeartHandshake /></span>
        <p className="eyebrow">Immediate support</p>
        <h1>You deserve help right now.</h1>
        <p>If you may hurt yourself or someone else, or you are in immediate danger, contact your local emergency services now or go to the nearest emergency department.</p>
        <a className="button button-danger" href="tel:112"><PhoneCall /> Call emergency services (112 in India)</a>
      </div>
      <div className="safety-grid">
        <article><h2>Move toward safety</h2><ol><li>Step away from anything you could use to hurt yourself.</li><li>Go where another trusted person is present.</li><li>Say clearly: “I’m not feeling safe and I need you to stay with me.”</li></ol></article>
        <article><h2>Ground in this minute</h2><p>Place both feet on the floor. Name five things you see. Breathe out longer than you breathe in. Keep another person with you.</p></article>
        <article><h2>Your emergency contact</h2><p>{/* Exact profile values only. */}Use the trusted contact saved in your profile, or call someone who can be physically present.</p><Link to="/patient/profile">Review emergency contact <ArrowRight /></Link></article>
      </div>
      <aside className="safety-note"><ShieldCheck /><p>SoulPlace is not an emergency response service and this page is not monitored. In urgent danger, use local emergency services.</p></aside>
    </section>
  );
}

export function PatientProfilePage() {
  const auth = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => ({ ...auth.patient }));
  const save = useMutation({
    mutationFn: () => patientsApi.update(auth.patient?.name || "", form),
    onSuccess: () => {
      toast.notify("Profile updated.");
      void auth.restore();
      void queryClient.invalidateQueries({ queryKey: ["patient"] });
    }
  });
  if (!auth.patient) return <ErrorState error={new Error("No patient profile is linked to this account.")} />;
  return (
    <>
      <PageHeader eyebrow="Personal details" title="Your profile" description="Keep your contact and care preferences current." />
      <div className="profile-layout">
        <aside className="panel profile-aside"><div className="avatar avatar-profile">{auth.patient.name1.charAt(0)}</div><h2>{auth.patient.name1}</h2><p>{auth.patient.phoneno}</p><StatusBadge status={auth.patient.consent_status || "Pending"} /><UtilityLinks portal="patient" /></aside>
        <section className="panel">
          <form className="form-grid" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}>
            <FormField label="Name" value={form.name1 || ""} onChange={(event) => setForm((current) => ({ ...current, name1: event.target.value }))} required />
            <div className="form-grid two-column">
              <FormField label="Phone number" value={form.phoneno || ""} disabled hint="Phone changes require identity verification." />
              <FormField label="Age" type="number" min={13} max={120} value={form.age || ""} onChange={(event) => setForm((current) => ({ ...current, age: Number(event.target.value) }))} />
            </div>
            <SelectField label="Preferred language" value={form.preferred_language || ""} onChange={(event) => setForm((current) => ({ ...current, preferred_language: event.target.value as "English" | "Hindi" | "Marathi" }))}>
              <option value="">Select</option><option>English</option><option>Hindi</option><option>Marathi</option>
            </SelectField>
            <div className="form-grid two-column">
              <FormField label="Emergency contact name" value={form.emergency_contact_name || ""} onChange={(event) => setForm((current) => ({ ...current, emergency_contact_name: event.target.value }))} />
              <FormField label="Emergency contact phone" type="tel" value={form.emergency_contact_phone || ""} onChange={(event) => setForm((current) => ({ ...current, emergency_contact_phone: event.target.value }))} />
            </div>
            {save.isError && <ErrorState error={save.error} />}
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save profile"}</Button>
          </form>
        </section>
      </div>
    </>
  );
}

export function PatientSettingsPage() {
  const auth = useAuth();
  const consents = useQuery({
    queryKey: ["consents", auth.patient?.name],
    queryFn: () => consentsApi.list({ filters: [["patient", "=", auth.patient?.name || ""]], fields: ["*"], orderBy: "creation desc", limitPageLength: 100 }),
    enabled: Boolean(auth.patient?.name)
  });
  const granted = consents.data?.data.some((item) => item.status === "Granted") || false;
  return (
    <>
      <PageHeader eyebrow="Preferences" title="Settings" description="Manage consent, language, and account preferences." />
      <div className="settings-list">
        <section className="panel"><h2>Consent and privacy</h2>{consents.isLoading ? <LoadingSkeleton rows={2} compact /> : consents.isError ? <ErrorState error={consents.error} onRetry={() => void consents.refetch()} /> : <><ConsentBanner granted={granted} /><div className="summary-list">{consents.data!.data.map((item) => <div className="setting-row" key={item.name}><span><strong>{item.consent_type}</strong><small>Version {item.consent_version || "not recorded"}</small></span><StatusBadge status={item.status} /></div>)}</div></>}</section>
        <section className="panel"><h2>Account security</h2><div className="setting-row"><span><strong>Session authentication</strong><small>Managed by your Frappe session cookie.</small></span><ShieldCheck /></div><div className="setting-row"><span><strong>Local storage</strong><small>Passwords and medical details are never stored there.</small></span><CheckCircle2 /></div></section>
      </div>
    </>
  );
}

export function PaymentMethodsPage() {
  return (
    <>
      <PageHeader eyebrow="Billing" title="Payment methods" description="Manage how consultation fees are paid." />
      <EmptyState title="Payments are not configured" description="The audited backend has no payment DocType or payment-gateway endpoint. No card details are collected or stored." icon={<WalletCards />} />
    </>
  );
}

export function HelpPage() {
  return (
    <>
      <PageHeader eyebrow="Support" title="How can we help?" description="Find guidance for appointments, accounts, and care access." />
      <div className="help-grid">
        <article className="panel"><CalendarDays /><h2>Appointments</h2><p>View status, cancellation, rescheduling, and teleconsult access.</p><Link to="/patient/appointments">Open appointments <ArrowRight /></Link></article>
        <article className="panel"><ShieldCheck /><h2>Privacy and consent</h2><p>Review your current consent records and session security.</p><Link to="/patient/settings">Open privacy settings <ArrowRight /></Link></article>
        <article className="panel crisis-card"><LifeBuoy /><h2>Urgent support</h2><p>Open immediate safety guidance if you or someone else may be at risk.</p><Link to="/patient/safety">Open safety support <ArrowRight /></Link></article>
      </div>
    </>
  );
}
