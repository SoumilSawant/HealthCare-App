import {
  createRecord,
  getRecord,
  listRecords,
  updateRecord
} from "./client";
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
    return listRecords<Appointment>("Appointment", {
      fields: ["*"],
      ...options
    });
  },
  get(name: string) {
    return getRecord<Appointment>("Appointment", name);
  },
  create(values: AppointmentCreate) {
    return createRecord<Appointment>("Appointment", values);
  },
  update(name: string, values: Partial<Appointment>) {
    return updateRecord<Appointment>("Appointment", name, values);
  },
  cancel(name: string, reason: string) {
    return updateRecord<Appointment>("Appointment", name, {
      status: "Cancelled",
      cancel_reason: reason
    });
  },
  confirm(name: string) {
    return updateRecord<Appointment>("Appointment", name, {
      status: "Confirmed"
    });
  },
  complete(name: string) {
    return updateRecord<Appointment>("Appointment", name, {
      status: "Completed"
    });
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
