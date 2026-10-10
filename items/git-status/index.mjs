// Git status: the branch and the changed files, drawn in Rein's sidebar and status line.
// Rein calls activate() at startup; render() runs when Rein draws, so it only reads what refresh() found.

/** @param {import('rein-harness/api').Rein} rein */
export function activate(rein) {
  let state = {branch: undefined, ahead: 0, behind: 0, files: []};

  async function refresh() {
    const head = await rein.git(['rev-parse', '--abbrev-ref', 'HEAD']);
    if (head.code !== 0) {
      state = {branch: undefined, ahead: 0, behind: 0, files: []};
      return rein.ui.redraw();
    }
    const counts = await rein.git(['rev-list', '--left-right', '--count', '@{upstream}...HEAD']);
    const [behind = 0, ahead = 0] = counts.code === 0 ? counts.stdout.trim().split(/\s+/).map(Number) : [];
    const status = await rein.git(['status', '--porcelain']);
    const files = status.stdout.split('\n').filter(Boolean).map((l) => ({code: l.slice(0, 2).trim() || '?', file: l.slice(3)}));
    state = {branch: head.stdout.trim(), ahead, behind, files};
    rein.ui.redraw();
  }

  const colour = (code) => (code.includes('?') ? '\x1b[90m' : code.includes('D') ? '\x1b[31m' : code.includes('A') ? '\x1b[32m' : '\x1b[33m');
  const reset = '\x1b[0m';

  rein.ui.sidebarSection({
    id: 'git',
    title: 'Git',
    render(width) {
      if (!state.branch) return ['\x1b[90mnot a git repo\x1b[0m'];
      const sync = [state.ahead && `↑${state.ahead}`, state.behind && `↓${state.behind}`].filter(Boolean).join(' ');
      const lines = [`⎇ ${state.branch}${sync ? `  ${sync}` : ''}`];
      if (!state.files.length) lines.push('\x1b[90mclean\x1b[0m');
      for (const f of state.files.slice(0, 6)) lines.push(`${colour(f.code)}${f.code.padEnd(2)}${reset} ${f.file.length > width - 4 ? '…' + f.file.slice(-(width - 5)) : f.file}`);
      if (state.files.length > 6) lines.push(`\x1b[90m… ${state.files.length - 6} more\x1b[0m`);
      return lines;
    },
  });

  rein.ui.statusSegment({
    id: 'branch',
    render: () => (state.branch ? `⎇ ${state.branch}${state.files.length ? ` ●${state.files.length}` : ''}` : undefined),
  });

  rein.on('turnEnd', () => void refresh());
  void refresh();
}
