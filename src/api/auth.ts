import { callRpc, clearSessionTokens, getRecord, listRecords, request } from "./client";
import type { AuthSession, Doctor, PatientUser } from "../types/domain";
import {
  DEMO_MODE,
  demoLogin,
  demoLogout,
  demoRegisterPatient,
  demoRestoreSession
} from "./demo";

interface LoginResponse {
  home_page?: string;
  full_name?: string;
  message?: string;
}

interface PatientLoginResponse {
  success: boolean;
  user: { name: string; full_name: string };
  patient?: {
    name: string;
    phoneno: string;
    first_name: string;
    age: number;
    gender: string;
  };
}

interface UserDocument {
  name: string;
  full_name?: string;
  roles?: Array<{ role: string }>;
}

export const authApi = {
  loginPatient(phoneOrEmail: string, password: string) {
    if (DEMO_MODE) {
      const account = demoLogin("patient", phoneOrEmail, password);
      const session = demoRestoreSession();
      return Promise.resolve({
        success: true,
        user: { name: account.username, full_name: account.fullName },
        patient: session.patient
          ? {
              name: session.patient.name,
              phoneno: session.patient.phoneno,
              first_name: session.patient.name1,
              age: session.patient.age,
              gender: session.patient.gender
            }
          : undefined
      } satisfies PatientLoginResponse);
    }
    const normalizedPhone = phoneOrEmail.replace(/\D/g, "");
    const usr = phoneOrEmail.includes("@")
      ? phoneOrEmail
      : `${normalizedPhone}@soulplace.local`;
    return callRpc<PatientLoginResponse>(
      "soulplace.auth.patient_login",
      { usr, pwd: password },
      true
    );
  },

  loginPortal(
    username: string,
    password: string,
    portal: "doctor" | "admin" = "doctor"
  ) {
    if (DEMO_MODE) {
      const account = demoLogin(portal, username, password);
      return Promise.resolve({
        full_name: account.fullName,
        message: "Logged In"
      } satisfies LoginResponse);
    }
    return request<LoginResponse>("/api/method/login", {
      method: "POST",
      body: { usr: username, pwd: password },
      skipCsrf: true
    });
  },

  async logout() {
    if (DEMO_MODE) {
      demoLogout();
      clearSessionTokens();
      return;
    }
    try {
      await request("/api/method/logout", { method: "POST" });
    } finally {
      clearSessionTokens();
    }
  },

  getLoggedUser() {
    if (DEMO_MODE) {
      return Promise.resolve(demoRestoreSession().username ?? "Guest");
    }
    return callRpc<any>("soulplace.api.get_portal_identity", {}, true).then(res => res.username || "Guest").catch(() => "Guest");
  },

  registerPatient(input: {
    phoneno: string;
    password: string;
    name1: string;
    age: number;
    gender: string;
    livingstatus: string;
    therapyexp: string;
    preferred_language: "English" | "Hindi" | "Marathi";
    emergency_contact_name: string;
    emergency_contact_phone: string;
    consent_accepted: boolean;
    consent_version: string;
  }) {
    if (DEMO_MODE) {
      const patient = demoRegisterPatient(input);
      return Promise.resolve({
        success: true,
        user: {
          name: patient.app_user || patient.phoneno,
          full_name: patient.name1
        },
        patient: {
          name: patient.name,
          phoneno: patient.phoneno,
          first_name: patient.name1,
          age: patient.age,
          gender: patient.gender
        }
      } satisfies PatientLoginResponse);
    }
    return callRpc<PatientLoginResponse>(
      "soulplace.auth.register_patient",
      input,
      true
    );
  },

  async restore(): Promise<AuthSession> {
    if (DEMO_MODE) return demoRestoreSession();
    try {
      const identity = await callRpc<any>("soulplace.api.get_portal_identity", {}, true);
      
      if (identity.status === "anonymous" || !identity.username || identity.username === "Guest") {
        return { status: "anonymous", roles: [] };
      }
      
      return {
        status: "authenticated",
        username: identity.username,
        fullName: identity.fullName,
        roles: identity.roles || [],
        portal: identity.portal,
        patient: identity.patient,
        doctor: identity.doctor
      };
    } catch (e) {
      return { status: "anonymous", roles: [] };
    }
  }
};
