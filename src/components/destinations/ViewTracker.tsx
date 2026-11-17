"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

export function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    track("destination_viewed", { id });
  }, [id]);
  return null;
}
