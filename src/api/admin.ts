import { listRecords, updateRecord } from "./client";
import type {
  Appointment,
  AppointmentAuditTimeline,
  Consultation,
  Doctor,
  PatientConsentRecord,
  PatientUser,
  Prescription,
  TeleconsultSession
} from "../types/domain";

export const adminApi = {
  async dashboardStats() {
    const [patients, doctors, appointments, consultations] = await Promise.all([
      listRecords<PatientUser>("PatientUser", {
        fields: ["name"],
        limitPageLength: 1000
      }),
      listRecords<Doctor>("Doctor", {
        fields: ["name", "approval_status"],
        limitPageLength: 1000
      }),
      listRecords<Appointment>("Patient Appointment", {
        fields: ["name", "appointment_date", "status"],
        limitPageLength: 1000
      }),
      listRecords<Consultation>("Consultation", {
        fields: ["name", "creation"],
        limitPageLength: 1000
      })
    ]);
    const today = new Date().toISOString().slice(0, 10);
    return {
      totalPatients: patients.data.length,
      totalDoctors: doctors.data.length,
      pendingDoctors: doctors.data.filter(
        (doctor) => doctor.approval_status === "Pending"
      ).length,
      todayAppointments: appointments.data.filter(
        (appointment) => appointment.appointment_date === today
      ).length,
      activeConsultations: consultations.data.length,
      cancelledAppointments: appointments.data.filter(
        (appointment) => appointment.status === "Cancelled"
      ).length,
      appointments: appointments.data,
      doctors: doctors.data
    };
  },
  pendingDoctors() {
    return listRecords<Doctor>("Doctor", {
      fields: ["*"],
      filters: [["approval_status", "=", "Pending"]],
      orderBy: "creation asc",
      limitPageLength: 100
    });
  },
  approveDoctor(name: string) {
    return updateRecord<Doctor>("Doctor", name, {
      approval_status: "Approved",
      status: "Active"
    });
  },
  rejectDoctor(name: string) {
    // The backend has no rejection-reason field; only the real status is updated.
    return updateRecord<Doctor>("Doctor", name, {
      approval_status: "Rejected",
      status: "Inactive"
    });
  },
  patients() {
    return listRecords<PatientUser>("PatientUser", {
      fields: ["*"],
      limitPageLength: 500
    });
  },
  doctors() {
    return listRecords<Doctor>("Doctor", {
      fields: ["*"],
      limitPageLength: 500
    });
  },
  appointments() {
    return listRecords<Appointment>("Patient Appointment", {
      fields: ["*"],
      limitPageLength: 500
    });
  },
  consultations() {
    return listRecords<Consultation>("Consultation", {
      fields: ["*"],
      limitPageLength: 500
    });
  },
  prescriptions() {
    return listRecords<Prescription>("Prescription", {
      fields: ["*"],
      limitPageLength: 500
    });
  },
  consents() {
    return listRecords<PatientConsentRecord>("Patient Consent Record", {
      fields: ["*"],
      limitPageLength: 500
    });
  },
  timelines() {
    return listRecords<AppointmentAuditTimeline>(
      "Appointment Audit Timeline",
      { fields: ["*"], orderBy: "event_time desc", limitPageLength: 500 }
    );
  },
  sessions() {
    return listRecords<TeleconsultSession>("Teleconsult Session", {
      fields: ["*"],
      limitPageLength: 500
    });
  }
};
