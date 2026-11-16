# Merge main into feat/storybook

- Target behavior: bring all committed changes from `main` into `feat/storybook` while preserving branch commits.
- Acceptance criteria: `feat/storybook` contains a merge commit from `main`; no branch commits are dropped or rewritten.
- Invariants: do not rebase; do not introduce unrelated code changes; resolve only merge conflicts required for integration.
- Verification: inspect git history and diff after merge, then run targeted project checks if merge changes code paths.
- Non-goals: pulling uncommitted changes, changing remote branches, or cleaning unrelated history.
