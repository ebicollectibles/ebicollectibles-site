import { config } from 'zod'

// zod normally tests whether the browser allows eval so it can compile
// faster validators. Under a Content-Security-Policy that test shows up as
// a violation on every page even though zod catches it and carries on.
// Turning the fast path off skips the test; the forms validated in the
// browser here are far too small for the difference to be measurable.
//
// zod runs the test when a schema is first defined, which happens while
// modules load, so this has to be imported before any module that defines
// one. src/router.tsx imports it first for that reason.
config({ jitless: true })
