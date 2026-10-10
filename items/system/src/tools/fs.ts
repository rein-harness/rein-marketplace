// The parts of Rein's tools/fs.ts this item uses.
import {hostRein, run} from '../util/proc.js';

export const DECLARATION =
  /^(?:\t|  |    )?(?:export\s+|default\s+|public\s+|private\s+|protected\s+|internal\s+|static\s+|async\s+|abstract\s+|final\s+|pub(?:\(crate\))?\s+|override\s+|@\w+\s+)*(?:function\*?|class|interface|type|enum|struct|trait|impl|module|namespace|object|record|def|func|fn|const|let|var|val|package|import\s*\(|describe|it|test|macro_rules!|#{1,3}\s|\w[\w.<>\[\], *&:]*\s+\**\w+\s*\()/;

/** The ripgrep that ships with Rein (inside Rein), else the package's (tests), else rg on PATH. */
export async function ripgrep(): Promise<string | null> {
  const r = hostRein();
  if (r) return (await r.ripgrep()) ?? null;
  const pkg = await import('@vscode/ripgrep').catch(() => undefined);
  if (pkg?.rgPath) return pkg.rgPath;
  return (await run('rg', ['--version'])).code === 0 ? 'rg' : null;
}

const escape = (s: string) => s.replace(/[.+^${}()|[\]\\]/g, '\\$&');
export function globToRegExp(glob: string): RegExp {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]!;
    if (c === '*') {
      if (glob[i + 1] === '*') {
        re += '.*';
        i++;
        if (glob[i + 1] === '/') i++;
      } else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if (c === '{') {
      const end = glob.indexOf('}', i);
      re += `(${glob.slice(i + 1, end).split(',').map(escape).join('|')})`;
      i = end;
    } else re += escape(c);
  }
  return new RegExp(`^${re}$`);
}
