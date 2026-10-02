// Minimal structural types for the subset of Clerk's SignInResource this
// file touches — deliberately not imported from @clerk/shared/@clerk/react
// since neither publicly exports SignInResource from its package root (it
// only lives at an internal dist path); real Clerk sign-in objects already
// satisfy this shape, so TS's structural typing matches them without a
// fragile import into another package's internals.
interface ClientTrustSignIn {
  prepareSecondFactor: (params: { strategy: 'email_code'; emailAddressId: string }) => Promise<unknown>
  attemptSecondFactor: (params: { strategy: 'email_code'; code: string }) => Promise<ClientTrustSignInResult>
}

interface ClientTrustSignInResult {
  status: string | null
  supportedSecondFactors?: Array<{ strategy: string; emailAddressId?: string }> | null
  createdSessionId?: string | null
}

/**
 * Clerk's "Client Trust" anti-credential-stuffing check challenges any
 * password sign-in from a browser it hasn't seen before with an emailed
 * code — a sign_in_attempt status of 'needs_client_trust', separate from
 * (and not handled by) the plain 'complete' case our custom sign-in forms
 * otherwise expect. Every very-first sign-in from a given browser on a
 * fresh Clerk instance hits this, so it's the common case right after a
 * cutover, not an edge case.
 *
 * Call right after signIn.create(...). If this returns true, the email
 * code has already been sent — show a "enter the code we emailed you"
 * step and call attemptClientTrustCode once the user submits it, instead
 * of treating the original result as done.
 */
export async function challengeClientTrustIfNeeded(signIn: ClientTrustSignIn, result: ClientTrustSignInResult): Promise<boolean> {
  if (result.status !== 'needs_client_trust') return false
  const emailFactor = result.supportedSecondFactors?.find((f) => f.strategy === 'email_code' && f.emailAddressId)
  if (!emailFactor?.emailAddressId) throw new Error("Couldn't finish signing in — try again.")
  await signIn.prepareSecondFactor({ strategy: 'email_code', emailAddressId: emailFactor.emailAddressId })
  return true
}

/** Verifies the emailed code from challengeClientTrustIfNeeded and returns the now-complete sign-in. */
export async function attemptClientTrustCode(signIn: ClientTrustSignIn, code: string): Promise<ClientTrustSignInResult> {
  const result = await signIn.attemptSecondFactor({ strategy: 'email_code', code })
  if (result.status !== 'complete') {
    throw new Error("Couldn't finish signing in — try again.")
  }
  return result
}
