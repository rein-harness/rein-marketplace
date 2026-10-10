---
name: notes
description: Draft release notes from the commits since the last tag (or a range the user gives), grouped for the people who use the project
---
# Release notes

1. Find the range: the user's, else `git describe --tags --abbrev=0` to `HEAD`. Say which range you used.
2. Read `git log --no-merges --format='%h %s%n%b' <range>` and, for anything unclear, the commit's diff.
3. Write for users, not for the team: what changed for them, in plain words. Group under **New**, **Improved**, **Fixed**, and **Breaking changes** (with what to do), leaving out empty groups and internal-only commits (CI, refactors, tests) unless they change something a user sees.
4. One line per change, starting with the thing that changed. Link the PR or commit when the repo uses them.
5. Show the draft. Write it to a file (CHANGELOG.md, a release body) only if the user asks.
