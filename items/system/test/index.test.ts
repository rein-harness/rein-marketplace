import os from 'node:os';
import {describe, expect, it} from 'vitest';
import type {Rein} from 'rein-harness/api';
import {activate} from '../src/index.js';

function fakeRein(settings: Record<string, unknown> = {}) {
  const commands: string[] = [];
  const tools: string[] = [];
  const rein = {
    version: 1,
    item: {id: 'system', dir: os.tmpdir(), dataDir: os.tmpdir()},
    registerCommand: (c: {name: string}) => commands.push(c.name),
    registerTool: (t: {name: string}) => tools.push(t.name),
    ui: {sidebarSection() {}, statusSegment() {}, theme() {}, redraw() {}},
    checks: {endOfTurn() {}, afterEdit() {}},
    exec: async () => ({code: 0, stdout: '', stderr: ''}),
    git: async () => ({code: 0, stdout: '', stderr: ''}),
    ripgrep: async () => undefined,
    workspace: () => undefined,
    config: () => ({}),
    settings: {get: (k: string) => settings[k], set: (k: string, v: unknown) => void (settings[k] = v)},
    on: () => () => {},
  } as unknown as Rein;
  return {rein, commands, tools};
}

describe('the Multi-repo systems item', () => {
  it("adds its seven commands, and the agent's tools only once turned on", () => {
    const off = fakeRein();
    activate(off.rein);
    expect(off.commands).toEqual(['services', 'symbols', 'refs', 'impact', 'changeset', 'codemap', 'stack']);
    expect(off.tools).toEqual([]);
    const on = fakeRein({tools: true});
    activate(on.rein);
    expect(on.tools).toEqual(['service_graph', 'symbol_refs', 'api_refs', 'stack']);
  });
});
