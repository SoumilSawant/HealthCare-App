import { ExternalLink, ShieldCheck, Video } from "lucide-react";
import type { AppointmentStatus, TeleconsultSession } from "../types/domain";
import { isGoogleMeetLink } from "../api/googleMeet";
import { Button, StatusBadge } from "./ui";

export function GoogleMeetCard({
  audience,
  appointmentStatus,
  gmeetLink,
  loading,
  creating,
  configured = true,
  error,
  onCreate
}: {
  audience: "patient" | "doctor";
  appointmentStatus: AppointmentStatus;
  gmeetLink?: string;
  loading?: boolean;
  creating?: boolean;
  configured?: boolean;
  error?: unknown;
  onCreate?: () => void;
}) {
  const meetingLink = gmeetLink;
  const isMeet = isGoogleMeetLink(meetingLink);
  const canJoin =
    isMeet &&
    appointmentStatus === "Confirmed";
  const canCreate =
    audience === "doctor" && appointmentStatus === "Confirmed" && !meetingLink;
  const errorMessage = error instanceof Error ? error.message : undefined;

  const guidance = loading
    ? "Checking the meeting room…"
    : appointmentStatus === "Pending"
      ?
      audience === "doctor"
        ? "Confirm the appointment before creating its private Meet room."
        : "Your Meet link will appear here after the doctor confirms the appointment."
      : appointmentStatus === "Cancelled"
        ? "This appointment was cancelled, so its meeting room is closed."
        : appointmentStatus === "Completed"
          ? "This consultation has ended and the join link is no longer active here."
            : meetingLink
              ? isMeet
                ? audience === "patient"
                  ? "The private Google Meet room is ready. Google may ask you to sign in and wait for your doctor to admit you."
                  : "The private Google Meet room is ready. Open it with the Google account that created the room."
                : "The saved meeting link is invalid. For safety, SoulPlace will not open it."
            : audience === "doctor"
              ? "Create a private room with your Google account, then join when you’re ready."
              : "Your doctor hasn’t created the Meet room yet. Check again closer to your appointment.";

  return (
    <section
      className="meet-card"
      aria-labelledby="meet-card-title"
      aria-busy={loading || creating ? "true" : undefined}
    >
      <div className="meet-card-mark" aria-hidden="true">
        <Video />
      </div>
      <div className="meet-card-content">
        <div className="meet-card-heading">
          <div>
            <small>{isMeet || !meetingLink ? "Google Meet" : "Video consultation"}</small>
            <h2 id="meet-card-title">
              {meetingLink ? "Your meeting room is ready" : "Private video room"}
            </h2>
          </div>
        </div>
        <p>{guidance}</p>
        <div className="meet-privacy-note">
          <ShieldCheck aria-hidden="true" />
          <span>SoulPlace stores the room reference, join link, and scheduled time. Clinical notes are not sent to Google.</span>
        </div>
        {errorMessage && (
          <p className="meet-error" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="meet-actions">
          {canJoin && (
            <a
              className="button button-primary"
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Video />
              {audience === "doctor" ? "Join Google Meet" : "Join consultation"}
              <ExternalLink />
            </a>
          )}
          {canCreate && onCreate && (
            <Button onClick={onCreate} disabled={creating || !configured}>
              <Video />
              {creating ? "Creating Meet room…" : "Create Google Meet"}
            </Button>
          )}
        </div>
        {canCreate && !configured && (
          <small className="meet-setup-note">
            This deployment needs a Google OAuth web client before doctors can create rooms.
          </small>
        )}
      </div>
    </section>
  );
}
