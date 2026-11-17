"use client";

/**
 * Thin analytics wrapper. Without a PostHog key it logs to the console in
 * development and does nothing in production. Never pass personal data
 * (names, notes, phone numbers) as properties.
 */
export type AnalyticsEvent =
  | "language_toggled"
  | "destination_viewed"
  | "cta_clicked"
  | "plan_started"
  | "plan_step_completed"
  | "item_added"
  | "item_removed"
  | "whatsapp_clicked"
  | "message_copied";

type Props = Record<string, string | number | boolean | string[]>;

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let client: Promise<typeof import("posthog-js").default> | null = null;

function load() {
  if (!KEY || typeof window === "undefined") return null;
  client ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      // Demo: nothing is stored on the device, so no consent banner is needed.
      // Revisit consent before production.
      persistence: "memory",
      capture_pageview: "history_change",
      autocapture: false,
    });
    return posthog;
  });
  return client;
}

export function initAnalytics(): void {
  void load();
}

export function track(event: AnalyticsEvent, props?: Props): void {
  const loading = load();
  if (loading) {
    void loading.then((posthog) => posthog.capture(event, props));
  } else if (process.env.NODE_ENV === "development") {
    console.info("[track]", event, props ?? {});
  }
}
