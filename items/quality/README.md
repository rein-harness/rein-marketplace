# Test quality

Tests that cover what you changed. This item ships its own code (`src/`, built into `index.mjs`).

- `/affected`: what your changes affect, from the monorepo's build graph (Nx, Turborepo, Bazel, Pants), and the command that tests just that.
- `/build`: the build system and its caches, and whether Rein's sandbox lets agent builds use them.
- `/coverage`: the lines your changes add that no test ran, from the newest coverage report (lcov, Istanbul, Cobertura, Go); `/coverage tests` asks the agent to write tests for them.
- `/mutate`: mutation testing of your changed files (Stryker, mutmut, go-mutesting); `/mutate tests` asks the agent to close the gaps.

Off until you turn them on:

- `/affected tool on`: the agent gets an `affected` tool (from the next start).
- `/affected check on`: at the end of a request, the tests for what it changed run, and a failure goes back to the agent.
