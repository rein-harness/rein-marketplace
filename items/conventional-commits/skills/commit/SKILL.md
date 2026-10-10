---
name: commit
description: Write a Conventional Commits message for the staged changes, then commit after the user approves it
---
# Commit with a Conventional Commits message

1. Run `git diff --cached --stat` and `git diff --cached`. If nothing is staged, say so and show `git status --short`; don't stage anything yourself unless the user asked you to.
2. Read the recent history (`git log --oneline -15`) to match the repo's own scopes and wording.
3. Write the message:
   - First line: `type(scope): summary`, at most 72 characters, imperative mood, no period. Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Leave the scope out when there's no clear one.
   - A breaking change gets `!` after the type or scope and a `BREAKING CHANGE:` footer saying what to do.
   - A body when the why isn't obvious from the summary: what changed and why, wrapped at 72 columns.
4. Show the message and ask the user to approve or edit it. Commit only after they approve: `git commit -F <file>` with the message in a scratch file.
