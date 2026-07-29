import { getRecord, listRecords, updateRecord } from "./client";
import type { ListOptions, PatientUser } from "../types/domain";

export const patientsApi = {
  list(options?: ListOptions<PatientUser>) {
    return listRecords<PatientUser>("PatientUser", {
      fields: ["*"],
      ...options
    });
  },
  get(name: string) {
    return getRecord<PatientUser>("PatientUser", name);
  },
  update(name: string, values: Partial<PatientUser>) {
    return updateRecord<PatientUser>("PatientUser", name, values);
  }
};
