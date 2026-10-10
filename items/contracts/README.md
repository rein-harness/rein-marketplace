# Contracts and migrations

Changes that other code depends on, made safely. This item ships its own code (`src/`, built into `index.mjs`) and skills.

**Commands**

- `/contracts`: breaking and safe changes to API contracts (OpenAPI, Swagger, protobuf, GraphQL, Avro) on this branch.
- `/migrations`: risks in this branch's database migrations: locks on big tables, missing backfills, steps that can't be undone, renames that break running code.
- `/deadcode`: definitions nothing refers to (JS/TS, Python, Go); `/deadcode remove` has the agent delete what's really unused.
- `/flags`: the feature flags the code reads, and the stale ones; `/flags remove <key>` has the agent remove one.

**Skills**

`/contracts:expand-contract`, `/contracts:contract-tests`, `/contracts:codemod`, `/contracts:migrate-java21`, `/contracts:migrate-python3`, `/contracts:migrate-react-hooks`.

**Checks on the agent's work** (off until you turn them on with `/contracts checks <check> on`)

- `contracts`: at the end of a request that changed an API contract, the agent hears about the breaking changes it made.
- `migrations`: at the end of a request that wrote migrations, the agent hears about the risky steps.
- `codemod`: after the same hand edit in 4 files, the agent is told to write a codemod for the rest.
