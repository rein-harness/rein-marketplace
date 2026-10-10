// Built from src/ by scripts/build.mjs: edit the TypeScript, then npm run build.
import {createRequire as __itemRequire} from 'node:module';
const require = __itemRequire(import.meta.url);

// items/quality/src/index.ts
import { readFileSync as readFileSync4, statSync as statSync2 } from "node:fs";
import path5 from "node:path";

// items/quality/src/build/affected.ts
import { existsSync } from "node:fs";
import path from "node:path";

// items/quality/src/util/proc.ts
import { execFile } from "node:child_process";
var rein;
var setHost = (r) => void (rein = r);
function run(cmd, args, opts = {}) {
  if (rein) return rein.exec(cmd, args, opts);
  return new Promise(
    (resolve) => execFile(
      cmd,
      args,
      { cwd: opts.cwd, timeout: opts.timeoutMs, maxBuffer: 64 * 1024 * 1024, windowsHide: true },
      (err, stdout, stderr) => resolve({ code: err ? typeof err.code === "number" ? Number(err.code) : 1 : 0, stdout: String(stdout), stderr: String(stderr) })
    )
  );
}

// items/quality/src/build/affected.ts
function detectBuild(root) {
  const has = (f) => existsSync(path.join(root, f));
  const local = (name) => {
    const bin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? `${name}.cmd` : name);
    return existsSync(bin) ? bin : void 0;
  };
  if (has("nx.json")) return { system: "nx", bin: local("nx") ?? "nx" };
  if (has("turbo.json")) return { system: "turbo", bin: local("turbo") ?? "turbo" };
  if (has("MODULE.bazel") || has("WORKSPACE") || has("WORKSPACE.bazel")) return { system: "bazel", bin: "bazel" };
  if (has("pants.toml")) return { system: "pants", bin: "pants" };
  return void 0;
}
async function changedFiles(root) {
  const git = async (...a) => (await run("git", a, { cwd: root, timeoutMs: 2e4 }).catch(() => void 0))?.stdout ?? "";
  const out = `${await git("diff", "--name-only", "HEAD")}
${await git("ls-files", "--others", "--exclude-standard")}`;
  return [...new Set(out.split("\n").map((l) => l.trim()).filter(Boolean))];
}
var lines = (s) => s.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith(">") && !/^(?:NX|Loading|INFO|WARNING|Computing)\b/i.test(l));
var quote = (s) => /^[\w./:@-]+$/.test(s) ? s : `'${s.replace(/'/g, `'\\''`)}'`;
async function affected(root, files) {
  const b = detectBuild(root);
  if (!b || !files.length) return void 0;
  const exec = (args) => run(b.bin, args, { cwd: root, timeoutMs: 12e4 }).catch((err) => ({ code: 1, stdout: "", stderr: err.message }));
  if (b.system === "nx") {
    const r2 = await exec(["show", "projects", "--affected", `--files=${files.join(",")}`]);
    if (r2.code !== 0) return { system: "nx", targets: [], test: "", note: (r2.stderr || r2.stdout).trim().split("\n").pop() };
    const targets2 = lines(r2.stdout);
    return { system: "nx", targets: targets2, test: targets2.length ? `nx run-many -t test -p ${targets2.join(",")}` : "" };
  }
  if (b.system === "turbo") {
    const r2 = await exec(["ls", "--affected", "--output=json"]);
    if (r2.code !== 0) return { system: "turbo", targets: [], test: "", note: (r2.stderr || r2.stdout).trim().split("\n").pop() };
    let targets2 = [];
    try {
      const j = JSON.parse(r2.stdout);
      targets2 = (j.packages?.items ?? j.packages ?? []).map((p) => typeof p === "string" ? p : p.name ?? "").filter(Boolean);
    } catch {
      targets2 = lines(r2.stdout);
    }
    return { system: "turbo", targets: targets2, test: targets2.length ? "turbo run test --affected" : "" };
  }
  if (b.system === "bazel") {
    const set = files.map(quote).join(" ");
    const r2 = await exec(["query", `rdeps(//..., set(${set}))`, "--output=label", "--keep_going"]);
    const targets2 = lines(r2.stdout).filter((l) => l.startsWith("//") || l.startsWith("@"));
    if (!targets2.length && r2.code !== 0) return { system: "bazel", targets: [], test: "", note: (r2.stderr || r2.stdout).trim().split("\n").pop() };
    return { system: "bazel", targets: targets2, test: targets2.length ? `bazel test $(bazel query 'kind(".*_test", rdeps(//..., set(${set})))')` : "" };
  }
  const r = await exec(["--changed-since=HEAD", "--changed-dependents=transitive", "list"]);
  if (r.code !== 0) return { system: "pants", targets: [], test: "", note: (r.stderr || r.stdout).trim().split("\n").pop() };
  const targets = lines(r.stdout);
  return { system: "pants", targets, test: targets.length ? "pants --changed-since=HEAD --changed-dependents=transitive test" : "" };
}
function formatAffected(a) {
  if (a.note && !a.targets.length) return `${a.system} couldn't say what this change affects: ${a.note}`;
  if (!a.targets.length) return `${a.system}: nothing depends on these changes.`;
  const shown = a.targets.slice(0, 40);
  return [
    `${a.system}: ${a.targets.length} affected ${a.system === "bazel" || a.system === "pants" ? "target" : "project"}${a.targets.length === 1 ? "" : "s"}${a.targets.length > shown.length ? ` (first ${shown.length})` : ""}:`,
    ...shown.map((t) => `  ${t}`),
    ...a.test ? [`Test just these: ${a.test}`] : []
  ].join("\n");
}

// items/quality/src/build/caches.ts
import { existsSync as existsSync2, readFileSync } from "node:fs";
import os from "node:os";
import path2 from "node:path";
var read = (f) => {
  try {
    return readFileSync(f, "utf8");
  } catch {
    return "";
  }
};
function detectCaches(root, env = process.env, home = os.homedir()) {
  const out = [];
  const bazelrc = [".bazelrc", "user.bazelrc", ".bazelrc.user"].map((f) => read(path2.join(root, f))).join("\n") + read(path2.join(home, ".bazelrc"));
  for (const m of bazelrc.matchAll(/--(remote_cache|remote_executor|disk_cache)[= ](\S+)/g)) out.push({ system: "bazel", kind: m[1] === "disk_cache" ? "local" : "remote", where: m[2] });
  const nx = read(path2.join(root, "nx.json"));
  if (nx) out.push(/"nxCloud(?:AccessToken|Id)"/.test(nx) || env.NX_CLOUD_ACCESS_TOKEN ? { system: "nx", kind: "remote", where: "Nx Cloud" } : { system: "nx", kind: "local", where: ".nx/cache" });
  if (existsSync2(path2.join(root, "turbo.json")))
    out.push(env.TURBO_TOKEN || /"token"/.test(read(path2.join(root, ".turbo", "config.json"))) ? { system: "turbo", kind: "remote", where: env.TURBO_API ?? "Vercel Remote Cache" } : { system: "turbo", kind: "local", where: ".turbo/cache" });
  const gradle = read(path2.join(root, "gradle.properties")) + read(path2.join(root, "settings.gradle")) + read(path2.join(root, "settings.gradle.kts"));
  if (/org\.gradle\.caching\s*=\s*true/.test(gradle) || /buildCache\s*\{/.test(gradle)) out.push({ system: "gradle", kind: /remote\s*[(<{]/.test(gradle) ? "remote" : "local", where: /remote\s*[(<{]/.test(gradle) ? "remote build cache" : "~/.gradle/caches/build-cache-1" });
  return out;
}

// items/quality/src/build/coverage.ts
import { existsSync as existsSync3, readFileSync as readFileSync2, statSync } from "node:fs";
import path3 from "node:path";
var REPORTS = ["coverage/lcov.info", "lcov.info", "coverage/coverage-final.json", "coverage-final.json", "coverage.xml", "coverage/cobertura-coverage.xml", "cobertura.xml", "coverage.out", "cover.out", "coverage.txt"];
function findReport(root) {
  const found = REPORTS.map((f) => path3.join(root, f)).filter((f) => existsSync3(f));
  return found.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
}
var add = (hits, file, line, n) => {
  const m = hits.get(file) ?? /* @__PURE__ */ new Map();
  m.set(line, Math.max(m.get(line) ?? 0, n));
  hits.set(file, m);
};
function parseCoverage(file, text) {
  const hits = /* @__PURE__ */ new Map();
  if (file.endsWith(".info")) {
    let current = "";
    for (const l of text.split("\n")) {
      if (l.startsWith("SF:")) current = l.slice(3).trim();
      else if (l.startsWith("DA:") && current) {
        const [line, n] = l.slice(3).split(",");
        add(hits, current, Number(line), Number(n));
      }
    }
  } else if (file.endsWith(".json")) {
    const j = JSON.parse(text);
    for (const [key, f] of Object.entries(j)) for (const [id, loc] of Object.entries(f.statementMap ?? {})) add(hits, f.path ?? key, loc.start.line, f.s?.[id] ?? 0);
  } else if (file.endsWith(".xml")) {
    for (const cls of text.matchAll(/<class\b[^>]*\bfilename="([^"]+)"[^>]*>([\s\S]*?)<\/class>/g))
      for (const ln of cls[2].matchAll(/<line\b[^>]*\bnumber="(\d+)"[^>]*\bhits="(\d+)"/g)) add(hits, cls[1], Number(ln[1]), Number(ln[2]));
  } else {
    for (const m of text.matchAll(/^(.+\.go):(\d+)\.\d+,(\d+)\.\d+ \d+ (\d+)$/gm)) for (let l = Number(m[2]); l <= Number(m[3]); l++) add(hits, m[1], l, Number(m[4]));
  }
  return hits;
}
async function addedLinesByFile(root) {
  const git = async (...a) => (await run("git", a, { cwd: root, timeoutMs: 3e4 }).catch(() => void 0))?.stdout ?? "";
  const out = /* @__PURE__ */ new Map();
  let file = "";
  for (const l of (await git("diff", "-U0", "--no-color", "HEAD")).split("\n")) {
    if (l.startsWith("+++ ")) file = l.slice(4).replace(/^b\//, "").trim();
    const h = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
    if (h && file && file !== "/dev/null") {
      const start = Number(h[1]);
      const n = h[2] === void 0 ? 1 : Number(h[2]);
      out.set(file, [...out.get(file) ?? [], ...Array.from({ length: n }, (_, i) => start + i)]);
    }
  }
  for (const f of (await git("ls-files", "--others", "--exclude-standard")).split("\n").filter(Boolean)) {
    try {
      out.set(f, Array.from({ length: readFileSync2(path3.join(root, f), "utf8").split("\n").length }, (_, i) => i + 1));
    } catch {
    }
  }
  return out;
}
function entryFor(hits, root, rel) {
  const abs = path3.join(root, rel);
  for (const [k, v] of hits) if (k === rel || k === abs || path3.resolve(root, k) === abs || k.endsWith(`/${rel}`)) return v;
  return void 0;
}
function uncoveredChanges(hits, root, added) {
  const out = [];
  for (const [file, lines2] of added) {
    const entry = entryFor(hits, root, file);
    if (!entry) continue;
    const missed = lines2.filter((l) => entry.get(l) === 0);
    if (missed.length) out.push({ file, lines: missed });
  }
  return out;
}
var ranges = (lines2) => lines2.reduce((acc, l) => {
  const last = acc.at(-1);
  if (last && l === last[1] + 1) last[1] = l;
  else acc.push([l, l]);
  return acc;
}, []).map(([a, b]) => a === b ? String(a) : `${a}-${b}`).join(", ");

// items/quality/src/build/mutate.ts
import { existsSync as existsSync4, readFileSync as readFileSync3 } from "node:fs";
import path4 from "node:path";
async function detectMutator(root, files) {
  const has = async (bin) => (await run(bin, ["--version"], { cwd: root, timeoutMs: 2e4 }).catch(() => void 0))?.code === 0;
  const stryker = path4.join(root, "node_modules", ".bin", process.platform === "win32" ? "stryker.cmd" : "stryker");
  if (files.some((f) => /\.[cm]?[jt]sx?$/.test(f)) && existsSync4(stryker)) return { tool: "stryker", bin: stryker };
  if (files.some((f) => f.endsWith(".py")) && await has("mutmut")) return { tool: "mutmut", bin: "mutmut" };
  if (files.some((f) => f.endsWith(".go")) && await has("go-mutesting")) return { tool: "go-mutesting", bin: "go-mutesting" };
  return void 0;
}
function strykerSurvivors(json, root) {
  const report = JSON.parse(json);
  return Object.entries(report.files ?? {}).flatMap(
    ([file, f]) => (f.mutants ?? []).filter((m) => m.status === "Survived" || m.status === "NoCoverage").map((m) => ({ file: path4.relative(root, path4.resolve(root, file)).split(path4.sep).join("/"), line: m.location.start.line, mutator: m.mutatorName, ...m.replacement ? { replacement: m.replacement } : {} }))
  );
}
async function mutate(root, files, m) {
  const timeoutMs = 30 * 6e4;
  if (m.tool === "stryker") {
    const src = files.filter((f) => /\.[cm]?[jt]sx?$/.test(f) && !/\.(test|spec)\.|__tests__/.test(f));
    if (!src.length) return { tool: "stryker", summary: "Only test files changed: nothing to mutate." };
    const r2 = await run(m.bin, ["run", "--mutate", src.join(","), "--reporters", "json,clear-text"], { cwd: root, timeoutMs }).catch((err) => ({ code: 1, stdout: "", stderr: err.message }));
    const report = path4.join(root, "reports", "mutation", "mutation.json");
    if (!existsSync4(report)) return { tool: "stryker", error: (r2.stderr || r2.stdout).trim().split("\n").slice(-5).join("\n") || "Stryker produced no report" };
    return { tool: "stryker", survivors: strykerSurvivors(readFileSync3(report, "utf8"), root) };
  }
  const args = m.tool === "mutmut" ? ["run", `--paths-to-mutate=${files.filter((f) => f.endsWith(".py")).join(",")}`] : files.filter((f) => f.endsWith(".go"));
  const r = await run(m.bin, args, { cwd: root, timeoutMs }).catch((err) => ({ code: 1, stdout: "", stderr: err.message }));
  let out = `${r.stdout}
${r.stderr}`.trim();
  if (m.tool === "mutmut") out = `${out}
${(await run("mutmut", ["results"], { cwd: root, timeoutMs: 6e4 }).catch(() => void 0))?.stdout ?? ""}`.trim();
  return { tool: m.tool, summary: out.split("\n").slice(-25).join("\n") };
}
function formatMutation(r) {
  if (r.error) return `${r.tool} failed: ${r.error}`;
  if (r.summary !== void 0) return `${r.tool}:
${r.summary}`;
  const s = r.survivors ?? [];
  if (!s.length) return `${r.tool}: every mutant in the changed files was caught by the tests.`;
  return [`${r.tool}: ${s.length} mutant${s.length === 1 ? "" : "s"} survived (the tests still pass with these bugs planted):`, ...s.slice(0, 30).map((m) => `  ${m.file}:${m.line} ${m.mutator}${m.replacement ? ` \u2192 ${m.replacement}` : ""}`)].join("\n");
}

// items/quality/src/tools/logDigest.ts
var ERROR = /\b(?:error|failed|failure|fatal|panic|exception|traceback|assert(?:ion)?error|cannot find|undefined reference|not found|segmentation fault)\b|✗|×|✕|FAIL\b|ERR!/i;
var NOISE = /^\s*(?:at\s+[\w.<>]+\s+\(node:|at\s+node:|at process\.|at Module\.|npm ERR! (?:A complete log|errno|code)|\d+ (?:passing|pending)\b)/;
var LOCATION = /(?:^|[\s(["'`])((?:[\w.-]+[\\/])*[\w.-]+\.[A-Za-z]{1,6})(?::(\d+)(?::\d+)?|\((\d+),\d+\))|File "([^"]+)", line (\d+)/g;
var STEP = /^(?:##\[group\](?:Run )?|section_start:\d+:[\w-]+\r?(?:\x1b\[0K)?|> Task )(.+)$/;
var strip = (s) => s.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "").replace(/^\d{4}-\d\d-\d\dT[\d:.]+Z\s/, "");
function digestLog(log, opts = {}) {
  const lines2 = log.split("\n").map(strip);
  let step;
  let failingStep;
  const errors = [];
  const locations = /* @__PURE__ */ new Set();
  for (const line of lines2) {
    const s = line.match(STEP);
    if (s) step = s[1].trim().slice(0, 120);
    if (!ERROR.test(line) || NOISE.test(line)) continue;
    failingStep ??= step;
    const t = line.trim();
    if (t && !errors.includes(t) && errors.length < (opts.maxErrors ?? 8)) errors.push(t.slice(0, 300));
  }
  for (const m of log.matchAll(LOCATION)) {
    const file = m[1] ?? m[4];
    const line = m[2] ?? m[3] ?? m[5];
    if (!file || !line || /node_modules|^node:|\.min\.|^https?$/.test(file)) continue;
    locations.add(`${file.replace(/\\/g, "/")}:${line}`);
    if (locations.size >= (opts.maxLocations ?? 10)) break;
  }
  return { step: failingStep, errors, locations: [...locations] };
}
function formatDigest(d, totalLines) {
  if (!d.errors.length && !d.locations.length) return void 0;
  return [
    `<log_digest lines="${totalLines}">`,
    ...d.step ? [`Failing step: ${d.step}`] : [],
    ...d.errors.length ? ["First errors:", ...d.errors.map((e) => `  ${e}`)] : [],
    ...d.locations.length ? [`Locations: ${d.locations.join(", ")}`] : [],
    "Start from these; the full output follows.",
    "</log_digest>"
  ].join("\n");
}

// items/quality/src/index.ts
function activate(rein2) {
  setHost(rein2);
  const on = (k) => rein2.settings.get(k) === true;
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  if (on("tool"))
    rein2.registerTool({
      name: "affected",
      label: "Affected",
      description: "What a change affects in this monorepo, from its build system's dependency graph (Nx, Turborepo, Bazel or Pants), and the command that tests just that. Without files: the working tree's changes vs HEAD. Use it to pick which tests to run instead of the whole suite.",
      inputSchema: { type: "object", properties: { files: { type: "array", items: { type: "string" }, description: "Changed files, relative to the project (default: git changes)" } } },
      summarize: (a) => Array.isArray(a?.files) ? `${a.files.length} files` : "working tree",
      async run(args, ctx) {
        if (!detectBuild(ctx.cwd)) return { ok: false, text: "No Nx, Turborepo, Bazel or Pants workspace here." };
        const files = Array.isArray(args?.files) && args.files.length ? args.files.map(String) : await changedFiles(ctx.cwd);
        if (!files.length) return { ok: true, text: "No changes (vs HEAD) to analyze." };
        const a = await affected(ctx.cwd, files);
        return a ? { ok: !a.note || a.targets.length > 0, text: formatAffected(a) } : { ok: false, text: "No build system answered." };
      }
    });
  rein2.checks.endOfTurn({
    id: "affected",
    async run(changed) {
      if (!on("check") || !changed.length) return void 0;
      const root = process.cwd();
      if (!detectBuild(root)) return void 0;
      const a = await affected(root, changed.map((f) => f.path));
      if (!a?.test) return void 0;
      const r = await rein2.shell(a.test, { timeoutMs: 60 * 6e4 });
      if (r.ok) return void 0;
      const out = r.text.trim();
      const digest = formatDigest(digestLog(out), out.split("\n").length);
      return `The tests for what this request changed failed (${a.system}: ${a.targets.slice(0, 8).join(", ")}${a.targets.length > 8 ? ", \u2026" : ""}; \`${a.test}\`):
${digest ?? out.split("\n").slice(-60).join("\n")}
Fix them before you finish, or if a failure isn't caused by this change, say so.`;
    }
  });
  rein2.registerCommand({
    name: "affected",
    description: "What your changes affect, and the command that tests just that",
    usage: "What your changes affect, from the monorepo's build graph (Nx, Turborepo, Bazel, Pants), and the command that tests just that; /affected tool on|off, /affected check on|off",
    async run(args, ctx) {
      const [sub, state] = args.trim().split(/\s+/);
      if (sub === "tool" || sub === "check") {
        if (state === "on" || state === "off") {
          rein2.settings.set(sub, state === "on");
          return ctx.log(sub === "tool" ? `The agent's affected tool is ${state} from the next time Rein starts.` : `The affected-tests check is ${state}: at the end of a request, the tests for what it changed run, and a failure goes back to the agent.`);
        }
        return ctx.log(`The agent's affected tool is ${on("tool") ? "on" : "off"}; the affected-tests check is ${on("check") ? "on" : "off"}. /affected tool|check on|off`);
      }
      if (!detectBuild(ctx.cwd)) return ctx.log("No Nx, Turborepo, Bazel or Pants workspace here (nx.json, turbo.json, MODULE.bazel/WORKSPACE, pants.toml).");
      const files = await changedFiles(ctx.cwd);
      if (!files.length) return ctx.log("No changes (vs HEAD) to analyze.");
      const a = await affected(ctx.cwd, files);
      ctx.log(a ? `${plural(files.length, "changed file")}. ${formatAffected(a)}` : "No build system answered.", a?.note && !a.targets.length ? "error" : "info");
    }
  });
  rein2.registerCommand({
    name: "build",
    description: "The build system here and its caches",
    usage: "The build system here (Nx, Turborepo, Bazel, Pants), its caches, and whether the sandbox lets agent builds use them",
    async run(_args, ctx) {
      const b = detectBuild(ctx.cwd);
      const caches = detectCaches(ctx.cwd);
      const sandbox = String(rein2.config().sandbox ?? "write");
      if (!b && !caches.length) return ctx.log("No Nx, Turborepo, Bazel or Pants workspace and no build cache configured here.");
      const remoteBlocked = sandbox === "strict" && caches.some((c) => c.kind === "remote");
      ctx.log(
        [
          b ? `Build system: ${b.system}${b.bin.includes("node_modules") ? " (from node_modules)" : ""}. /affected shows what your changes affect.` : "No monorepo build system (Nx, Turborepo, Bazel, Pants).",
          ...caches.length ? ["Caches:", ...caches.map((c) => `  ${c.system}: ${c.kind} (${c.where})`)] : ["No build cache configured."],
          remoteBlocked ? "The sandbox is strict (no network), so agent builds can't reach the remote cache: /settings sandbox write allows it." : caches.length ? `Agent builds use these: the sandbox (${sandbox}) leaves build caches writable${caches.some((c) => c.kind === "remote") && sandbox !== "off" ? " and the network open" : ""}.` : ""
        ].filter(Boolean).join("\n"),
        remoteBlocked ? "error" : "info"
      );
    }
  });
  rein2.registerCommand({
    name: "coverage",
    description: "Lines your changes add that no test covers",
    usage: "Lines your changes add that no test covers, from the last coverage report; /coverage tests asks the agent to write tests for them",
    async run(args, ctx) {
      const root = ctx.cwd;
      const report = findReport(root);
      if (!report) return ctx.log("No coverage report here (coverage/lcov.info, coverage-final.json, coverage.xml or a Go cover profile). Run your tests with coverage first.");
      const added = await addedLinesByFile(root);
      let hits;
      try {
        hits = parseCoverage(report, readFileSync4(report, "utf8"));
      } catch (err) {
        return ctx.log(`Couldn't read ${path5.relative(root, report)}: ${err.message}`, "error");
      }
      const missed = uncoveredChanges(hits, root, added);
      const age = Math.round((Date.now() - statSync2(report).mtimeMs) / 6e4);
      const from = `${path5.relative(root, report)} (${age < 1 ? "just now" : `${age} min ago`})`;
      if (!missed.length) return ctx.log(`Every changed line the report covers ran in a test, per ${from}.`);
      const list = missed.map((m) => `  ${m.file}: ${ranges(m.lines)}`);
      if (args.trim() !== "tests") return ctx.log([`Changed lines no test ran, per ${from}:`, ...list, "/coverage tests asks the agent to write tests for them."].join("\n"));
      ctx.send([`Write tests that cover these lines my changes added, which no test runs (from ${from}):`, ...list, "", "Follow the project's existing test style and location. Test the behavior, not just the lines; run the new tests to show they pass."].join("\n"));
    }
  });
  rein2.registerCommand({
    name: "mutate",
    description: "Mutation testing of your changed files",
    usage: "Mutation testing of your changed files (Stryker, mutmut, go-mutesting): do the tests catch planted bugs? /mutate tests asks the agent to close the gaps",
    async run(args, ctx) {
      const root = ctx.cwd;
      const files = await changedFiles(root);
      if (!files.length) return ctx.log("No changes (vs HEAD) to mutation-test.");
      const m = await detectMutator(root, files);
      if (!m) return ctx.log("No mutation tool for these files: install Stryker (npm i -D @stryker-mutator/core), mutmut (Python) or go-mutesting (Go).");
      ctx.log(`Running ${m.tool} on ${plural(files.length, "changed file")} (this can take a while)\u2026`);
      const r = await mutate(root, files, m);
      const text = formatMutation(r);
      if (args.trim() !== "tests" || !(r.survivors?.length || r.summary)) return ctx.log(text, r.error ? "error" : "info");
      ctx.send(`${text}

Strengthen the tests so they catch these: each surviving mutant is a bug the tests would miss. Add or tighten assertions (don't change the code under test to suit them), then run the tests.`);
    }
  });
}
export {
  activate
};
