export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // Plug your own error-tracking service (Sentry, etc.) in here if you want one.
  console.error("[error-boundary]", error, {
    route: window.location.pathname,
    ...context,
  });
}
