import { createFileRoute, redirect } from '@tanstack/react-router'
import { startGoogleAuth } from '~/server/google-auth'

export const Route = createFileRoute('/auth/google/start')({
  loader: async () => {
    const { url } = await startGoogleAuth()
    throw redirect({ href: url })
  },
  component: () => null,
})
