// Zoom Server-to-Server OAuth integration (NOT the deprecated JWT app type —
// Zoom shut those off). Create a "Server-to-Server OAuth" app in the Zoom
// App Marketplace, grant it the meeting:write:meeting scope, and put its
// Account ID / Client ID / Client Secret in .env.local.
//
// This is best-effort: if Zoom isn't configured, booking confirmation still
// succeeds — the coach can paste a meeting link into the booking manually
// from /coach (see app/coach/BookingRow.tsx). A confirmed, paid booking
// should never be blocked on Zoom being wired up.

export const isZoomConfigured = Boolean(
  process.env.ZOOM_ACCOUNT_ID &&
    process.env.ZOOM_CLIENT_ID &&
    process.env.ZOOM_CLIENT_SECRET
);

async function getZoomAccessToken(): Promise<string> {
  const basic = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${basic}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Zoom OAuth token request failed: ${res.status}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function createZoomMeeting(opts: {
  topic: string;
  startTimeIso: string;
  durationMinutes: number;
}): Promise<{ joinUrl: string; startUrl: string; meetingId: number } | null> {
  if (!isZoomConfigured) return null;

  try {
    const accessToken = await getZoomAccessToken();
    const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: opts.topic,
        type: 2, // scheduled meeting
        start_time: opts.startTimeIso,
        duration: opts.durationMinutes,
        timezone: "UTC",
        settings: {
          join_before_host: false,
          waiting_room: true,
          approval_type: 2,
        },
      }),
    });

    if (!res.ok) {
      console.error("Zoom meeting creation failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return {
      joinUrl: data.join_url,
      startUrl: data.start_url,
      meetingId: data.id,
    };
  } catch (err) {
    console.error("Zoom meeting creation error:", err);
    return null;
  }
}
