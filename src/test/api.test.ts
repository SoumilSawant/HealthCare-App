import { beforeEach, describe, expect, it, vi } from "vitest";
import { appointmentsApi } from "../api/appointments";
import { consultationsApi } from "../api/consultations";
import { prescriptionsApi } from "../api/prescriptions";
import { consentsApi } from "../api/consents";
import { adminApi } from "../api/admin";
import { doctorsApi } from "../api/doctors";
import { authApi } from "../api/auth";
import { ApiError, request } from "../api/client";

function ok(data: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  );
}

describe("typed Frappe API workflows", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      if (String(input).includes("get_csrf_token")) {
        return ok("csrf-token");
      }
      return ok({ name: "DOC-0001" });
    });
  });

  it("creates a web appointment with exact configured fields", async () => {
    await appointmentsApi.create({
      patient: "PAT-1",
      doctor: "DOC-1",
      appointment_date: "2026-08-10",
      appointment_time: "10:30",
      status: "Pending",
      symptoms: "Anxiety",
      booking_source: "Web",
      is_teleconsult: 1
    });
    const mutation = vi.mocked(fetch).mock.calls.find(([url]) =>
      String(url).includes("/api/resource/Appointment")
    );
    expect(mutation).toBeDefined();
    expect(JSON.parse(String(mutation?.[1]?.body))).toMatchObject({
      patient: "PAT-1",
      doctor: "DOC-1",
      booking_source: "Web",
      is_teleconsult: 1
    });
  });

  it("submits the complete patient registration contract", async () => {
    await authApi.registerPatient({
      phoneno: "9876543210",
      password: "SecurePass123!",
      name1: "Patient Name",
      age: 28,
      gender: "Female",
      livingstatus: "With family",
      therapyexp: "New to therapy",
      preferred_language: "English",
      emergency_contact_name: "Emergency Contact",
      emergency_contact_phone: "9876500000",
      consent_accepted: true,
      consent_version: "1.0"
    });

    const registration = vi.mocked(fetch).mock.calls.find(([url]) =>
      String(url).includes("/api/method/soulplace.auth.register_patient")
    );
    expect(registration).toBeDefined();
    expect(JSON.parse(String(registration?.[1]?.body))).toMatchObject({
      preferred_language: "English",
      emergency_contact_name: "Emergency Contact",
      emergency_contact_phone: "9876500000",
      consent_accepted: true,
      consent_version: "1.0"
    });
  });

  it("cancels an appointment with its configured reason field", async () => {
    await appointmentsApi.cancel("APT-1", "Schedule conflict");
    const mutation = vi.mocked(fetch).mock.calls.find(([url]) =>
      String(url).endsWith("/api/resource/Appointment/APT-1")
    );
    expect(JSON.parse(String(mutation?.[1]?.body))).toEqual({
      status: "Cancelled",
      cancel_reason: "Schedule conflict"
    });
  });

  it("updates doctor approval, rejection, and availability through real Doctor fields", async () => {
    await adminApi.approveDoctor("DOC-1");
    await adminApi.rejectDoctor("DOC-1");
    await doctorsApi.update("DOC-1", {
      availability: "Weekdays 09:00–17:00",
      status: "Active",
      teleconsult_enabled: 1,
      avg_consult_duration_mins: 45
    });
    const calls = vi.mocked(fetch).mock.calls.filter(([url]) =>
      String(url).endsWith("/api/resource/Doctor/DOC-1")
    );
    expect(JSON.parse(String(calls[0][1]?.body))).toMatchObject({
      approval_status: "Approved",
      status: "Active"
    });
    expect(JSON.parse(String(calls[1][1]?.body))).toMatchObject({
      approval_status: "Rejected",
      status: "Inactive"
    });
    expect(JSON.parse(String(calls[2][1]?.body))).toMatchObject({
      teleconsult_enabled: 1,
      avg_consult_duration_mins: 45
    });
  });

  it("creates consultation, prescription, and consent records", async () => {
    await consultationsApi.create({
      appointment: "APT-1",
      doctor: "DOC-1",
      diagnosis: "Generalized anxiety",
      soap_plan: "Weekly follow-up"
    });
    await prescriptionsApi.create({
      consultation: "CON-1",
      medicine_name: "Medicine",
      dosage: "Once daily",
      instructions: "After food"
    });
    await consentsApi.grant("PAT-1", "Telemedicine");
    const urls = vi.mocked(fetch).mock.calls.map(([url]) => String(url));
    expect(urls.some((url) => url.endsWith("/api/resource/Consultation"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/api/resource/Prescription"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/api/resource/Patient%20Consent%20Record"))).toBe(true);
  });

  it("normalizes Frappe permission errors", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          _server_messages: JSON.stringify([
            JSON.stringify({ message: "Not permitted" })
          ])
        }),
        { status: 403, statusText: "Forbidden" }
      )
    );
    await expect(request("/api/resource/Appointment")).rejects.toMatchObject({
      name: "ApiError",
      status: 403,
      code: "PERMISSION",
      message: "Not permitted"
    } satisfies Partial<ApiError>);
  });
});
