import { createServerFn } from '@tanstack/react-start'

// Runtime-toggled (not a build-time var) so it can be flipped on/off via a
// Cloudflare Worker env var/secret without a rebuild+redeploy — the whole
// point is a fast on/off switch during a cutover window. Checked in the
// root route's loader; see __root.tsx for what it actually does when on
// (swaps the customer-facing shell for a "back soon" page — /admin is
// never affected, so the operator can keep working during the window).
export const isMaintenanceMode = createServerFn({ method: 'GET' }).handler(async () => {
  return process.env.MAINTENANCE_MODE === 'true'
})
