import { createRecord, listRecords, updateRecord } from "./client";
import type {
  ListOptions,
  PatientConsentRecord
} from "../types/domain";

export const consentsApi = {
  list(options?: ListOptions<PatientConsentRecord>) {
    return listRecords<PatientConsentRecord>("Patient Consent Record", {
      fields: ["*"],
      ...options
    });
  },
  grant(
    patient: string,
    consentType: PatientConsentRecord["consent_type"]
  ) {
    return createRecord<PatientConsentRecord>("Patient Consent Record", {
      patient,
      consent_type: consentType,
      consent_version: import.meta.env.VITE_CONSENT_VERSION || "1.0",
      status: "Granted",
      granted_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
      capture_source: "Web"
    });
  },
  revoke(name: string) {
    return updateRecord<PatientConsentRecord>(
      "Patient Consent Record",
      name,
      {
        status: "Revoked",
        revoked_on: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
    );
  }
};
