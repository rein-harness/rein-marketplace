import path from 'node:path';
import type {Rein} from 'rein-harness/api';
import {branchContracts, classify, contractNote} from './changes.js';
import {deadCodeTask, findDeadCode, findFlags, flagRemovalTask, formatFlags, isStale} from './deadcode.js';
import {formatChanges} from './diff.js';
import {branchMigrations, formatFindings, isMigration, lintMigration, migrationNote} from './migrations.js';
import {RepeatEdits} from './repeats.js';
import {setHost} from './host.js';

/**
 * Contracts and migrations: breaking-change detection for API contracts, migration safety, dead
 * code and stale flags, codemods and migration playbooks (the skills in skills/). Its checks on the
 * agent's work are off until you turn them on (/contracts checks).
 */
const CHECKS = {
  contracts: 'At the end of a request that changed an API contract, the agent hears about the breaking changes it made',
  migrations: 'At the end of a request that wrote database migrations, the agent hears about steps that lock, need a backfill, can’t be undone or break running code',
  codemod: 'When the agent has made the same hand edit in 4 files, it’s told to write a codemod for the rest',
} as const;
type Check = keyof typeof CHECKS;

export function activate(rein: Rein): void {
  setHost(rein);
  const on = (c: Check) => rein.settings.get<boolean>(`check.${c}`) === true;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

  rein.registerCommand({
    name: 'contracts',
    description: 'Breaking changes to API contracts on this branch',
    usage: 'Breaking and safe changes to API contracts (OpenAPI, protobuf, GraphQL, Avro) on this branch; /contracts checks [<check> on|off] for the checks on the agent’s work',
    async run(args, ctx) {
      const [sub, which, state] = args.trim().split(/\s+/);
      if (sub === 'checks') {
        if (which && which in CHECKS && (state === 'on' || state === 'off')) {
          rein.settings.set(`check.${which}`, state === 'on');
          return ctx.log(`The ${which} check is ${state}.`);
        }
        return ctx.log(['Checks on the agent’s work (off until you turn them on):', ...(Object.keys(CHECKS) as Check[]).map((c) => `  ${on(c) ? '●' : '○'} ${c.padEnd(10)} ${CHECKS[c]}`), '/contracts checks <check> on|off'].join('\n'));
      }
      const {base, files} = await branchContracts(ctx.cwd);
      if (!files.length) return ctx.log(`No API contracts (OpenAPI, protobuf, GraphQL, Avro) changed against ${base}.`);
      const breaking = files.filter((f) => f.changes.some((c) => c.kind === 'breaking')).length;
      ctx.log([`Contract changes against ${base}: ${breaking ? `${plural(breaking, 'file')} with breaking changes` : 'nothing breaking'}`, ...files.map((f) => formatChanges(f.file, f.changes))].join('\n'));
    },
  });

  rein.registerCommand({
    name: 'migrations',
    description: 'Risks in this branch’s database migrations',
    usage: 'Risks in this branch’s database migrations: locks, missing backfills, irreversible steps, renames that break running code',
    async run(_args, ctx) {
      const {base, findings, files} = await branchMigrations(ctx.cwd);
      if (!files.length) return ctx.log(`No migration files added or changed against ${base}.`);
      if (!findings.length) return ctx.log(`${plural(files.length, 'migration file')} against ${base}: nothing risky found.`);
      ctx.log(`${plural(findings.length, 'risk')} in ${plural(files.length, 'migration file')} (against ${base}):\n${formatFindings(findings)}`);
    },
  });

  rein.registerCommand({
    name: 'deadcode',
    description: 'Definitions nothing refers to',
    usage: 'Definitions nothing refers to (JS/TS, Python, Go): /deadcode lists them, /deadcode remove has the agent delete them',
    async run(args, ctx) {
      const {dead, files} = await findDeadCode(ctx.cwd);
      if (!dead.length) return ctx.log(`Nothing unused found in ${files} source files.`);
      if (args.trim() !== 'remove')
        return ctx.log([`${dead.length}${dead.length >= 200 ? '+' : ''} definition${dead.length === 1 ? '' : 's'} nothing else refers to (candidates: dynamic use can’t be seen):`, ...dead.slice(0, 60).map((d) => `  ${d.file}:${d.line}  ${d.kind} ${d.name}`), ...(dead.length > 60 ? [`  … ${dead.length - 60} more`] : []), '/deadcode remove has the agent check each one and delete what is really unused.'].join('\n'));
      ctx.send(deadCodeTask(dead.slice(0, 100)));
    },
  });

  rein.registerCommand({
    name: 'flags',
    description: 'Feature flags, and the stale ones',
    usage: 'Feature flags the code reads, and the stale ones (fully on or off, or older than 90 days): /flags, /flags remove <key>',
    async run(args, ctx) {
      const [sub, key] = args.trim().split(/\s+/);
      const flags = await findFlags(ctx.cwd);
      if (sub === 'remove') {
        const f = flags.find((x) => x.key === key);
        if (!f) return ctx.log(key ? `The code doesn’t read a flag "${key}" (through the SDKs this knows).` : 'Usage: /flags remove <key>', 'error');
        return ctx.send(flagRemovalTask(f));
      }
      if (!flags.length) return ctx.log('No feature flag reads found (LaunchDarkly, Unleash, OpenFeature, GrowthBook, Flagsmith, Split, Flipper).');
      const stale = flags.filter((f) => isStale(f)).length;
      ctx.log([`${plural(flags.length, 'flag')} read in the code, ${stale} stale (! = fully on or off in the repo’s flag files, or 90+ days old):`, formatFlags(flags), '/flags remove <key> has the agent remove one, keeping the live branch.'].join('\n'));
    },
  });

  // The checks on the agent's work, each once per request and only when turned on.
  rein.checks.endOfTurn({
    id: 'contracts',
    run(changed) {
      if (!on('contracts')) return undefined;
      const found = changed.map((f) => classify(f.path, f.before, f.after)).filter((x): x is NonNullable<typeof x> => !!x);
      return found.length ? contractNote(found) : undefined;
    },
  });
  rein.checks.endOfTurn({
    id: 'migrations',
    run(changed) {
      if (!on('migrations')) return undefined;
      const root = rein.workspace()?.root ?? process.cwd();
      const findings = changed.filter((f) => f.after !== undefined && isMigration(f.path)).flatMap((f) => lintMigration(root, f.path, f.after!));
      return migrationNote(findings);
    },
  });
  const repeats = new RepeatEdits();
  rein.on('requestStart', () => repeats.reset());
  rein.checks.afterEdit({
    id: 'codemod',
    run({path: file, args}) {
      if (!on('codemod')) return undefined;
      return repeats.after(args as never, path.resolve(file));
    },
  });
}
