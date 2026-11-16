# Hostlink CMS — Development Rules

## Code Validation

- Run `tsc --noEmit` to validate TypeScript.
- Run `payload generate:importmap` after creating or modifying custom components.
- Run `payload generate:types` after schema changes.

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Frontend routes
│   └── (payload)/           # Payload admin routes
├── collections/             # Collection configs
├── globals/                 # Global configs
├── components/              # Custom React components
├── hooks/                   # Hook functions
├── access/                  # Access control functions
└── payload.config.ts        # Main config
```

## Storybook MCP (UI Components)

When working on UI components, always use the `storybook` MCP tools to access Storybook's component and documentation knowledge before answering or taking any action.

- **CRITICAL: Never hallucinate component properties!** Before using ANY property on a component from a design system (including common-sounding ones like `shadow`, etc.), you MUST use the MCP tools to check if the property is actually documented for that component.
- Query `list-all-documentation` to get a list of all components
- Query `get-documentation` for that component to see all available properties and examples
- Only use properties that are explicitly documented or shown in example stories
- If a property isn't documented, do not assume properties based on naming conventions or common patterns from other libraries. Check back with the user in these cases.
- Use the `get-storybook-story-instructions` tool to fetch the latest instructions for creating or updating stories. This will ensure you follow current conventions and recommendations.
- Check your work by running `run-story-tests`.

Remember: A story name might not reflect the property name correctly, so always verify properties through documentation or example stories before using them.

See https://storybook.js.org/docs/ai/best-practices for more details.

## Critical Security Patterns

**Rule**: When passing `user` to Local API, ALWAYS set `overrideAccess: false`

**Rule**: ALWAYS pass `req` to nested operations in hooks (maintains transaction atomicity)

**Rule**: Use context flags to prevent infinite hook loops when doing payload operations inside hooks

## Common Gotchas

1. Local API defaults to bypassing access control — never trust it when a user is involved
2. Missing `req` in nested hook operations breaks atomicity
3. Operations in hooks can trigger the same hooks (use context flags)
4. Field access returns boolean only, not query constraints
5. Default relationship depth is 2, set to 0 for IDs only

## Reference Docs

- Payload LLM context: https://payloadcms.com/llms-full.txt
- Storybook AI best practices: https://storybook.js.org/docs/ai/best-practices
