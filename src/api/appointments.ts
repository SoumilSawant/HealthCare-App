import {
  createRecord,
  callRpc,
  getRecord,
  listRecords,
  updateRecord
} from "./client";
import { DEMO_MODE } from "./demo";
import type {
  Appointment,
  AppointmentAuditTimeline,
  ListOptions
} from "../types/domain";

export type AppointmentCreate = Pick<
  Appointment,
  | "patient"
  | "doctor"
  | "appointment_date"
  | "appointment_time"
  | "status"
  | "symptoms"
  | "booking_source"
  | "is_teleconsult"
>;

export const appointmentsApi = {
  list(options?: ListOptions<Appointment>) {
    if (!DEMO_MODE) {
      return callRpc<Appointment[]>("soulplace.api.list_portal_appointments", {
        limit: options?.limitPageLength ?? 100
      }).then((data) => ({ data }));
    }
    return listRecords<Appointment>("Appointment", {
      fields: ["*"],
      ...options
    });
  },
  get(name: string) {
    if (!DEMO_MODE) {
      return callRpc<Appointment>("soulplace.api.get_portal_appointment", { name });
    }
    return getRecord<Appointment>("Appointment", name);
  },
  create(values: Omit<Partial<Appointment>, "name">) {
    return createRecord<Appointment>("Appointment", values);
  },
  book(
    values: Omit<Partial<Appointment>, "name" | "patient" | "status">,
    consents: { privacy: boolean; telemedicine: boolean; version: string }
  ) {
    if (DEMO_MODE) {
      return createRecord<Appointment>("Appointment", {
        ...values,
        patient: "PAT-DEMO-001",
        status: "Pending"
      });
    }
    return callRpc<Appointment>("soulplace.api.book_appointment", {
      doctor: values.doctor,
      appointment_date: values.appointment_date,
      appointment_time: values.appointment_time,
      symptoms: values.symptoms,
      is_teleconsult: values.is_teleconsult,
      privacy_consent: consents.privacy,
      telemedicine_consent: consents.telemedicine,
      consent_version: consents.version
    });
  },
  cancel(name: string, reason: string) {
    if (DEMO_MODE) return updateRecord<Appointment>("Appointment", name, { status: "Cancelled", cancel_reason: reason });
    return callRpc<Appointment>("soulplace.api.update_appointment_status", { name, status: "Cancelled", reason });
  },
  confirm(name: string) {
    if (DEMO_MODE) return updateRecord<Appointment>("Appointment", name, { status: "Confirmed" });
    return callRpc<Appointment>("soulplace.api.update_appointment_status", { name, status: "Confirmed" });
  },
  complete(name: string) {
    if (DEMO_MODE) return updateRecord<Appointment>("Appointment", name, { status: "Completed" });
    return callRpc<Appointment>("soulplace.api.update_appointment_status", { name, status: "Completed" });
  },
  reschedule(name: string, appointment_date: string, appointment_time: string, reason = "") {
    if (DEMO_MODE) return updateRecord<Appointment>("Appointment", name, { appointment_date, appointment_time });
    return callRpc<Appointment>("soulplace.api.reschedule_appointment", { name, appointment_date, appointment_time, reason });
  },
  timeline(appointment: string) {
    return listRecords<AppointmentAuditTimeline>(
      "Appointment Audit Timeline",
      {
        fields: ["*"],
        filters: [["appointment", "=", appointment]],
        orderBy: "event_time asc",
        limitPageLength: 100
      }
    );
  }
};
