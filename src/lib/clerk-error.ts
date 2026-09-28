// Clerk throws a plain object with an `errors` array (each with a
// user-facing `message`) rather than a real Error instance — this pulls
// the first one out, falling back to a generic message for anything else
// (a network error, a thrown Error from our own code, etc.).
export function clerkErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'errors' in err) {
    const errors = (err as { errors?: unknown }).errors
    if (Array.isArray(errors) && errors[0] && typeof errors[0] === 'object' && 'message' in errors[0]) {
      const message = (errors[0] as { message?: unknown }).message
      if (typeof message === 'string' && message) return message
    }
  }
  return err instanceof Error ? err.message : fallback
}
