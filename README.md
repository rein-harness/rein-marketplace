# Rein Marketplace

The official marketplace for [Rein](https://github.com/rein-harness/rein-harness). In Rein, `/marketplace` opens it as a store: install tools, commands, skills, themes, features and bundles.

## Adding your own marketplace

Any git repo laid out like this one is a marketplace: `/marketplace add https://github.com/you/your-marketplace`.

```
marketplace.json          {"name": "…", "description": "…"}
items/<id>/rein.json      the item (below)
items/<id>/README.md      its page in the store
items/<id>/skills/<name>/SKILL.md, commands/*.md, agents/*.md, hooks/hooks.json, .mcp.json
                          what it adds, in Claude Code's plugin layout
```

A Claude Code marketplace (`.claude-plugin/marketplace.json` with plugins in folders of the repo) works too.

## `rein.json`

| Field | |
|---|---|
| `id`, `name`, `version`, `description` | Required |
| `author`, `icon`, `tags`, `homepage` | Shown in the store |
| `category` | `tools`, `commands`, `skills`, `ui`, `feature` or `bundle` |
| `requires` | Other item ids (same marketplace) to install with it: a bundle |
| `config` | Settings it turns on: `packs`, `experiments`, or a `statusLine` / `sidebarSections` layout |
| `main`, `api` | Its code: `"main": "index.mjs"` exporting `activate(rein)`, and the extension API version it needs (`1`; `2` for `checks` and `requestStart`) |

Uninstalling an item removes its files and undoes the settings it changed.

## Items with code

An item's code gets one object, `rein` (types: `import type {Rein} from 'rein-harness/api'`), and does everything through it:

```js
/** @param {import('rein-harness/api').Rein} rein */
export function activate(rein) {
  rein.registerCommand({name: 'hello', description: 'Say hello', run: (args, ctx) => ctx.log('hello ' + args)});
  rein.registerTool({name: 'hello_tool', label: 'Hello', description: '…', inputSchema: {type: 'object'}, run: async () => ({ok: true, text: 'hi'})});
  rein.ui.sidebarSection({id: 'mine', title: 'Mine', render: (width) => ['a line', 'another']});
  rein.ui.statusSegment({id: 'mine', render: () => 'status'});
  rein.ui.theme({accent: '#a78bfa'});
}
```

It can also run programs (`rein.exec`, `rein.git`), use the ripgrep that ships with Rein, read the workspace and settings, keep its own settings, and react when a turn ends (`rein.on('turnEnd', …)`). See [git-status](items/git-status/index.mjs) for a whole item.

### Writing an item in TypeScript

Put the source in `items/<id>/src/index.ts` (tests in `items/<id>/test/`), then `npm run build` bundles it, with its dependencies, into the `index.mjs` Rein loads. CI checks the committed `index.mjs` matches the source (`npm run check`), typechecks against `rein-harness/api`, and runs the tests on Linux, macOS and Windows. [contracts](items/contracts/) is a whole item written this way: commands, skills and checks on the agent's work.

## Contributing

Open a pull request with a folder under `items/`. Items that run code (MCP servers, hooks) are reviewed with extra care.
