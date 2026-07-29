import { getRecord, listRecords, updateRecord } from "./client";
import type { ListOptions, TeleconsultSession } from "../types/domain";

export const teleconsultApi = {
  list(options?: ListOptions<TeleconsultSession>) {
    return listRecords<TeleconsultSession>("Teleconsult Session", {
      fields: ["*"],
      ...options
    });
  },
  get(name: string) {
    return getRecord<TeleconsultSession>("Teleconsult Session", name);
  },
  update(name: string, values: Partial<TeleconsultSession>) {
    return updateRecord<TeleconsultSession>(
      "Teleconsult Session",
      name,
      values
    );
  }
};
