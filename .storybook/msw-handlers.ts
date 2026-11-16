import { http, HttpResponse } from 'msw'

/**
 * MSW handlers for Storybook stories.
 *
 * Add endpoints here as stories that exercise network calls are added.
 * For now, this is a placeholder — none of the current UI stories
 * (Button, Input, Select, etc.) call external APIs.
 *
 * When a story needs to show data from Payload's REST or GraphQL API,
 * add the matching handler here instead of mocking at the component level.
 */
export const mswHandlers = {
  /** No handlers yet — presentational stories only. */
}
