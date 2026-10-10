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
| `theme` | `{"accent": "#a78bfa"}`: the colour of the input box, window frames and selections |

Uninstalling an item removes its files and undoes the settings it changed.

## Contributing

Open a pull request with a folder under `items/`. Items that run code (MCP servers, hooks) are reviewed with extra care.
