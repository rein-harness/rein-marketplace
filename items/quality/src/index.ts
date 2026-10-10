import {readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import type {Rein} from 'rein-harness/api';
import {affected, changedFiles, detectBuild, formatAffected} from './build/affected.js';
import {detectCaches} from './build/caches.js';
import {addedLinesByFile, findReport, parseCoverage, ranges, uncoveredChanges} from './build/coverage.js';
import {detectMutator, formatMutation, mutate} from './build/mutate.js';
import {digestLog, formatDigest} from './tools/logDigest.js';
import {setHost} from './util/proc.js';

/**
 * Test quality: what your changes affect in a monorepo (and the tests for just that), the build
 * system and its caches, the changed lines no test covers, and mutation testing. Its tool for the
 * agent and its check on the agent's work are off until you turn them on (/affected tool on,
 * /affected check on).
 */
export function activate(rein: Rein): void {
  setHost(rein);
  const on = (k: 'tool' | 'check') => rein.settings.get<boolean>(k) === true;
  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

  if (on('tool'))
    rein.registerTool({
      name: 'affected',
      label: 'Affected',
      description: "What a change affects in this monorepo, from its build system's dependency graph (Nx, Turborepo, Bazel or Pants), and the command that tests just that. Without files: the working tree's changes vs HEAD. Use it to pick which tests to run instead of the whole suite.",
      inputSchema: {type: 'object', properties: {files: {type: 'array', items: {type: 'string'}, description: 'Changed files, relative to the project (default: git changes)'}}},
      summarize: (a) => (Array.isArray(a?.files) ? `${a.files.length} files` : 'working tree'),
      async run(args, ctx) {
        if (!detectBuild(ctx.cwd)) return {ok: false, text: 'No Nx, Turborepo, Bazel or Pants workspace here.'};
        const files = Array.isArray(args?.files) && args.files.length ? args.files.map(String) : await changedFiles(ctx.cwd);
        if (!files.length) return {ok: true, text: 'No changes (vs HEAD) to analyze.'};
        const a = await affected(ctx.cwd, files);
        return a ? {ok: !a.note || a.targets.length > 0, text: formatAffected(a)} : {ok: false, text: 'No build system answered.'};
      },
    });

  // At the end of a request that changed files, in a monorepo: run the tests for just what it
  // affects; a failure goes back to the agent. Once per request, and only when turned on.
  rein.checks.endOfTurn({
    id: 'affected',
    async run(changed) {
      if (!on('check') || !changed.length) return undefined;
      const root = process.cwd();
      if (!detectBuild(root)) return undefined;
      const a = await affected(root, changed.map((f) => f.path));
      if (!a?.test) return undefined;
      // Through Rein's shell tool, so the approval mode, permission rules and sandbox apply as to the agent's own commands.
      const r = await rein.shell(a.test, {timeoutMs: 60 * 60_000});
      if (r.ok) return undefined;
      const out = r.text.trim();
      const digest = formatDigest(digestLog(out), out.split('\n').length);
      return `The tests for what this request changed failed (${a.system}: ${a.targets.slice(0, 8).join(', ')}${a.targets.length > 8 ? ', …' : ''}; \`${a.test}\`):\n${digest ?? out.split('\n').slice(-60).join('\n')}\nFix them before you finish, or if a failure isn't caused by this change, say so.`;
    },
  });

  rein.registerCommand({
    name: 'affected',
    description: 'What your changes affect, and the command that tests just that',
    usage: "What your changes affect, from the monorepo's build graph (Nx, Turborepo, Bazel, Pants), and the command that tests just that; /affected tool on|off, /affected check on|off",
    async run(args, ctx) {
      const [sub, state] = args.trim().split(/\s+/);
      if (sub === 'tool' || sub === 'check') {
        if (state === 'on' || state === 'off') {
          rein.settings.set(sub, state === 'on');
          return ctx.log(sub === 'tool' ? `The agent's affected tool is ${state} from the next time Rein starts.` : `The affected-tests check is ${state}: at the end of a request, the tests for what it changed run, and a failure goes back to the agent.`);
        }
        return ctx.log(`The agent's affected tool is ${on('tool') ? 'on' : 'off'}; the affected-tests check is ${on('check') ? 'on' : 'off'}. /affected tool|check on|off`);
      }
      if (!detectBuild(ctx.cwd)) return ctx.log('No Nx, Turborepo, Bazel or Pants workspace here (nx.json, turbo.json, MODULE.bazel/WORKSPACE, pants.toml).');
      const files = await changedFiles(ctx.cwd);
      if (!files.length) return ctx.log('No changes (vs HEAD) to analyze.');
      const a = await affected(ctx.cwd, files);
      ctx.log(a ? `${plural(files.length, 'changed file')}. ${formatAffected(a)}` : 'No build system answered.', a?.note && !a.targets.length ? 'error' : 'info');
    },
  });

  rein.registerCommand({
    name: 'build',
    description: 'The build system here and its caches',
    usage: 'The build system here (Nx, Turborepo, Bazel, Pants), its caches, and whether the sandbox lets agent builds use them',
    async run(_args, ctx) {
      const b = detectBuild(ctx.cwd);
      const caches = detectCaches(ctx.cwd);
      const sandbox = String(rein.config().sandbox ?? 'write');
      if (!b && !caches.length) return ctx.log('No Nx, Turborepo, Bazel or Pants workspace and no build cache configured here.');
      const remoteBlocked = sandbox === 'strict' && caches.some((c) => c.kind === 'remote');
      ctx.log(
        [
          b ? `Build system: ${b.system}${b.bin.includes('node_modules') ? ' (from node_modules)' : ''}. /affected shows what your changes affect.` : 'No monorepo build system (Nx, Turborepo, Bazel, Pants).',
          ...(caches.length ? ['Caches:', ...caches.map((c) => `  ${c.system}: ${c.kind} (${c.where})`)] : ['No build cache configured.']),
          remoteBlocked ? "The sandbox is strict (no network), so agent builds can't reach the remote cache: /settings sandbox write allows it." : caches.length ? `Agent builds use these: the sandbox (${sandbox}) leaves build caches writable${caches.some((c) => c.kind === 'remote') && sandbox !== 'off' ? ' and the network open' : ''}.` : '',
        ].filter(Boolean).join('\n'),
        remoteBlocked ? 'error' : 'info',
      );
    },
  });

  rein.registerCommand({
    name: 'coverage',
    description: 'Lines your changes add that no test covers',
    usage: 'Lines your changes add that no test covers, from the last coverage report; /coverage tests asks the agent to write tests for them',
    async run(args, ctx) {
      const root = ctx.cwd;
      const report = findReport(root);
      if (!report) return ctx.log('No coverage report here (coverage/lcov.info, coverage-final.json, coverage.xml or a Go cover profile). Run your tests with coverage first.');
      const added = await addedLinesByFile(root);
      let hits;
      try {
        hits = parseCoverage(report, readFileSync(report, 'utf8'));
      } catch (err) {
        return ctx.log(`Couldn't read ${path.relative(root, report)}: ${(err as Error).message}`, 'error');
      }
      const missed = uncoveredChanges(hits, root, added);
      const age = Math.round((Date.now() - statSync(report).mtimeMs) / 60_000);
      const from = `${path.relative(root, report)} (${age < 1 ? 'just now' : `${age} min ago`})`;
      if (!missed.length) return ctx.log(`Every changed line the report covers ran in a test, per ${from}.`);
      const list = missed.map((m) => `  ${m.file}: ${ranges(m.lines)}`);
      if (args.trim() !== 'tests') return ctx.log([`Changed lines no test ran, per ${from}:`, ...list, '/coverage tests asks the agent to write tests for them.'].join('\n'));
      ctx.send([`Write tests that cover these lines my changes added, which no test runs (from ${from}):`, ...list, '', "Follow the project's existing test style and location. Test the behavior, not just the lines; run the new tests to show they pass."].join('\n'));
    },
  });

  rein.registerCommand({
    name: 'mutate',
    description: 'Mutation testing of your changed files',
    usage: 'Mutation testing of your changed files (Stryker, mutmut, go-mutesting): do the tests catch planted bugs? /mutate tests asks the agent to close the gaps',
    async run(args, ctx) {
      const root = ctx.cwd;
      const files = await changedFiles(root);
      if (!files.length) return ctx.log('No changes (vs HEAD) to mutation-test.');
      const m = await detectMutator(root, files);
      if (!m) return ctx.log('No mutation tool for these files: install Stryker (npm i -D @stryker-mutator/core), mutmut (Python) or go-mutesting (Go).');
      ctx.log(`Running ${m.tool} on ${plural(files.length, 'changed file')} (this can take a while)…`);
      const r = await mutate(root, files, m);
      const text = formatMutation(r);
      if (args.trim() !== 'tests' || !(r.survivors?.length || r.summary)) return ctx.log(text, r.error ? 'error' : 'info');
      ctx.send(`${text}\n\nStrengthen the tests so they catch these: each surviving mutant is a bug the tests would miss. Add or tighten assertions (don't change the code under test to suit them), then run the tests.`);
    },
  });
}
