import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, realpathSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {describe, expect, it} from 'vitest';
import type {Command, EndOfTurnCheck, AfterEditCheck, Rein} from 'rein-harness/api';
import {activate} from '../src/index.js';

/** Rein, as the item sees it, in memory: what it registers is kept for the test to call. */
function fakeRein(cwd: string) {
  const commands: Command[] = [];
  const endChecks: EndOfTurnCheck[] = [];
  const editChecks: AfterEditCheck[] = [];
  const settings: Record<string, unknown> = {};
  const listeners: Record<string, (() => void)[]> = {};
  const rein = {
    version: 1,
    item: {id: 'contracts', dir: cwd, dataDir: cwd},
    registerCommand: (c: Command) => commands.push(c),
    registerTool() {},
    ui: {sidebarSection() {}, statusSegment() {}, theme() {}, redraw() {}},
    checks: {endOfTurn: (c: EndOfTurnCheck) => endChecks.push(c), afterEdit: (c: AfterEditCheck) => editChecks.push(c)},
    exec: (cmd: string, args: string[], opts?: {cwd?: string}) =>
      new Promise((resolve) => {
        try {
          resolve({code: 0, stdout: execFileSync(cmd, args, {cwd: opts?.cwd ?? cwd, encoding: 'utf8'}), stderr: ''});
        } catch (err) {
          resolve({code: 1, stdout: '', stderr: String((err as Error).message)});
        }
      }),
    git: () => Promise.resolve({code: 0, stdout: '', stderr: ''}),
    ripgrep: () => Promise.resolve('rg'),
    workspace: () => undefined,
    config: () => ({}),
    settings: {get: (k: string) => settings[k], set: (k: string, v: unknown) => void (settings[k] = v)},
    on: (e: string, fn: () => void) => ((listeners[e] ??= []).push(fn), () => {}),
  } as unknown as Rein;
  return {rein, commands, endChecks, editChecks, settings, emit: (e: string) => listeners[e]?.forEach((f) => f())};
}

const run = async (c: Command, args: string, cwd: string) => {
  const out: string[] = [];
  const sent: string[] = [];
  await c.run(args, {cwd, log: (t) => out.push(t), send: (t) => sent.push(t), window() {}});
  return {out: out.join('\n'), sent};
};

describe('the Contracts and migrations item', () => {
  it('adds /contracts, /migrations, /deadcode and /flags', () => {
    const {rein, commands} = fakeRein(os.tmpdir());
    activate(rein);
    expect(commands.map((c) => c.name)).toEqual(['contracts', 'migrations', 'deadcode', 'flags']);
  });

  it("finds a breaking change on the branch, and checks the agent's work only once turned on", async () => {
    const dir = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'contracts-item-')));
    const git = (...a: string[]) => execFileSync('git', a, {cwd: dir, stdio: 'ignore', env: {...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t'}});
    const v1 = 'openapi: 3.0.0\npaths:\n  /orders/{id}:\n    get:\n      responses:\n        "200":\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  total: {type: number}\n';
    git('init', '-q', '-b', 'main');
    mkdirSync(path.join(dir, 'api'));
    writeFileSync(path.join(dir, 'api', 'openapi.yaml'), v1);
    git('add', '.');
    git('commit', '-qm', 'api');
    const v2 = v1.replace('total: {type: number}', 'sum: {type: number}');
    writeFileSync(path.join(dir, 'api', 'openapi.yaml'), v2); // not committed: against HEAD, as with no origin
    const {rein, commands, endChecks, settings} = fakeRein(dir);
    activate(rein);
    const r = await run(commands[0]!, '', dir);
    expect(r.out).toMatch(/breaking/);
    // The end-of-turn check is off until turned on.
    const changed = [{path: 'api/openapi.yaml', before: v1, after: v2}];
    expect(await endChecks[0]!.run(changed)).toBeUndefined();
    expect((await run(commands[0]!, 'checks contracts on', dir)).out).toBe('The contracts check is on.');
    expect(settings['check.contracts']).toBe(true);
    expect(await endChecks[0]!.run(changed)).toMatch(/total/);
    expect((await run(commands[0]!, 'checks', dir)).out).toMatch(/● contracts/);
  });

  it('flags a risky migration the agent wrote, when that check is on', async () => {
    const {rein, endChecks, settings} = fakeRein(os.tmpdir());
    activate(rein);
    const changed = [{path: 'migrations/0002_drop.sql', after: 'ALTER TABLE orders DROP COLUMN total;'}];
    expect(await endChecks[1]!.run(changed)).toBeUndefined();
    settings['check.migrations'] = true;
    expect(await endChecks[1]!.run(changed)).toMatch(/drop|DROP|removes/i);
  });
});
