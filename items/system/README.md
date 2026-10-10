# Multi-repo systems

For systems spread over several services and repos. This item ships its own code (`src/`, built into `index.mjs`).

- `/services`: which service calls which, from docker-compose, Kubernetes, URLs, gRPC clients and internal packages (`/services mermaid` for a diagram).
- `/symbols <name>`: where a symbol is defined and used across repos, from their SCIP indexes; `/symbols cross`; `/symbols index` writes the indexes where the indexers are installed.
- `/refs POST /orders/{id}`: follow an endpoint or RPC from the gateway to the service that serves it and every caller.
- `/impact`: every caller, in every repo, of what this branch changes, breaking changes first.
- `/changeset`: one change across several workspace repos: one branch each, tested in dependency order, linked pull requests.
- `/codemap`: an architecture map in `docs/codemap/`, a page per service, kept fresh.
- `/stack`: bring up the services a change needs (Docker Compose, or a Helm chart locally), wait for health checks, read logs.

The agent's tools (`service_graph`, `symbol_refs`, `api_refs`, `stack`) are off until you turn them on: `/services tools on` (from the next start).
