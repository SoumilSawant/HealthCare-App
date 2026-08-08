import { beforeEach, describe, expect, it, vi } from "vitest";
import { authApi } from "../api/auth";
import { clearSessionTokens } from "../api/client";

function response(message: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify({ message }), {
      status,
      headers: { "Content-Type": "application/json" }
    })
  );
}

describe("authentication API contracts", () => {
  beforeEach(() => {
    clearSessionTokens();
    vi.restoreAllMocks();
  });

  it("restores the complete server-authorized portal identity", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          message: {
            status: "authenticated",
            username: "doctor@example.com",
            fullName: "Dr. Test",
            roles: ["Doctor App User"],
            portal: "doctor",
            doctor: {
              name: "DOC-1",
              full_name: "Dr. Test",
              approval_status: "Approved"
            }
          }
        }),
        { status: 200 }
      )
    );

    await expect(authApi.restore()).resolves.toMatchObject({
      status: "authenticated",
      username: "doctor@example.com",
      portal: "doctor",
      roles: ["Doctor App User"],
      doctor: { name: "DOC-1", approval_status: "Approved" }
    });
  });

  it("treats an explicit Guest identity as anonymous", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementationOnce(() =>
      response({ status: "anonymous", username: "Guest" })
    );

    await expect(authApi.restore()).resolves.toEqual({
      status: "anonymous",
      roles: []
    });
  });

  it("normalizes phone numbers before patient login", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementationOnce(() =>
      response({ success: true, user: { name: "9876543210@soulplace.local" } })
    );

    await authApi.loginPatient("(98765) 43210", "password");

    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toMatchObject({
      usr: "9876543210@soulplace.local",
      pwd: "password"
    });
  });

  it("returns an anonymous session when restoration is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new TypeError("offline"));

    await expect(authApi.restore()).resolves.toEqual({
      status: "anonymous",
      roles: []
    });
  });
});
