import {
  createRecord,
  getRecord,
  listRecords,
  updateRecord
} from "./client";
import type { Consultation, ListOptions } from "../types/domain";

export const consultationsApi = {
  list(options?: ListOptions<Consultation>) {
    return listRecords<Consultation>("Consultation", {
      fields: ["*"],
      ...options
    });
  },
  get(name: string) {
    return getRecord<Consultation>("Consultation", name);
  },
  create(values: Omit<Partial<Consultation>, "name">) {
    return createRecord<Consultation>("Consultation", values);
  },
  update(name: string, values: Partial<Consultation>) {
    return updateRecord<Consultation>("Consultation", name, values);
  }
};
