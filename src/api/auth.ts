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
    return request<string>("/api/method/frappe.auth.get_logged_user");
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
    const username = await this.getLoggedUser();
    if (!username || username === "Guest") {
      return { status: "anonymous", roles: [] };
    }

    let roles: string[] = [];
    let fullName = username;
    try {
      const user = await getRecord<UserDocument & { name: string }>(
        "User",
        username
      );
      roles = user.roles?.map((entry) => entry.role) ?? [];
      fullName = user.full_name || username;
    } catch {
      if (username === "Administrator") roles = ["System Manager"];
    }

    const adminRoles = (import.meta.env.VITE_ADMIN_ROLES ||
      "System Manager,SoulPlace Admin")
      .split(",")
      .map((role) => role.trim());
    if (username === "Administrator" || roles.some((r) => adminRoles.includes(r))) {
      return {
        status: "authenticated",
        username,
        fullName,
        roles,
        portal: "admin"
      };
    }

    try {
      const patients = await listRecords<PatientUser>("PatientUser", {
        fields: ["*"],
        filters: [["app_user", "=", username]],
        limitPageLength: 1
      });
      if (patients.data[0]) {
        return {
          status: "authenticated",
          username,
          fullName: patients.data[0].name1 || fullName,
          roles,
          portal: "patient",
          patient: patients.data[0]
        };
      }
    } catch {
      // Try doctor identity before reporting a role resolution failure.
    }

    const doctors = await listRecords<Doctor>("Doctor", {
      fields: ["*"],
      filters: [["email", "=", username]],
      limitPageLength: 1
    });
    if (doctors.data[0]) {
      return {
        status: "authenticated",
        username,
        fullName: doctors.data[0].full_name || fullName,
        roles,
        portal: "doctor",
        doctor: doctors.data[0]
      };
    }

    // Backward compatibility for the current backend, which does not set app_user.
    const phone = username.endsWith("@soulplace.local")
      ? username.replace("@soulplace.local", "")
      : "";
    if (phone) {
      const patients = await listRecords<PatientUser>("PatientUser", {
        fields: ["*"],
        filters: [["phoneno", "=", phone]],
        limitPageLength: 1
      });
      if (patients.data[0]) {
        return {
          status: "authenticated",
          username,
          fullName: patients.data[0].name1 || fullName,
          roles,
          portal: "patient",
          patient: patients.data[0]
        };
      }
    }

    throw new Error(
      "Your account is authenticated, but no SoulPlace portal profile is linked."
    );
  }
};
