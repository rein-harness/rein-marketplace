import {execFile} from 'node:child_process';
import type {Rein} from 'rein-harness/api';

/**
 * What the item needs from Rein: running programs and ripgrep, through the extension API. The tests
 * run without Rein, so then they're plain child processes and the `rg` on PATH.
 */
let rein: Rein | undefined;
export const setHost = (r: Rein) => void (rein = r);

export type RunResult = {code: number; stdout: string; stderr: string};
export function run(command: string, args: string[], opts: {cwd?: string; timeoutMs?: number} = {}): Promise<RunResult> {
  if (rein) return rein.exec(command, args, opts);
  return new Promise((resolve) =>
    execFile(command, args, {cwd: opts.cwd, timeout: opts.timeoutMs, maxBuffer: 64 * 1024 * 1024}, (err, stdout, stderr) =>
      resolve({code: err ? (typeof (err as NodeJS.ErrnoException).code === 'number' ? Number((err as NodeJS.ErrnoException).code) : 1) : 0, stdout: String(stdout), stderr: String(stderr)}),
    ),
  );
}

export async function ripgrep(): Promise<string | undefined> {
  if (rein) return rein.ripgrep();
  // Tests: the ripgrep package Rein ships (a dev dependency here), else an rg on PATH.
  const pkg = await import('@vscode/ripgrep').catch(() => undefined);
  if (pkg?.rgPath) return pkg.rgPath;
  return (await run('rg', ['--version'])).code === 0 ? 'rg' : undefined;
}
