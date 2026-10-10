import os from 'node:os';
import {describe, expect, it} from 'vitest';
import type {EndOfTurnCheck, Rein} from 'rein-harness/api';
import {activate} from '../src/index.js';

function fakeRein(settings: Record<string, unknown> = {}) {
  const commands: string[] = [];
  const tools: string[] = [];
  const checks: EndOfTurnCheck[] = [];
  const rein = {
    version: 3,
    item: {id: 'quality', dir: os.tmpdir(), dataDir: os.tmpdir()},
    registerCommand: (c: {name: string}) => commands.push(c.name),
    registerTool: (t: {name: string}) => tools.push(t.name),
    ui: {sidebarSection() {}, statusSegment() {}, theme() {}, redraw() {}},
    checks: {endOfTurn: (c: EndOfTurnCheck) => checks.push(c), afterEdit() {}},
    exec: async () => ({code: 0, stdout: '', stderr: ''}),
    shell: async () => ({ok: true, text: ''}),
    git: async () => ({code: 0, stdout: '', stderr: ''}),
    ripgrep: async () => undefined,
    workspace: () => undefined,
    config: () => ({}),
    settings: {get: (k: string) => settings[k], set: (k: string, v: unknown) => void (settings[k] = v)},
    on: () => () => {},
  } as unknown as Rein;
  return {rein, commands, tools, checks};
}

describe('the Test quality item', () => {
  it('adds /affected, /build, /coverage and /mutate; the tool and the check only once turned on', async () => {
    const off = fakeRein();
    activate(off.rein);
    expect(off.commands).toEqual(['affected', 'build', 'coverage', 'mutate']);
    expect(off.tools).toEqual([]);
    expect(await off.checks[0]!.run([{path: 'a.ts', after: 'x'}])).toBeUndefined();
    const on = fakeRein({tool: true});
    activate(on.rein);
    expect(on.tools).toEqual(['affected']);
  });
});
