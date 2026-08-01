import {
  createRecord,
  deleteRecord,
  getRecord,
  listRecords,
  updateRecord,
  request
} from "./client";
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
    return updateRecord<Doctor>("Doctor", name, values);
  },
  saveSchedule(schedule_json: string, availability: string = "") {
    return request<any>("/api/method/soulplace.api.save_doctor_schedule", {
      method: "POST",
      body: { schedule_json, availability }
    });
  },
  getSlots(doctor: string, date: string) {
    return request<string[]>("/api/method/soulplace.api.get_doctor_slots", {
      method: "POST",
      body: { doctor, date }
    }).then(res => Array.isArray(res) ? res : ((res as any).message || []));
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
    return createRecord<DoctorScheduleException>(
      "Doctor Schedule Exception",
      values
    );
  },
  updateScheduleException(
    name: string,
    values: Partial<DoctorScheduleException>
  ) {
    return updateRecord<DoctorScheduleException>(
      "Doctor Schedule Exception",
      name,
      values
    );
  },
  deleteScheduleException(name: string) {
    return deleteRecord("Doctor Schedule Exception", name);
  }
};
