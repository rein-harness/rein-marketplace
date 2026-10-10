// Rein's run(), for this item: through the extension API inside Rein, a child process in tests.
import {execFile} from 'node:child_process';
import type {Rein} from 'rein-harness/api';

let rein: Rein | undefined;
export const setHost = (r: Rein) => void (rein = r);

export type RunResult = {code: number | null; stdout: string; stderr: string};
export function run(cmd: string, args: string[], opts: {cwd?: string; timeoutMs?: number} = {}): Promise<RunResult> {
  if (rein) return rein.exec(cmd, args, opts);
  return new Promise((resolve) =>
    execFile(cmd, args, {cwd: opts.cwd, timeout: opts.timeoutMs, maxBuffer: 64 * 1024 * 1024, windowsHide: true}, (err, stdout, stderr) =>
      resolve({code: err ? (typeof (err as NodeJS.ErrnoException).code === 'number' ? Number((err as NodeJS.ErrnoException).code) : 1) : 0, stdout: String(stdout), stderr: String(stderr)}),
    ),
  );
}
export const hostRein = () => rein;
