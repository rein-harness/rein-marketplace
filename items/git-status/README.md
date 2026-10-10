# Git status

Shows the repo you're in, drawn by this item's own code:

- **Sidebar:** the branch, how many commits it's ahead (↑) or behind (↓) its upstream, and the changed files (green added, yellow modified, red deleted, grey untracked).
- **Status line:** `⎇ branch ●3` (3 files changed).

It refreshes when Rein starts and after every turn of the agent. It only runs `git` read-only commands in your project.
