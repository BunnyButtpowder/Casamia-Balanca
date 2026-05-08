/**
 * Push custom events to GTM dataLayer for tracking user interactions.
 * Events are picked up by GTM (GTM-TTX32H6N) and forwarded to GA4 / Google Ads.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

interface TrackEventParams {
  /** GTM event name — keep lowercase_snake_case */
  event: string
  /** Human-readable category for grouping in GA4 */
  event_category?: string
  /** What was clicked / interacted with */
  event_label?: string
  /** Optional numeric value */
  value?: number
  /** Any extra custom dimensions */
  [key: string]: unknown
}

export function trackEvent({ event, ...rest }: TrackEventParams) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...rest })
}
