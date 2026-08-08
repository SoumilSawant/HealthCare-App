import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GoogleMeetCard } from "../components/GoogleMeetCard";

const session = {
  name: "TEL-1",
  appointment: "APT-1",
  practitioner: "DOC-1",
  patient: "PAT-1",
  provider: "Custom" as const,
  meeting_id: "spaces/space-1",
  meeting_link: "https://meet.google.com/abc-defg-hij",
  session_status: "Created" as const
};

describe("GoogleMeetCard", () => {
  it("shows a confirmed patient the saved Meet link", () => {
    render(
      <GoogleMeetCard
        audience="patient"
        appointmentStatus="Confirmed"
        session={session}
      />
    );

    const link = screen.getByRole("link", { name: /Join consultation/i });
    expect(link).toHaveAttribute("href", session.meeting_link);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("does not expose a join action before confirmation", () => {
    render(
      <GoogleMeetCard
        audience="patient"
        appointmentStatus="Pending"
        session={session}
      />
    );

    expect(screen.queryByRole("link", { name: /Join/i })).not.toBeInTheDocument();
    expect(screen.getByText(/after the doctor confirms/i)).toBeInTheDocument();
  });

  it("lets a doctor create a room for a confirmed appointment", () => {
    const onCreate = vi.fn();
    render(
      <GoogleMeetCard
        audience="doctor"
        appointmentStatus="Confirmed"
        onCreate={onCreate}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Create Google Meet/i }));
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it("disables creation when OAuth is not configured", () => {
    render(
      <GoogleMeetCard
        audience="doctor"
        appointmentStatus="Confirmed"
        configured={false}
        onCreate={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /Create Google Meet/i })).toBeDisabled();
    expect(screen.getByText(/needs a Google OAuth web client/i)).toBeInTheDocument();
  });

  it("hides join actions after a consultation is completed", () => {
    render(
      <GoogleMeetCard
        audience="doctor"
        appointmentStatus="Completed"
        session={{ ...session, session_status: "Completed" }}
      />
    );

    expect(screen.queryByRole("link", { name: /Join/i })).not.toBeInTheDocument();
    expect(screen.getByText(/consultation has ended/i)).toBeInTheDocument();
  });
});
