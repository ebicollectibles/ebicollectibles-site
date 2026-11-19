import { createRouter } from '@tanstack/react-router'
import { config as zodConfig } from 'zod'
import { routeTree } from './routeTree.gen'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'

// zod normally tests whether the browser allows eval so it can compile
// faster validators. Under a Content-Security-Policy that test shows up as
// a violation on every page even though zod catches it and carries on.
// Turning the fast path off skips the test; the forms validated in the
// browser here are far too small for the difference to be measurable.
zodConfig({ jitless: true })

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  })
  return router
}
