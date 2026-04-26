"use client";

import { useEffect, useState } from "react";

export default function LocalSlotTime({
  iso,
  variant = "full",
}: {
  iso: string;
  variant?: "full" | "time";
}) {
  // Server-render the IST time so there's a non-empty fallback before hydration.
  const fallback = (() => {
    const d = new Date(iso);
    const istMs = d.getTime() + 330 * 60 * 1000;
    const dt = new Date(istMs);
    const hh = String(dt.getUTCHours()).padStart(2, "0");
    const mm = String(dt.getUTCMinutes()).padStart(2, "0");
    return variant === "time" ? `${hh}:${mm}` : `${hh}:${mm} IST`;
  })();

  const [text, setText] = useState<string>(fallback);

  useEffect(() => {
    try {
      const d = new Date(iso);
      if (variant === "time") {
        setText(
          d.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } else {
        setText(
          d.toLocaleString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    } catch {}
  }, [iso, variant]);

  return <span>{text}</span>;
}
