// The part of Rein's util/platform.ts this item uses: how to run a command line.
import {existsSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

export const isWindows = process.platform === 'win32';
let gitBash: string | null | undefined;

/**
 * Git Bash on Windows (what Claude Code uses there too): REIN_GIT_BASH_PATH /
 * CLAUDE_CODE_GIT_BASH_PATH, the default install locations, or `bash.exe` beside `git` on PATH.
 */
export function findGitBash(): string | undefined {
  if (gitBash !== undefined) return gitBash ?? undefined;
  const candidates = [
    process.env.REIN_GIT_BASH_PATH,
    process.env.CLAUDE_CODE_GIT_BASH_PATH,
    path.join(process.env.ProgramFiles ?? 'C:\\Program Files', 'Git', 'bin', 'bash.exe'),
    path.join(process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)', 'Git', 'bin', 'bash.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'Git', 'bin', 'bash.exe'),
  ].filter((p): p is string => !!p);
  let found = candidates.find((p) => existsSync(p));
  if (!found) {
    const where = spawnSync('where', ['git'], {encoding: 'utf8'});
    const git = where.stdout?.split(/\r?\n/).find(Boolean);
    const bash = git && path.join(path.dirname(path.dirname(git)), 'bin', 'bash.exe');
    if (bash && existsSync(bash)) found = bash;
  }
  gitBash = found ?? null;
  return found;
}

/**
 * How to run a shell command line: $SHELL (or /bin/sh) -c on macOS/Linux; on Windows Git Bash -c
 * when installed (bash syntax, like Claude Code), else PowerShell.
 */
export function shellFor(command: string): {file: string; args: string[]; kind: 'posix' | 'powershell'} {
  if (!isWindows) return {file: process.env.SHELL || '/bin/sh', args: ['-c', command], kind: 'posix'};
  const bash = findGitBash();
  if (bash) return {file: bash, args: ['-c', command], kind: 'posix'};
  return {file: 'powershell.exe', args: ['-NoProfile', '-NonInteractive', '-Command', command], kind: 'powershell'};
}
