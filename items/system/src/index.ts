import path from 'node:path';
import type {Rein} from 'rein-harness/api';
import {composeFile, formatServices, LocalStack, servicesForChange, stackTool} from './env/stack.js';
import {changeSetState, formatState, formatTests, loadChangeSets, openPrs, startChangeSet, testChangeSet} from './system/changeset.js';
import {annotateTask, codemapDir, codemapStatus, writeCodemap} from './system/codemap.js';
import {formatImpact, impactReport} from './system/impact.js';
import {buildSymbolGraph, crossRepo, formatLookup, indexRepos, lookup} from './system/scip.js';
import {findServices, formatGraph, mermaid} from './system/services.js';
import {findApiRefs, formatRefs} from './system/api.js';
import {apiRefsTool, graphFor, serviceGraphTool, symbolRefsTool} from './system/tools.js';
import type {ToolDef} from './tools/registry.js';
import {setHost} from './util/proc.js';
import {findWorkspace} from './workspace/index.js';

/**
 * Multi-repo systems: which service calls which, symbols across repos, API references, impact
 * reports, coordinated change sets, codemaps and local stacks. Its tools for the agent
 * (service_graph, symbol_refs, api_refs, stack) are off until you turn them on (/services tools on).
 */
export function activate(rein: Rein): void {
  setHost(rein);
  const toolsOn = () => rein.settings.get<boolean>('tools') === true;
  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

  if (toolsOn()) {
    const on = () => ['system-graph', 'stack-tool'];
    const root = () => process.cwd();
    const wsRoot = () => findWorkspace()?.root ?? process.cwd();
    const defs: ToolDef[] = [serviceGraphTool(on, root), symbolRefsTool(on, root), apiRefsTool(on, root), stackTool(on, () => new LocalStack(wsRoot()), async () => servicesForChange(wsRoot(), findServices(process.cwd())))];
    for (const d of defs)
      rein.registerTool({
        name: d.name,
        label: d.label,
        description: d.describe?.() ?? d.description,
        inputSchema: d.inputSchema,
        mutating: d.mutating,
        summarize: (a) => d.summarize(a),
        run: (args, ctx) => d.run({root: ctx.cwd}, args),
      });
  }

  rein.registerCommand({
    name: 'services',
    description: 'Which service calls which',
    usage: 'Which service calls which, from compose, Kubernetes, URLs, gRPC clients and packages: /services, /services mermaid; /services tools on|off for the agent’s tools',
    async run(args, ctx) {
      const [sub, state] = args.trim().split(/\s+/);
      if (sub === 'tools') {
        if (state === 'on' || state === 'off') {
          rein.settings.set('tools', state === 'on');
          return ctx.log(`The agent’s system tools (service_graph, symbol_refs, api_refs, stack) are ${state} from the next time Rein starts.`);
        }
        return ctx.log(`The agent’s system tools are ${toolsOn() ? 'on' : 'off'}. /services tools on|off`);
      }
      const g = await graphFor(ctx.cwd, 0);
      ctx.log(sub === 'mermaid' ? mermaid(g) : formatGraph(g));
    },
  });

  rein.registerCommand({
    name: 'symbols',
    description: 'Symbols across repos, from their SCIP indexes',
    usage: 'Symbols across repos from their SCIP indexes: /symbols <name> (definition and every use), /symbols cross (used outside their repo), /symbols index',
    async run(args, ctx) {
      const arg = args.trim();
      const repos = findServices(ctx.cwd);
      if (arg === 'index') return void (await indexRepos(repos, (line) => ctx.log(line)));
      const g = buildSymbolGraph(repos);
      if (!g.repos.length) return ctx.log('No SCIP indexes (index.scip) here yet. /symbols index writes one per repo with scip-typescript, scip-python, scip-go, scip-java or rust-analyzer, where installed.');
      if (!arg || arg === 'cross') {
        const seams = crossRepo(g);
        return ctx.log(seams.length ? [`${plural(seams.length, 'symbol')} used outside the repo that defines ${seams.length === 1 ? 'it' : 'them'} (indexes from ${g.repos.join(', ')}):`, ...seams.slice(0, 40).map((s) => `  ${s.name}  ${s.from} → ${s.usedIn.join(', ')}`)].join('\n') : `Nothing is shared between ${g.repos.join(', ')} (by their indexes).`);
      }
      ctx.log(formatLookup(lookup(g, arg)));
    },
  });

  rein.registerCommand({
    name: 'refs',
    description: 'Follow an endpoint or RPC across repos',
    usage: 'Follow an endpoint (POST /orders/{id}) or RPC (Ledger.Post) across repos: gateway, the service that serves it, every caller',
    async run(args, ctx) {
      const target = args.trim();
      if (!target) return ctx.log('Usage: /refs <endpoint or RPC>, e.g. /refs POST /orders/{id} or /refs Ledger.Post', 'error');
      const g = await graphFor(ctx.cwd);
      const r = await findApiRefs(ctx.cwd, g.services, target);
      ctx.log(r ? formatRefs(r) : 'Give an endpoint like POST /orders/{id} or an RPC like Ledger.Post (for a function or type, /symbols <name>).', r ? 'info' : 'error');
    },
  });

  rein.registerCommand({
    name: 'impact',
    description: 'Every caller, in every repo, of what this branch changes',
    usage: 'Every caller, in every repo, of the endpoints, RPCs and exported symbols this branch changes, breaking changes first',
    async run(_args, ctx) {
      ctx.log('Working out what this branch changes and who uses it…');
      const g = await graphFor(ctx.cwd);
      ctx.log(formatImpact(await impactReport(ctx.cwd, g.services)));
    },
  });

  rein.registerCommand({
    name: 'changeset',
    description: 'One change across several repos',
    usage: 'One change across several repos: /changeset start <name> [repos], status, test (in dependency order), pr [yes] (linked PRs)',
    async run(args, ctx) {
      const ws = findWorkspace(ctx.cwd);
      if (!ws) return ctx.log('Change sets span the repos of a workspace: put a rein.workspace.yaml above them first (see the Workspaces docs).', 'error');
      const [sub = 'status', ...rest] = args.trim().split(/\s+/).filter(Boolean);
      if (sub === 'start') {
        const [name, ...repos] = rest;
        if (!name) return ctx.log('Usage: /changeset start <name> [repo…] (all cloned repos when none are named)', 'error');
        const {set, done, failed} = await startChangeSet(ws, name, repos);
        return ctx.log([`Change set ${set.name}: branch ${set.branch} in ${done.join(', ') || 'no repo'}.`, ...failed].join('\n'), failed.length ? 'error' : 'info');
      }
      const sets = loadChangeSets(ws);
      const yes = rest.includes('yes');
      const named = rest.filter((x) => x !== 'yes')[0];
      const set = named ? sets.find((s) => s.name === named) : sets[0];
      if (!set) return ctx.log(sets.length ? `No change set "${named}". Change sets: ${sets.map((s) => s.name).join(', ')}` : 'No change sets yet: /changeset start <name> makes one branch for the task in each repo.');
      if (sub === 'status') return ctx.log(formatState(set, await changeSetState(ws, set)));
      if (sub === 'test') {
        const g = await graphFor(ctx.cwd);
        return ctx.log(formatTests(await testChangeSet(ws, set, g.edges, undefined, (l) => ctx.log(l))));
      }
      if (sub === 'pr') {
        if (!yes) return ctx.log(`/changeset pr yes will push ${set.branch} in ${set.repos.join(', ')}, open a pull request in each (gh), and link them to each other.`);
        const r = await openPrs(ws, set, set.name);
        return ctx.log([r.opened.length && `Opened pull requests in ${r.opened.join(', ')}.`, r.linked.length && `Linked ${r.linked.join(', ')}.`, ...r.failed].filter(Boolean).join('\n'), r.failed.length ? 'error' : 'info');
      }
      ctx.log('Usage: /changeset [start <name> [repo…] | status | test | pr [yes]] [name]', 'error');
    },
  });

  rein.registerCommand({
    name: 'codemap',
    description: 'Architecture maps of the services',
    usage: 'Architecture map in docs/codemap/: a page per service, kept fresh. /codemap writes or refreshes it, /codemap status, /codemap annotate',
    async run(args, ctx) {
      const root = findWorkspace(ctx.cwd)?.root ?? ctx.cwd;
      const arg = args.trim();
      const g = await graphFor(ctx.cwd, 0);
      if (arg === 'status') {
        const s = await codemapStatus(root, g);
        return ctx.log([`Codemap in ${path.relative(ctx.cwd, codemapDir(root)) || 'docs/codemap'}:`, s.missing.length ? `  no page yet: ${s.missing.join(', ')}` : '', s.stale.length ? `  out of date: ${s.stale.join(', ')} (/codemap refreshes them)` : '', s.unannotated.length ? `  no notes yet: ${s.unannotated.join(', ')} (/codemap annotate)` : '', !s.missing.length && !s.stale.length && !s.unannotated.length ? '  up to date' : ''].filter(Boolean).join('\n'));
      }
      const r = await writeCodemap(root, g, {force: arg === 'rebuild'});
      ctx.log(`Codemap: ${r.written.length ? `wrote ${r.written.join(', ')}` : 'every page was up to date'}${r.unchanged.length && r.written.length ? ` (${r.unchanged.length} unchanged)` : ''}, in ${path.relative(ctx.cwd, r.dir) || r.dir}/.`);
      if (arg === 'annotate') {
        const {unannotated} = await codemapStatus(root, g);
        if (!unannotated.length) return ctx.log('Every page has notes.');
        ctx.send(annotateTask(root, unannotated));
      }
    },
  });

  rein.registerCommand({
    name: 'stack',
    description: 'Run the services a change needs locally',
    usage: 'Run the services a change needs locally (Docker Compose), wait for health checks: /stack up [services | --helm <chart>], status, logs <service>, down',
    async run(args, ctx) {
      const root = findWorkspace(ctx.cwd)?.root ?? ctx.cwd;
      const stack = new LocalStack(root);
      const [sub = 'status', ...rest] = args.trim().split(/\s+/).filter(Boolean);
      if (sub === 'up' && rest[0] === '--helm') {
        if (!rest[1]) return ctx.log('Usage: /stack up --helm <chart folder>', 'error');
        return ctx.log(await stack.helm(path.resolve(ctx.cwd, rest[1])));
      }
      if (sub === 'up') {
        const names = rest.length ? rest : await servicesForChange(root, findServices(ctx.cwd));
        ctx.log(`Starting ${names.length ? names.join(', ') : 'the whole stack'} (docker compose up --wait)…`);
        const r = await stack.up(names);
        return ctx.log(`${r.message}\n${formatServices(r.services)}`, r.ok ? 'info' : 'error');
      }
      if (sub === 'logs') return ctx.log(await stack.logs(rest[0] ?? ''));
      if (sub === 'down') return ctx.log(await stack.down());
      ctx.log(composeFile(root) ? formatServices(await stack.status()) : 'No compose file here (compose.yaml or docker-compose.yml).');
    },
  });
}
