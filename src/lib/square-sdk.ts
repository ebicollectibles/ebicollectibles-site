declare global {
  interface Window {
    Square?: any
  }
}

export const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID as string | undefined
export const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined
export const squareConfigured = Boolean(SQUARE_APP_ID && SQUARE_LOCATION_ID)

const ENVIRONMENT = (import.meta.env.VITE_SQUARE_ENVIRONMENT as string | undefined) === 'production' ? 'production' : 'sandbox'
const SDK_SRC = ENVIRONMENT === 'production' ? 'https://web.squarecdn.com/v1/square.js' : 'https://sandbox.web.squarecdn.com/v1/square.js'

let loadPromise: Promise<void> | null = null

// Shared by every component that talks to Square's Web Payments SDK (card
// field, Apple Pay button in checkout, express Apple Pay on the cart page)
// so the <script> tag is only ever injected once, however many of them
// mount at the same time.
export function loadSquareSdk(): Promise<void> {
  if (typeof window !== 'undefined' && window.Square) return Promise.resolve()
  if (!loadPromise) {
    loadPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SDK_SRC
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Square SDK'))
      document.head.appendChild(script)
    }).catch((err) => {
      loadPromise = null
      throw err
    })
  }
  return loadPromise
}
