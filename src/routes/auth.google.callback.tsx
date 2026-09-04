import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { completeGoogleAuth } from '~/server/google-auth'

const searchSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/auth/google/callback')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    if (deps.error || !deps.code || !deps.state) {
      throw redirect({ to: '/account/login', search: { error: 'Google sign-in was cancelled or failed.' } })
    }
    try {
      await completeGoogleAuth({ data: { code: deps.code, state: deps.state } })
    } catch (err) {
      throw redirect({
        to: '/account/login',
        search: { error: err instanceof Error ? err.message : 'Google sign-in failed.' },
      })
    }
    throw redirect({ to: '/account' })
  },
  component: () => null,
})
