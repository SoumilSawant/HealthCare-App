import {
  createRecord,
  callRpc,
  deleteRecord,
  getRecord,
  listRecords,
  updateRecord,
  request
} from "./client";
import { DEMO_MODE } from "./demo";
import type {
  Doctor,
  DoctorScheduleException,
  ListOptions
} from "../types/domain";

export const doctorsApi = {
  list(options?: ListOptions<Doctor>) {
    return listRecords<Doctor>("Doctor", { fields: ["*"], ...options });
  },
  get(name: string) {
    return getRecord<Doctor>("Doctor", name);
  },
  update(name: string, values: Partial<Doctor>) {
    if (DEMO_MODE) return updateRecord<Doctor>("Doctor", name, values);
    return callRpc<Doctor>("soulplace.api.update_doctor_profile", { values });
  },
  saveSchedule(values: {
    schedule_json: string;
    availability?: string;
    status?: Doctor["status"];
    teleconsult_enabled?: 0 | 1;
    avg_consult_duration_mins?: number;
  }) {
    if (DEMO_MODE) {
      return updateRecord<Doctor>("Doctor", "DOC-DEMO-001", values);
    }
    return callRpc<Doctor>("soulplace.api.save_doctor_schedule", values);
  },
  getSlots(doctor: string, date: string) {
    return request<string[]>("/api/method/soulplace.api.get_doctor_slots", {
      method: "POST",
      body: { doctor, date }
    }).then((response): string[] => {
      if (Array.isArray(response)) return response;
      const wrapped = response as unknown as { message?: unknown };
      return Array.isArray(wrapped.message)
        ? wrapped.message.filter((value): value is string => typeof value === "string")
        : [];
    });
  },
  listScheduleExceptions(
    options?: ListOptions<DoctorScheduleException>
  ) {
    return listRecords<DoctorScheduleException>("Doctor Schedule Exception", {
      fields: ["*"],
      ...options
    });
  },
  createScheduleException(
    values: Omit<Partial<DoctorScheduleException>, "name">
  ) {
    if (!DEMO_MODE) {
      return callRpc<DoctorScheduleException>(
        "soulplace.api.create_schedule_exception",
        { values }
      );
    }
    return createRecord<DoctorScheduleException>(
      "Doctor Schedule Exception",
      values
    );
  },
  updateScheduleException(
    name: string,
    values: Partial<DoctorScheduleException>
  ) {
    if (!DEMO_MODE) {
      return callRpc<DoctorScheduleException>(
        "soulplace.api.update_schedule_exception",
        { name, values }
      );
    }
    return updateRecord<DoctorScheduleException>(
      "Doctor Schedule Exception",
      name,
      values
    );
  },
  deleteScheduleException(name: string) {
    if (!DEMO_MODE) {
      return callRpc<void>("soulplace.api.delete_schedule_exception", { name });
    }
    return deleteRecord("Doctor Schedule Exception", name);
  }
};
