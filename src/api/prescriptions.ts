import {
  createRecord,
  getRecord,
  listRecords,
  updateRecord
} from "./client";
import type { ListOptions, Prescription } from "../types/domain";

export const prescriptionsApi = {
  list(options?: ListOptions<Prescription>) {
    return listRecords<Prescription>("Prescription", {
      fields: ["*"],
      ...options
    });
  },
  get(name: string) {
    return getRecord<Prescription>("Prescription", name);
  },
  create(values: Omit<Partial<Prescription>, "name">) {
    return createRecord<Prescription>("Prescription", values);
  },
  update(name: string, values: Partial<Prescription>) {
    return updateRecord<Prescription>("Prescription", name, values);
  }
};
