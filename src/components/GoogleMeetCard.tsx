import { ExternalLink, ShieldCheck, Video } from "lucide-react";
import type { AppointmentStatus, TeleconsultSession } from "../types/domain";
import { isGoogleMeetLink } from "../api/googleMeet";
import { Button, StatusBadge } from "./ui";

export function GoogleMeetCard({
  audience,
  appointmentStatus,
  session,
  loading,
  creating,
  configured = true,
  error,
  onCreate
}: {
  audience: "patient" | "doctor";
  appointmentStatus: AppointmentStatus;
  session?: TeleconsultSession;
  loading?: boolean;
  creating?: boolean;
  configured?: boolean;
  error?: unknown;
  onCreate?: () => void;
}) {
  const meetingLink = session?.meeting_link;
  const isMeet = isGoogleMeetLink(meetingLink);
  const canJoin =
    Boolean(meetingLink) &&
    appointmentStatus === "Confirmed" &&
    ["Created", "Live"].includes(session?.session_status || "");
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
              ? "The private Google Meet room is ready. It opens in a new tab."
              : "A video room is ready for this appointment. It opens in a new tab."
            : audience === "doctor"
              ? "Create a private room with your Google account, then join when you’re ready."
              : "Your doctor hasn’t created the Meet room yet. Check again closer to your appointment.";

  return (
    <section className="meet-card" aria-labelledby="meet-card-title">
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
          {session && <StatusBadge status={session.session_status} />}
        </div>
        <p>{guidance}</p>
        <div className="meet-privacy-note">
          <ShieldCheck aria-hidden="true" />
          <span>Only the meeting link is stored in SoulPlace. Clinical notes are not sent to Google.</span>
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
              rel="noreferrer"
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
