import {
  createRecord,
  callRpc,
  getRecord,
  listRecords,
  updateRecord
} from "./client";
import { DEMO_MODE } from "./demo";
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
    if (DEMO_MODE) return createRecord<Prescription>("Prescription", values);
    return callRpc<Prescription>("soulplace.api.save_prescription", { values });
  },
  update(name: string, values: Partial<Prescription>) {
    if (DEMO_MODE) return updateRecord<Prescription>("Prescription", name, values);
    return callRpc<Prescription>("soulplace.api.save_prescription", { values: { ...values, name } });
  }
};
